import supabase from './supabase';

// Agregar usuario en sign up a tabla usuarios
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
    console.error('Error agregando usuario a Usuarios:', error.message);
    return null;
  }
};

// Obtener usuario por nombre de usuario
export const getUsuarioUsername = async (userId) => {
  if (!userId) {
    console.error('UserId inválido:', userId);
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
    console.error('Error obteniendo usuario de Usuarios:', error.message);
    return null;
  }
};

// Obtener posts públicos
export const getPostsPublicos = async () => {
  try {
    const { data, error } = await supabase
      .from('Posts')
      .select('*')
      .eq('Privacidad', 'FALSE'); // público es FALSE, privado es TRUE

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo posts públicos:', error.message);
    return null;
  }
};

// Obtener posts privados de amigos
export const getPostsDeAmigos = async (userUUID) => {

  try {
    // Obtener amigos del usuario
    const friends = await getFriends(userUUID);

    if (friends.length === 0) {
      return [];
    }

    const friendUUIDs = friends.map(friend => friend.User_Auth_Id);

    // Obtener posts privados de amigos
    const { data: postsData, error: postsError } = await supabase
      .from('Posts')
      .select('*')
      .in('UserUUID', friendUUIDs)
      .eq('Privacidad', true);

    if (postsError) {
      throw postsError;
    }

    return postsData;
  } catch (error) {
    console.error('Error obteniendo posts privados de amigos:', error.message);
    return [];
  }
};

// Obtener posts sin importar privacidad por ser administrador
export const getPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('Posts')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo posts:', error.message);
    return null;
  }
};

// Obtener UserId por User_Auth_Id
export const getUserIdByAuthId = async (authId) => {
  try {
    const { data, error } = await supabase
      .from("Usuarios")
      .select("UserId")
      .eq("User_Auth_Id", authId)
      .single(); // Solo un registro

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error obteniendo UserId por User_Auth_Id:", error.message);
    return null;
  }
};

// Obtener usuario por ID
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

// Obtener usuario por UUID
export const getUsuarioByUUID = async (uuid) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('User_Auth_Id', uuid)
    .single();

  if (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }

  return data;
};

// Obtener posts por usuario
export const getPostsByUser = async (userUUID) => {
  const { data, error } = await supabase
    .from('Posts')
    .select('*')
    .eq('UserUUID', userUUID);

  if (error) {
    console.error('Error obteniendo posts:', error);
    return [];
  }

  return data;
};

// Obtener conteo de amigos
export const getFriendsCount = async (userUUID) => {
  const { data, error } = await supabase
    .from('Amigos')
    .select('*', { count: 'exact' })
    .or(`UserUUID.eq.${userUUID},AmigoUUID.eq.${userUUID}`);

  if (error) {
    console.error('Error obteniendo conteo de amigos:', error);
    return 0;
  }

  return data.length;
};

// Obtener amigos
export const getFriends = async (userUUID) => {
  try {
    const { data, error } = await supabase
      .from('Amigos')
      .select('AmigoUUID, Usuarios!AmigoUUID(UserName)')
      .eq('UserUUID', userUUID);

    if (error) {
      throw error;
    }

    return data.map(friend => ({
      User_Auth_Id: friend.AmigoUUID,
      UserName: friend.Usuarios.UserName
    }));
  } catch (error) {
    console.error('Error obteniendo amigos:', error.message);
    return [];
  }
};

// Obtener usuarios excluyendo uno
export const getSugerencias = async (userUUIDActual) => {
  try {
    const { data, error } = await supabase
      .from("Usuarios")
      .select("User_Auth_Id, UserName")
      .neq("User_Auth_Id", userUUIDActual); // Excluye el usuario actual

    if (error) {
      throw error;
    }

    return data; // Devuelve la lista de usuarios
  } catch (error) {
    console.error("Error obteniendo usuarios excluyendo uno:", error.message);
    return [];
  }
};

// Subir imagen de perfil
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
        console.error('Error subiendo imagen de perfil:', error.message);
        reject(error);
      } else {
        resolve(base64String);
      }
    };

    reader.onerror = (error) => {
      console.error('Error leyendo archivo:', error);
      reject(error);
    };
  });
};

// Subir imagen de post
export const uploadPostImage = async (userUUID, file) => {
  // Obtener archivos existentes en la carpeta del usuario
  const { data: listData, error: listError } = await supabase.storage
    .from('Posts')
    .list(userUUID);

  if (listError && listError.message !== 'The resource was not found') {
    console.error('Error listando carpeta:', listError.message);
    return null;
  }

  // Determinar el índice más alto existente
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

  // Crear un nuevo nombre de archivo con el siguiente índice
  const newIndex = maxIndex + 1;
  const fileExtension = file.name.split('.').pop();
  const filePath = `${userUUID}/${userUUID}_${newIndex}.${fileExtension}`;

  // Subir el archivo
  const { data, error } = await supabase.storage
    .from('Posts')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error subiendo imagen de post:', error.message);
    return null;
  }

  // Construir la URL pública manualmente
  const publicURL = `https://uxiytxuyozhaolqjauzv.supabase.co/storage/v1/object/public/Posts/${filePath}`;

  return publicURL;
};

// Crear post
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
    console.error('Error creando post:', error.message);
    return null;
  }
};

// Obtener conteo de posts por usuario
export const getPostCountByUser = async (userUUID) => {
  const { data, error } = await supabase
    .from('Posts')
    .select('*', { count: 'exact' })
    .eq('UserUUID', userUUID);

  if (error) {
    console.error('Error obteniendo conteo de posts:', error.message);
    return 0;
  }

  return data.length;
};

// Agregar amigo
export const addFriend = async (userUUID, amigoUUID) => {
  try {
    const { data, error } = await supabase
      .from('Amigos')
      .insert([
        { UserUUID: userUUID, AmigoUUID: amigoUUID }
      ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error agregando amigo:', error.message);
    return null;
  }
};

// Verificar amistad
export const checkFriendship = async (userUUID, amigoUUID) => {
  try {
    const { data, error } = await supabase
      .from('Amigos')
      .select('*')
      .or(`UserUUID.eq.${userUUID},AmigoUUID.eq.${userUUID}`)
      .or(`UserUUID.eq.${amigoUUID},AmigoUUID.eq.${amigoUUID}`)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 significa que no se encontraron filas
      throw error;
    }

    return data ? true : false;
  } catch (error) {
    console.error('Error verificando amistad:', error.message);
    return false;
  }
};

// Obtener roles
export const getRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('Roles')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo roles:', error.message);
    return [];
  }
};

// Insertar UserUUID en RolesUsuario con rol por defecto "Usuario"
export const SetRole = async (userUUID) => {
  try {
    // Obtener el ID del rol "Usuario"
    const { data: roles, error: rolesError } = await supabase
      .from('Roles')
      .select('id')
      .eq('Rol', 'Usuario')
      .single();

    if (rolesError) {
      throw rolesError;
    }

    const roleId = roles.id;

    // Insertar en RolesUsuario
    const { data, error } = await supabase
      .from('RolesUsuario')
      .insert([
        { IdRole: roleId, UserUUID: userUUID }
      ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error asignando rol por defecto al usuario:', error.message);
    return null;
  }
};

// Función para actualizar usuarios en SUPABASE
export const updateUserProfile = async (userId, username, bio) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .update({ UserName: username, Bio: bio })
    .eq('User_Auth_Id', userId)
    .select();

  if (error) {
    console.error('Error updating profile:', error);
    return { error };
  }
  return { data };
};
// Obtener el rol del usuario basado en el UUID de localstorage
export const getRole = async (userUUID) => {
  try {
    const { data, error } = await supabase
      .from('RolesUsuario')
      .select('IdRole')
      .eq('UserUUID', userUUID)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo rol del usuario:', error.message);
    return null;
  }
};

// Obtener el nombre del rol basado en IdRole
export const getRoleName = async (roleId) => {
  try {
    const { data, error } = await supabase
      .from('Roles')
      .select('Rol')
      .eq('id', roleId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo nombre del rol:', error.message);
    return null;
  }
};

// Obtener comentarios por post
export const getCommentsByPost = async (postId) => {
  try {
    // Primero, obtener los comentarios a través de la tabla ComentariosPost
    const { data: commentPostData, error: commentPostError } = await supabase
      .from('ComentariosPost')
      .select(`
        ComentarioId,
        Comentarios (
          id,
          Contenido,
          UserUUID,
          created_at
        )
      `)
      .eq('PostId', postId);

    if (commentPostError) {
      throw commentPostError;
    }

    if (commentPostData.length === 0) {
      return [];
    }

    // Obtener nombres de usuario para cada comentario
    const commentsWithUsernames = await Promise.all(
      commentPostData.map(async (commentPost) => {
        const { data: userData, error: userError } = await supabase
          .from('Usuarios')
          .select('UserName')
          .eq('User_Auth_Id', commentPost.Comentarios.UserUUID)
          .single();

        if (userError) {
          throw userError;
        }

        return {
          id: commentPost.Comentarios.id,
          Contenido: commentPost.Comentarios.Contenido,
          UserName: userData.UserName,
          created_at: commentPost.Comentarios.created_at
        };
      })
    );

    return commentsWithUsernames;
  } catch (error) {
    console.error('Error obteniendo comentarios por post:', error.message);
    return [];
  }
};

// Obtener post por ID
export const getPostById = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('Posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo post por ID:', error.message);
    return null;
  }
};

// Eliminar comentario
export const deleteComment = async (commentId) => {
  try {
    const { data, error } = await supabase
      .from('Comentarios')
      .delete()
      .eq('id', commentId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error eliminando comentario:', error.message);
    return null;
  }
};

// Eliminar post
export const deletePost = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('Posts')
      .delete()
      .eq('id', postId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error eliminando post:', error.message);
    return null;
  }
};

// Crear comentario
export const createComment = async (postId, userUUID, contenido) => {
  try {
    // Primero crear el comentario en la tabla Comentarios
    const { data: commentData, error: commentError } = await supabase
      .from('Comentarios')
      .insert([
        { UserUUID: userUUID, Contenido: contenido }
      ])
      .select()
      .single();

    if (commentError) {
      throw commentError;
    }

    // Luego crear la relación en la tabla ComentariosPost
    const { data: commentPostData, error: commentPostError } = await supabase
      .from('ComentariosPost')
      .insert([
        {
          PostId: postId,
          ComentarioId: commentData.id
        }
      ]);

    if (commentPostError) {
      throw commentPostError;
    }

    return commentData;
  } catch (error) {
    console.error('Error creando comentario:', error.message);
    return null;
  }
};

// Obtener cantidad de comentarios por post
export const getCommentCount = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('ComentariosPost')
      .select('*', { count: 'exact' })
      .eq('PostId', postId);

    if (error) {
      throw error;
    }

    return data.length;
  } catch (error) {
    console.error('Error obteniendo cantidad de comentarios:', error.message);
    return 0;
  }
};

// Verificar si un usuario ya dio like a un post
export const checkUserLike = async (postId, userUUID) => {
  if (!userUUID) {
    console.log('usuario no tiene cuenta', userUUID);
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('LikesPost')
      .select(`id, Likes!inner (UserUUID)`)
      .eq('PostId', postId)
      .eq('Likes.UserUUID', userUUID);

    if (error) {
      throw error;
    }

    return data.length > 0;
  } catch (error) {
    console.error('Error verificando like del usuario:', error.message);
    return false;
  }
};

// Obtener cantidad de likes por post
export const getLikeCount = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('LikesPost')
      .select('*', { count: 'exact' })
      .eq('PostId', postId);

    if (error) {
      throw error;
    }

    return data.length;
  } catch (error) {
    console.error('Error obteniendo cantidad de likes:', error.message);
    return 0;
  }
};

// Crear like
export const createLike = async (postId, userUUID) => {
  try {
    // Primero crear el like en la tabla Likes
    const { data: likeData, error: likeError } = await supabase
      .from('Likes')
      .insert([
        { UserUUID: userUUID }
      ])
      .select()
      .single();

    if (likeError) {
      throw likeError;
    }

    // Luego crear la relación en la tabla LikesPost
    const { data: likePostData, error: likePostError } = await supabase
      .from('LikesPost')
      .insert([
        {
          PostId: postId,
          LikeId: likeData.id
        }
      ]);

    if (likePostError) {
      throw likePostError;
    }

    return likeData;
  } catch (error) {
    console.error('Error creando like:', error.message);
    return null;
  }
};

// Eliminar like
export const deleteLike = async (postId, userUUID) => {
  try {
    // Primero obtener el ID del like
    const { data: likeData, error: likeError } = await supabase
      .from('Likes')
      .select('id')
      .eq('UserUUID', userUUID)
      .single();

    if (likeError) {
      throw likeError;
    }

    // Eliminar de LikesPost
    const { error: likePostError } = await supabase
      .from('LikesPost')
      .delete()
      .eq('LikeId', likeData.id);

    if (likePostError) {
      throw likePostError;
    }

    // Eliminar de Likes
    const { error: deleteError } = await supabase
      .from('Likes')
      .delete()
      .eq('id', likeData.id);

    if (deleteError) {
      throw deleteError;
    }

    return true;
  } catch (error) {
    console.error('Error eliminando like:', error.message);
    return false;
  }
};

//ELIMINAR USUARIOS
export const deleteUser = async (userUUID) => {
    const { error: deleteError } = await supabase
      .from('Usuarios') 
      .delete('*')
      .eq('User_Auth_Id', userUUID);

    if (deleteError) {
      throw new Error('Error al eliminar la cuenta: ' + deleteError.message);
    }
    return { success: true, message: 'Cuenta eliminada con éxito' };
}


