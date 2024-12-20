import supabase from './supabase';

export const subscribeToFriendRequests = (showNotification) => {
  console.log('Subscribing to friend requests...');
  
  const subscription = supabase
    .channel('friend-requests')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'SolicitudesAmistad'
      },
      async (payload) => {
        console.log('Received friend request:', payload);
        
        const currentUserId = JSON.parse(localStorage.getItem('userId'));
        if (payload.new.AmigoUUID === currentUserId) {
          console.log('Friend request is for current user');
          
          const { data: userData, error } = await supabase
            .from('Usuarios')
            .select('UserName')
            .eq('User_Auth_Id', payload.new.UserUUID)
            .single();

          if (!error && userData) {
            console.log('Showing notification for:', userData.UserName);
            showNotification(`${userData.UserName} te ha enviado una solicitud de amistad!`);
          }
        }
      }
    )
    .subscribe();

  return () => {
    console.log('Unsubscribing from friend requests...');
    supabase.removeChannel(subscription);
  };
};