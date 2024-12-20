import supabase from './supabase';

export const subscribeToFriendRequests = (showNotification) => {
  // Friend Requests Subscription (new requests)
  const requestSubscription = supabase
    .channel('friend-requests')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'SolicitudesAmistad'
      },
      async (payload) => {
        const currentUserId = JSON.parse(localStorage.getItem('userId'));
        if (payload.new.AmigoUUID === currentUserId) {
          const { data: userData } = await supabase
            .from('Usuarios')
            .select('UserName')
            .eq('User_Auth_Id', payload.new.UserUUID)
            .single();

          if (userData) {
            showNotification(`${userData.UserName} te ha enviado una solicitud de amistad!`);
          }
        }
      }
    )
    // Friend Requests Status Changes (acceptances)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'SolicitudesAmistad',
        filter: 'estado=eq.aceptado'
      },
      async (payload) => {
        const currentUserId = JSON.parse(localStorage.getItem('userId'));
        // Notify the original sender when their request is accepted
        if (payload.new.UserUUID === currentUserId) {
          const { data: userData } = await supabase
            .from('Usuarios')
            .select('UserName')
            .eq('User_Auth_Id', payload.new.AmigoUUID)
            .single();

          if (userData) {
            showNotification(`¡${userData.UserName} ha aceptado tu solicitud de amistad!`);
          }
        }
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(requestSubscription);
  };
};