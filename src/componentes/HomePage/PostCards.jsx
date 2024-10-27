import React from 'react'

//import bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css';

/*
 * Este es un componente para hacer los Bootstrap Cards para los post.
*/

export const PostCards = () => {
  return (
    <>
        <div className="card" style={{ width: '18rem' }}>
            <img src="..." className="card-img-top" alt="..."></img>
            <div className="card-body">                
                <i className="bi bi-trophy"></i> {/* Trofeo para simular el Like */}
                <p className="card-text">contenido del post</p>
            </div>
        </div>
    </>
  )
}
