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
// **Obtener UserId por User_Auth_Id**: Devuelve el UserId a partir del User_Auth_Id del usuario logueado
export const getUserIdByAuthId = async (authId) => {
  try {
    const { data, error } = await supabase
      .from("Usuarios")
      .select("UserId")
      .eq("User_Auth_Id", authId)
      .single(); // Solo  registro

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error obteniendo UserId por User_Auth_Id:", error.message);
    return null;
  }
};

// **Obtener Usuarios Excluyendo Uno**: Devuelve todos los usuarios excepto el actual de sugerencias en la pag friends 
export const getSugerencias = async (userIdActual) => {
  try {
    const { data, error } = await supabase
      .from("Usuarios")
      .select("UserId, UserName")
      .neq("UserId", userIdActual); // Excluye el usuario actual

    if (error) {
      throw error;
    }

    return data; // Devuelve la lista de usuarios
  } catch (error) {
    console.error("Error obteniendo usuarios excluyendo uno:", error.message);
    return [];
  }
};


// **Obtener Usuario**: Recupera el username del usuario autenticado
export const getUsuario = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("Usuarios")
      .select("UserName")
      .eq("UserId", userId)
      .single(); // Solo un registro

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error obteniendo el nombre de usuario:", error.message);
    return null;
  }
};