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
      .eq('User_Auth_Id', userId);

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
      .eq('Privacidad', 'FALSE'); //publico es FALSE, privado es TRUE

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

// **Obtener Usuario por UUID**: Recupera la información del usuario autenticado
export const getUsuarioByUUID = async (uuid) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('User_Auth_Id', uuid)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
};

// **Obtener Posts por Usuario**: Recupera los posts del usuario autenticado
export const getPostsByUser = async (userUUID) => {
  const { data, error } = await supabase
    .from('Posts')
    .select('*')
    .eq('UserUUID', userUUID);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data;
};

// **Obtener Conteo de Amigos**: Recupera el conteo de amigos del usuario autenticado
export const getFriendsCount = async (userUUID) => {
  const { data, error } = await supabase
    .from('Amigos')
    .select('*', { count: 'exact' })
    .or(`UserUUID.eq.${userUUID},AmigoUUID.eq.${userUUID}`);

  if (error) {
    console.error('Error fetching friends count:', error);
    return 0;
  }

  return data.length;
};

// **subir profile picture.
export const uploadUserProfileImage = async (userId, file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64String = reader.result.split(',')[1];

      const { data, error } = await supabase
        .from('Usuarios')
        .update({ ProfilePic: base64String })
        .eq('User_Auth_Id', userId);

      if (error) {
        console.error('Error uploading profile image:', error.message);
        reject(error);
      } else {
        resolve(base64String);
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };
  });
};

// ** Subir Imagen **
export const uploadPostImage = async (userUUID, file) => {
  // Fetch existing files in the user's folder
  const { data: listData, error: listError } = await supabase.storage
    .from('Posts')
    .list(userUUID);

  if (listError && listError.message !== 'The resource was not found') {
    console.error('Error listing folder:', listError.message);
    return null;
  }

  // Determine the highest existing index
  let maxIndex = 0;
  if (listData) {
    listData.forEach(file => {
      const match = file.name.match(new RegExp(`${userUUID}_(\\d+)\\.`));
      if (match) {
        const index = parseInt(match[1], 10);
        if (index > maxIndex) {
          maxIndex = index;
        }
      }
    });
  }

  // Create a new filename with the next index
  const newIndex = maxIndex + 1;
  const fileExtension = file.name.split('.').pop();
  const filePath = `${userUUID}/${userUUID}_${newIndex}.${fileExtension}`;

  // Upload the file
  const { data, error } = await supabase.storage
    .from('Posts')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading post image:', error.message);
    return null;
  }

  // Construct the public URL manually
  const publicURL = `https://uxiytxuyozhaolqjauzv.supabase.co/storage/v1/object/public/Posts/${filePath}`;

  return publicURL;
};

// **Crear post **
export const createPost = async (userUUID, description, privacy, postPath) => {
  try {
    const { data, error } = await supabase
      .from('Posts')
      .insert([
        { UserUUID: userUUID, Descripcion: description, Privacidad: privacy, PostPath: postPath }
      ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating post:', error.message);
    return null;
  }
};

// ** Get Post **
export const getPostCountByUser = async (userUUID) => {
  const { data, error } = await supabase
    .from('Posts')
    .select('*', { count: 'exact' })
    .eq('UserUUID', userUUID);

  if (error) {
    console.error('Error fetching post count:', error.message);
    return 0;
  }

  return data.length;
};