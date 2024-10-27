import React, { useEffect } from 'react'
import { PostCards } from './PostCards'

/*
 * Este es el Home Page de La red Social, como por decir cuand uno abre Instagram.
*/



export const HomePage = () => {

    //use Effect para traer todos los posts de publicos de la base de datos.
    // useEffect(() => {
    //   first
    
    //   return () => {
    //     second
    //   }
    // }, [third])
    

  return (
    <>
        <div className="container">
          <h1>Home Page</h1>
        </div>
        
        {/* Contenedor del main page donde salen los posts */}
        <div className="container  d-flex justify-content-center" >
          <PostCards>
            {/* Este componente muestra todos los posts de la base de datos como un card */}
          </PostCards>
        </div>

        {/* Aqui llamamos al componente que hace los cards para los posts */}
    </>
    
  )
}
