import React, { useEffect, useState } from 'react';
import { 
  getPostById, 
  getCommentsByPost, 
  getUsuarioUsername,
  createComment,
  getLikeCount,
  checkUserLike,
  createLike,
  deleteLike 
} from '../supabase/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente para mostrar los detalles de un post en un modal
export const SearchPost = ({ postId, show, handleClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const userUUID = JSON.parse(localStorage.getItem('userId'));

  // obtener los detalles del post, comentarios y estado de likes
  useEffect(() => {
    const fetchPostDetails = async () => {
      const postData = await getPostById(postId);
      setPost(postData);

      const usernameData = await getUsuarioUsername(postData.UserUUID);
      setUsername(usernameData[0].UserName);

      const commentsData = await getCommentsByPost(postId);
      setComments(commentsData);

      const likes = await getLikeCount(postId);
      setLikeCount(likes);

      const userLiked = await checkUserLike(postId, userUUID);
      setIsLiked(userLiked);
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId, userUUID]);

  // Maneja el envío de un nuevo comentario
  const handleCommentSubmit = async () => {
    if (newComment.trim() && userUUID) {
      await createComment(postId, userUUID, newComment);
      const commentsData = await getCommentsByPost(postId);
      setComments(commentsData);
      setNewComment('');
    }
  };

  // Maneja el clic en el botón de "me gusta"
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

  // Renderiza las imágenes o videos del post
  const renderMedia = (postPath) => {
    const fileExtension = postPath.split('.').pop().toLowerCase();
    if (fileExtension === 'mp4') {
      return (
        <video className="img-fluid w-100" controls>
          <source src={postPath} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      );
    }
    return <img src={postPath || "https://via.placeholder.com/150"} className="img-fluid w-100" alt="post" />;
  };

  return (
    // Modal para mostrar los detalles del post
    <div className={`modal fade ${show ? 'show' : ''}`} 
      style={{ 
        display: show ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050
      }}
      onClick={handleClose}
    >
      <div className="modal-dialog modal-xl" style={{ marginTop: '2%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content bg-white">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title" style={{ color: '#212529' }}>Detalles del Post</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body d-flex">
            {/* Lado izquierdo - Contenido del post */}
            <div className="flex-grow-1" style={{ flexBasis: '60%' }}>
              {post && (
                <div className="card w-100 mb-3 border-0" style={{ backgroundColor: '#fff' }}>
                  <div className="card-header border-0 bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0" style={{ color: '#212529' }}>@{username}</h5>
                      <div>
                        <i 
                          className={`bi bi-trophy${isLiked ? '-fill' : ''} me-1`}
                          onClick={handleLikeClick}
                          style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#212529' }}
                        ></i>
                        <span style={{ color: '#212529' }}>{likeCount}</span>
                      </div>
                    </div>
                  </div>
                  {renderMedia(post.PostPath)}
                  <div className="card-body bg-white">
                    <p className="card-text" style={{ color: '#212529' }}>{post.Descripcion}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lado derecho - Comentarios */}
            <div className="ms-3 d-flex flex-column" style={{ flexBasis: '40%' }}>
              <h5 style={{ color: '#212529' }}>Comentarios</h5>
              <div style={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                maxHeight: 'calc(100vh - 300px)',
                marginBottom: '1rem'
              }}>
                <ul className="list-group" style={{ backgroundColor: '#fff' }}>
                  {comments.map(comment => (
                    <li key={comment.id} className="list-group-item border-0 bg-white">
                      <strong style={{ color: '#212529' }}>@{comment.UserName}</strong>
                      <div style={{ color: '#495057', fontSize: '0.95rem' }}>{comment.Contenido}</div>
                    </li>
                  ))}
                </ul>
                {comments.length === 0 && (
                  <div className="text-center p-3" style={{ color: '#6c757d' }}>
                    No hay comentarios aún
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
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
                      border: '1px solid #e9ecef'
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