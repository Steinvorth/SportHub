import React, { useEffect, useState } from 'react';
import { getPostById, getCommentsByPost, deletePost, deleteComment, getUsuarioUsername  } from '../supabase/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const DetallePost = ({ postId, show, handleClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const userUUID = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    const fetchPostDetails = async () => {
      const postData = await getPostById(postId);
      setPost(postData);

      // Get the username of the post owner
      const usernameData = await getUsuarioUsername(postData.UserUUID);
      setUsername(usernameData[0].UserName);

      const commentsData = await getCommentsByPost(postId);
      setComments(commentsData);
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const handleDeletePost = async () => {
    await deletePost(postId);
    handleClose(true); // Pass true to indicate that the posts should be refreshed
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter(comment => comment.id !== commentId));
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

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-xl" style={{ marginTop: '2%' }}>
        <div className="modal-content bg-white shadow-sm">
          <div className="modal-header border-0">
            <h5 className="modal-title text-dark">Detalle del Post</h5>
            <button 
              type="button" 
              className="btn-close bg-black" 
              onClick={() => handleClose(false)} 
              aria-label="Close"
              style={{ opacity: 0.5 }}
            >
            </button>
          </div>
          <div className="modal-body d-flex">
            <div className="flex-grow-1" style={{ flexBasis: '60%' }}>
              {post && (
                <div className="card shadow-sm bg-white" style={{ border: '1px solid #dee2e6' }}>
                  <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                    <span className="text-dark">@{username}</span>
                    {post.UserUUID === userUUID && (
                      <button className="btn btn-outline-danger btn-sm">
                        <i className="bi bi-trash3" onClick={handleDeletePost}></i>
                      </button>
                    )}
                  </div>
                  <div className="position-relative">
                    {renderMedia(post.PostPath)}
                  </div>
                  <div className="card-body">
                    <p className="card-text text-dark">{post.Descripcion}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="comments-section ms-3 bg-white p-3 rounded shadow-sm" 
              style={{ 
                flexBasis: '40%', 
                maxHeight: '540px', 
                overflowY: 'auto',
                border: '1px solid #dee2e6'
              }}>
              <h5 className="text-dark mb-3">Comentarios</h5>
              <ul className="list-group list-group-flush">
                {comments.map(comment => (
                  <li key={comment.id} className="list-group-item bg-white border-0 mb-2 d-flex justify-content-between align-items-start">
                    <div>
                      <span className="text-dark">@{comment.UserName}</span>
                      <div className="text-dark mt-1">{comment.Contenido}</div>
                    </div>
                    {post.UserUUID === userUUID && (
                      <button className="btn btn-outline-danger btn-sm">
                        <i className="bi bi-trash3" onClick={() => handleDeleteComment(comment.id)}></i>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
