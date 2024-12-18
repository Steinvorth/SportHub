import React, { useEffect, useState } from 'react';
import { getPostById, getCommentsByPost, deletePost, deleteComment, getUsuarioUsername } from '../supabase/api';

export const DetallePost = ({ postId, show, handleClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const userUUID = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    const fetchPostDetails = async () => {
      const postData = await getPostById(postId);
      setPost(postData);

      const commentsData = await getCommentsByPost(postId);
      setComments(commentsData);
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const handleDeletePost = async () => {
    await deletePost(postId);
    handleClose();
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
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle del Post</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body d-flex">
            <div className="flex-grow-1" style={{ flexBasis: '60%' }}>
              {post && (
                <div className="card w-100 mb-3">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    @{post.UserUUID}
                    {post.UserUUID === userUUID && (
                      <button className="btn btn-danger btn-sm" onClick={handleDeletePost}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    )}
                  </div>
                  {renderMedia(post.PostPath)}
                  <div className="card-body">
                    <p className="card-text">{post.Descripcion}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="comments-section ms-3" style={{ flexBasis: '40%', maxHeight: '500px', overflowY: 'auto' }}>
              <h5>Comentarios</h5>
              <ul className="list-group">
                {comments.map(comment => (
                  <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>@{comment.UserName}</strong>: {comment.Contenido}
                    </div>
                    {comment.UserUUID === userUUID && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.id)}>
                        <i className="bi bi-trash3"></i>
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