import React from 'react'

//import bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css';

/*
 * Este es un componente para hacer los Bootstrap Cards para los post.
*/

export const PostCards = () => {
  return (
    <>
        <div className="card w-100">
            <div className="card-header">
                @username
            </div>
            <img src="https://via.placeholder.com/150" className="card-img-top" alt="imagen post"></img>
            <div className="card-body">                
                <i className="bi bi-trophy"></i> {/* Trofeo para simular el Like */}
                <p className="card-text">hoy fui a caminar</p>
            </div>
        </div>
    </>
  )
}
