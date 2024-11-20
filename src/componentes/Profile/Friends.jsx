import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Cambié useHistory por useNavigate
import { getSugerencias } from "../supabase/api"; // obtener usuarios excepto el actual
import supabase from "../supabase/supabase"; 

export const Friends = () => {
  const [userIdActual, setUserIdActual] = useState(null); // Estado para guardar el UserId del usuario autenticado
  const [sugerencias, setSugerencias] = useState([]);
  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  // Función para obtener el usuario actual desde Supabase
  const fetchUserIdActual = async () => {
    try {
      const { data: session } = await supabase.auth.getSession(); // Obtenemos la sesión actual
      if (session?.session) {
        const { data: user, error } = await supabase
          .from("Usuarios")
          .select("UserId")
          .eq("User_Auth_Id", session.session.user.id) // Filtramos por el ID del usuario autenticado
          .single();

        if (error) {
          throw error;
        }

        setUserIdActual(user.UserId); // Guardamos el UserId en el estado
      } else {
        // Si no hay sesión activa, redirige al login
        navigate("/login"); // Redirige a la página de login si no hay sesión
      }
    } catch (error) {
      console.error("Error obteniendo el UserId actual:", error.message);
    }
  };

  // Obtener sugerencias de amigos (excluyendo al usuario actual)
  const fetchSugerencias = async () => {
    try {
      if (!userIdActual) return; // Esperamos a que se cargue el userIdActual
      const data = await getSugerencias(userIdActual); // Llamamos a la API para obtener sugerencias
      if (data && data.length > 0) {
        setSugerencias(data); // Guardamos las sugerencias en el estado
      }
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error.message);
    }
  };

  // Cargar el UserId actual al montar el componente
  useEffect(() => {
    fetchUserIdActual();
  }, []);

  // Cargar sugerencias una vez que tengamos el UserId actual
  useEffect(() => {
    if (userIdActual) {
      fetchSugerencias();
    }
  }, [userIdActual]);

  return (
    <div className="container mt-5" style={{ color: "black" }}>
      {/* Botón de regreso */}
      <div className="position-absolute" style={{ top: "20px", left: "20px" }}>
        <Link to="/" className="btn btn-outline-primary">SPORT HUB</Link>
      </div>

      <h1 className="text-center mb-4">Amigos</h1>

      <div className="d-flex" style={{ gap: "20px" }}>
        {/* Panel Izquierdo: Amigos */}
        <div className="flex-grow-1 p-3 border" style={{ backgroundColor: "#f9f9f9" }}>
          <h2>Mis Amigos</h2>
          <p>Lista de amigos (pendiente por implementar).</p>
        </div>

        {/* Panel Derecho: Sugerencias */}
        <div className="flex-grow-1 p-3 border" style={{ backgroundColor: "#ffffff" }}>
          <h2>Sugerencias de Amigos</h2>
          {sugerencias.length > 0 ? (
            sugerencias.map((sugerencia) => (
              <div
                key={sugerencia.UserId}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <p>{sugerencia.UserName}</p>
                <button className="btn btn-success">Agregar</button>
              </div>
            ))
          ) : (
            <p>No hay sugerencias disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};
