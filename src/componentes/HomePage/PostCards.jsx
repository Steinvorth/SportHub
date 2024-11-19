import React, { useState, useEffect } from 'react';
import { getPostsPublicos, getUsuarioUsername } from '../supabase/api';

/*
 * Este es un componente para hacer los Bootstrap Cards para los post.
*/

export const PostCards = () => {
  const [postObj, setPostObj] = useState([]);

  const fetchUser = async (id) => {
    if (!id) {
      console.error('Invalid userId:', id);
      return 'null';
    }
    const user = await getUsuarioUsername(id);
    return user && user.length > 0 ? user[0].UserName : 'null';
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPostsPublicos();

      console.log(posts);

      //por cada post, buscamos el username del usuario para mostrarlo.
      const postsWithUsernames = await Promise.all(posts.map(async post => {
        const username = await fetchUser(post.IdUsuario);
        return { ...post, user: username };
      }));

      setPostObj(postsWithUsernames);
    };

    fetchPosts();
  }, []);

  return (
    <>
      {
        postObj.map((post) => (
          <div className="card w-100" key={post.id}>
            <div className="card-header">
              @{post.user}
            </div>
            <img src="https://via.placeholder.com/150" className="card-img-top" alt="imagen post"></img>
              <div className="card-body">
                <i className="bi bi-trophy"></i> {/* Trofeo para simular el Like */}
                <i class="bi bi-chat"></i> {/* Commments */}
                <p className="card-text">{post.Descripcion}</p>
              </div>
          </div>
        ))
      }
    </>
  );
};
