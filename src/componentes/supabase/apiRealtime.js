import supabase from './supabase';

export const subscribeToFriendRequests = (showNotification) => {
  // Friend Requests and Likes Subscriptions
  const subscription = supabase
    .channel('social-notifications')
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
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'LikesPost'
      },
      async (payload) => {
        const currentUserId = JSON.parse(localStorage.getItem('userId'));
        
        // Get the post details to find the post owner
        const { data: postData } = await supabase
          .from('Posts')
          .select('UserUUID')
          .eq('id', payload.new.PostId)
          .single();

        if (postData && postData.UserUUID === currentUserId) {
          // Get the like details
          const { data: likeData } = await supabase
            .from('Likes')
            .select('UserUUID')
            .eq('id', payload.new.LikeId)
            .single();

          if (likeData) {
            // Get the username of the person who liked
            const { data: userData } = await supabase
              .from('Usuarios')
              .select('UserName')
              .eq('User_Auth_Id', likeData.UserUUID)
              .single();

            if (userData) {
              showNotification(`¡${userData.UserName} le ha dado like a tu post!`);
            }
          }
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};