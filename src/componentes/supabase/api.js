import supabase from './supabase';

//agregar usuario en sign up a tabla usuarios
export const addUsuario = async (userAuthId, userName) => {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .insert([
        { User_Auth_Id: userAuthId, UserName: userName }
      ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding user to Usuarios:', error.message);
    return null;
  }
};

//get usuario
export const getUsuarioUsername = async (userId) => {
  if (!userId) {
    console.error('Invalid userId:', userId);
    return null;
  }
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .select('UserName')
      .eq('UserId', userId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting user from Usuarios:', error.message);
    return null;
  }
};

//get posts publicos
export const getPostsPublicos = async () => {
  try {
    const { data, error } = await supabase
      .from('Posts')
      .select('*')
      .eq('Privacidad', 'TRUE'); //publico es TRUE, privado es FALSE

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting public posts:', error.message);
    return null;
  }
};