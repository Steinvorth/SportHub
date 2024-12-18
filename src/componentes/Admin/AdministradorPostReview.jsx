import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById, getCommentsByPost, deleteComment, deletePost } from '../supabase/api';

export const AdministradorPostReview = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      const postData = await getPostById(postId);
      setPost(postData);

      const commentsData = await getCommentsByPost(postId);
      setComments(commentsData);
    };

    fetchPostData();
  }, [postId]);

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleDeletePost = async () => {
    await deletePost(postId);
    // Redirect to admin dashboard after deleting the post
    window.location.href = '/admin';
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Revisión de Post</h2>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{post.Descripcion}</h5>
          <p className="card-text">{post.Privacidad ? 'Privado' : 'Público'}</p>
          <button className="btn btn-danger" onClick={handleDeletePost}>Eliminar Post</button>
        </div>
      </div>
      <h3>Comentarios</h3>
      <div className="list-group">
        {comments.map(comment => (
          <div key={comment.id} className="list-group-item d-flex justify-content-between align-items-center">
            <p>{comment.Contenido}</p>
            <button className="btn btn-danger" onClick={() => handleDeleteComment(comment.id)}>Eliminar Comentario</button>
          </div>
        ))}
      </div>
      <Link to="/admin" className="btn btn-primary mt-3">Volver al Dashboard</Link>
    </div>
  );
};