import React, { useState, useEffect } from 'react';
import { getCommentsByPost, createComment } from '../supabase/api';

export const CommentModal = ({ show, handleClose, post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      if (post) {
        const commentsData = await getCommentsByPost(post.id);
        setComments(commentsData);
      }
    };

    fetchComments();
  }, [post]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    const userUUID = JSON.parse(localStorage.getItem('userId'));
    if (newComment.trim() && userUUID) {
      await createComment(post.id, userUUID, newComment);
      setNewComment('');
      const commentsData = await getCommentsByPost(post.id);
      setComments(commentsData);
    }
  };

  return (
    <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agrega un Comentario</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <h5>{post.Descripcion}</h5>
            <div className="comments-section" style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px', marginBottom: '10px' }}>
              {comments.map(comment => (
                <div key={comment.id} className="comment">
                  <p><strong>@{comment.UserName}</strong>: {comment.Contenido}</p>
                </div>
              ))}
            </div>
            <div className="input-group mt-3">
              <input
                type="text"
                className="form-control"
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={handleCommentChange}
              />
              <button className="btn btn-primary" onClick={handleCommentSubmit}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};