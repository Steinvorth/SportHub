import supabase from "./supabase";

// **Agregar Usuario**: Inserta un nuevo usuario en la tabla `Usuarios`
export const addUsuario = async (userAuthId, userName) => {
  try {
    const { data, error } = await supabase
      .from("Usuarios")
      .insert([{ User_Auth_Id: userAuthId, UserName: userName }]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error al agregar usuario:", error.message);
    return null;
  }
};

// **Obtener Usuario**: Recupera el username del usuario autenticado
export const getUsuarioUsername = async (userId) => {
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


// **Obtener Posts Públicos**: Recupera los posts con privacidad pública (TRUE)
export const getPostsPublicos = async () => {
  try {
    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .eq("Privacidad", "TRUE"); // TRUE indica posts públicos

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error obteniendo posts públicos:", error.message);
    return [];
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