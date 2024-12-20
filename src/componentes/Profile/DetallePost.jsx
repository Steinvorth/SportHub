import React, { useEffect, useState } from 'react';
import { 
  getPostById, 
  getCommentsByPost, 
  deletePost, 
  deleteComment, 
  getUsuarioUsername,
  createComment,
  getLikeCount,
  checkUserLike,
  createLike,
  deleteLike 
} from '../supabase/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const DetallePost = ({ postId, show, handleClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const userUUID = JSON.parse(localStorage.getItem('userId'));

  // Add new state
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPostDetails = async () => {
      const postData = await getPostById(postId);
      setPost(postData);

      const usernameData = await getUsuarioUsername(postData.UserUUID);
      setUsername(usernameData[0].UserName);

      const commentsData = await getCommentsByPost(postId);
      setComments(commentsData);

      // Add like data fetching
      const likes = await getLikeCount(postId);
      setLikeCount(likes);

      const userLiked = await checkUserLike(postId, userUUID);
      setIsLiked(userLiked);
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId, userUUID]);

  const handleDeletePost = async () => {
    await deletePost(postId);
    handleClose(true); // Pass true to indicate that the posts should be refreshed
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  // Add new handlers
  const handleCommentSubmit = async () => {
    if (newComment.trim() && userUUID) {
      await createComment(postId, userUUID, newComment);
      const commentsData = await getCommentsByPost(postId);
      setComments(commentsData);
      setNewComment('');
    }
  };

  const handleLikeClick = async () => {
    if (!userUUID) {
      window.location.href = '/login';
      return;
    }

    if (isLiked) {
      await deleteLike(postId, userUUID);
      setLikeCount(prev => prev - 1);
    } else {
      await createLike(postId, userUUID);
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
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
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i 
                          className={`bi bi-trophy${isLiked ? '-fill' : ''} me-1`}
                          onClick={handleLikeClick}
                          style={{ cursor: 'pointer', color: '#212529' }}
                        ></i>
                        <span className="text-dark">{likeCount}</span>
                      </div>
                      {post.UserUUID === userUUID && (
                        <button className="btn btn-outline-danger btn-sm">
                          <i className="bi bi-trash3" onClick={handleDeletePost}></i>
                        </button>
                      )}
                    </div>
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
                border: '1px solid #dee2e6',
                display: 'flex',
                flexDirection: 'column'
              }}>
              <h5 className="text-dark mb-3">Comentarios</h5>
              <div style={{ flexGrow: 1, overflowY: 'auto' }}>
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
              <div className="mt-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                    style={{
                      backgroundColor: '#fff',
                      color: '#212529',
                      border: '1px solid #dee2e6'
                    }}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={handleCommentSubmit}
                  >
                    <i className="bi bi-send"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
