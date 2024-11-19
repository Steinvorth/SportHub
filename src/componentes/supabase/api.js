import supabase from './supabase';

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