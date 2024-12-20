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

  const renderMedia = (postPath) => {
    if (!postPath) return null;
    const fileExtension = postPath.split('.').pop().toLowerCase();
    if (fileExtension === 'mp4') {
      return (
        <video className="img-fluid rounded" controls style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}>
          <source src={postPath} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      );
    }
    return (
      <img 
        src={postPath} 
        alt="Post" 
        className="img-fluid rounded" 
        style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }} 
      />
    );
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minWidth: '100vw', backgroundColor: '#f8f9fa' }}>
      <div className="container mt-5">
        <h2 className="text-dark">Revisión de Post</h2>
        <div className="card mb-3 bg-white">
          <div className="card-body">
            <h5 className="card-title text-dark">{post.Descripcion}</h5>
            <p className="card-text text-secondary">{post.Privacidad ? 'Privado' : 'Público'}</p>
            <div className="mb-3">
              {renderMedia(post.PostPath)}
            </div>
            <button className="btn btn-danger" onClick={handleDeletePost}>Eliminar Post</button>
          </div>
        </div>
        
        <h3 className="text-dark">Comentarios</h3>
        <div className="list-group">
          {comments.map(comment => (
            <div key={comment.id} className="list-group-item bg-white d-flex justify-content-between align-items-center">
              <div>
                <strong className="text-dark">@{comment.UserName}</strong>
                <p className="text-dark mb-0">{comment.Contenido}</p>
              </div>
              <button className="btn btn-danger ms-3" onClick={() => handleDeleteComment(comment.id)}>
                Eliminar Comentario
              </button>
            </div>
          ))}
        </div>
        <Link to="/admin" className="btn btn-primary mt-3">Volver al Dashboard</Link>
      </div>
    </div>
  );
};