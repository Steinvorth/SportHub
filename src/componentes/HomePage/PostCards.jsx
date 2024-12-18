import React, { useState, useEffect } from 'react';
import { getPostsPublicos, getUsuarioUsername, getCommentCount } from '../supabase/api';
import { CommentModal } from './CommentModal';

/*
 * Este es un componente para hacer los Bootstrap Cards para los post.
*/

export const PostCards = () => {
  const [postObj, setPostObj] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUser = async (userAuthId) => {
    if (!userAuthId) {
      console.error('Invalid userAuthId:', userAuthId);
      return 'null';
    }
    const user = await getUsuarioUsername(userAuthId);
    return user && user.length > 0 ? user[0].UserName : 'null';
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPostsPublicos();

      //por cada post, buscamos el username del usuario y cantidad de comentarios
      const postsWithData = await Promise.all(posts.map(async post => {
        const username = await fetchUser(post.UserUUID);
        const commentCount = await getCommentCount(post.id);
        return { 
          ...post, 
          user: username,
          commentCount: commentCount 
        };
      }));

      setPostObj(postsWithData);
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
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
                  <i className="bi bi-trophy me-3"></i>
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
