import React, { useState, useEffect } from 'react';
import { getPostsPublicos, getPostsDeAmigos, getUsuarioUsername, getCommentCount, getLikeCount, checkUserLike, createLike, deleteLike } from '../supabase/api';
import { CommentModal } from './CommentModal';

/*
 * Este es un componente para hacer los Bootstrap Cards para los post.
*/

export const PostCards = ({ postType }) => {
  const [postObj, setPostObj] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  // Obtiene el nombre de usuario basado en el UUID del usuario
  const fetchUser = async (userAuthId) => {
    if (!userAuthId) {
      console.error('Invalid userAuthId:', userAuthId);
      return 'null';
    }
    const user = await getUsuarioUsername(userAuthId);
    return user && user.length > 0 ? user[0].UserName : 'null';
  }

  // Efecto para obtener los posts y sus datos adicionales
  useEffect(() => {
    const fetchPosts = async () => {
      let posts = [];
      if (postType === 'explorar') {
        posts = await getPostsPublicos();
      } else if (postType === 'amigos') {
        const uuid = localStorage.getItem('userId');
        if(!uuid) {
          window.location.href = '/login';
          return;
        }

        const UUID_formatted = uuid.replace(/['"]+/g, ''); // Eliminar comillas simples del UserUUID
        posts = await getPostsDeAmigos(UUID_formatted);
      }

      const userUUID = JSON.parse(localStorage.getItem('userId'));

      // Por cada post, buscamos el username del usuario, cantidad de comentarios y likes
      const postsWithData = await Promise.all(posts.map(async post => {
        const username = await fetchUser(post.UserUUID);
        const commentCount = await getCommentCount(post.id);
        const likeCount = await getLikeCount(post.id);
        const isLiked = await checkUserLike(post.id, userUUID);
        
        // Actualiza los estados de likes
        setLikedPosts(prev => ({...prev, [post.id]: isLiked}));
        setLikeCounts(prev => ({...prev, [post.id]: likeCount}));

        return { 
          ...post, 
          user: username,
          commentCount: commentCount,
          likeCount: likeCount,
          isLiked: isLiked
        };
      }));

      setPostObj(postsWithData);
    };

    fetchPosts();
  }, [postType]);

  // Formatea la fecha en un formato legible
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Renderiza el post (imagen o video) basado en la extensión del archivo
  const renderMedia = (postPath) => {
    const fileExtension = postPath.split('.').pop().toLowerCase();
    if (fileExtension === 'mp4') {
      return (
        <video className="card-img-top" controls>
          <source src={postPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <img src={postPath || "https://via.placeholder.com/150"} className="card-img-top" alt="imagen post" />;
    }
  };

  // Maneja el clic en el botón de comentarios
  const handleCommentClick = (post) => {
    const userUUID = JSON.parse(localStorage.getItem('userId'));
    if (!userUUID) {
      window.location.href = '/login';
      return;
    }
    setSelectedPost(post);
    setShowModal(true);
  };

  // Maneja el cierre del modal de comentarios
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  // Maneja el clic en el botón de like
  const handleLikeClick = async (postId) => {
    const userUUID = JSON.parse(localStorage.getItem('userId'));
    if (!userUUID) {
      window.location.href = '/login';
      return;
    }

    const isLiked = likedPosts[postId];
    
    if (isLiked) {
      await deleteLike(postId, userUUID);
      setLikeCounts(prev => ({...prev, [postId]: prev[postId] - 1}));
    } else {
      await createLike(postId, userUUID);
      setLikeCounts(prev => ({...prev, [postId]: prev[postId] + 1}));
    }
    
    setLikedPosts(prev => ({...prev, [postId]: !isLiked}));
  };

  return (
    <>
      {
        postObj.map((post) => (
          <div className="card w-100 mb-3" key={post.id}>
            <div className="card-header">
              @{post.user}
            </div>
            {renderMedia(post.PostPath)}
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <i 
                    className={`bi bi-trophy${likedPosts[post.id] ? '-fill' : ''} me-1`}
                    onClick={() => handleLikeClick(post.id)}
                    style={{ cursor: 'pointer' }}
                  ></i>
                  <span className="me-3">{likeCounts[post.id] || 0}</span>
                  <i className="bi bi-chat me-1" onClick={() => handleCommentClick(post)}></i>
                  <span className="me-2">{post.commentCount}</span>
                </div>
                <small className="text-muted">
                  {formatDate(post.created_at)}
                </small>
              </div>
              <p className="card-text">{post.Descripcion}</p>
            </div>
          </div>
        ))
      }
      {selectedPost && (
        <CommentModal
          show={showModal}
          handleClose={handleCloseModal}
          post={selectedPost}
        />
      )}
    </>
  );
};
