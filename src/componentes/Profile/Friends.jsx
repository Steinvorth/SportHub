import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSugerencias, addFriend, checkFriendship, getFriends } from "../supabase/api";

export const Friends = () => {
  const [userUUID, setUserUUID] = useState(''); // Estado para guardar el UserUUID del usuario autenticado
  const [sugerencias, setSugerencias] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  // Función para obtener el usuario actual desde Supabase
  const fetchUserUUID = async () => {
    try {
      const uuid = localStorage.getItem('userId');
      const UUID_formatted = uuid.replace(/['"]+/g, ''); // Eliminar comillas simples del UserUUID
      console.log(UUID_formatted);
      if (uuid) {
        setUserUUID(UUID_formatted); // Guardamos el UserUUID en el estado
      } else {
        navigate("/login"); // Redirige a la página de login si no hay sesión
      }
    } catch (error) {
      console.error("Error obteniendo el UserUUID actual:", error.message);
    }
  };

  // Obtener la lista de amigos
  const fetchFriends = async () => {
    try {
      if (!userUUID) return;
      const data = await getFriends(userUUID);
      if (data && data.length > 0) {
        setFriends(data);
      }
    } catch (error) {
      console.error("Error obteniendo amigos:", error.message);
    }
  };

  // Obtener sugerencias de amigos (excluyendo al usuario actual y sus amigos)
  const fetchSugerencias = async () => {
    try {
      if (!userUUID) return;
      const data = await getSugerencias(userUUID);
      console.log(data);  

      if (data && data.length > 0) {
        // Excluir amigos de las sugerencias
        const filteredSugerencias = data.filter(sugerencia => !friends.some(friend => friend.User_Auth_Id === sugerencia.User_Auth_Id));
        setSugerencias(filteredSugerencias);
      }
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error.message);
    }
  };

  // Función para agregar un amigo
  const handleAddFriend = async (amigoUUID) => {
    try {
      const friendshipExists = await checkFriendship(userUUID, amigoUUID);
      if (friendshipExists) {
        alert("Ya son amigos.");
        return;
      }

      const result = await addFriend(userUUID, amigoUUID);
      if (result) {
        alert("Amigo agregado exitosamente.");
        fetchFriends(); // Refresh friends list after adding a friend
        fetchSugerencias(); // Refresh suggestions after adding a friend
      }
    } catch (error) {
      console.error("Error agregando amigo:", error.message);
    }
  };

  // Cargar el UserUUID actual al montar el componente
  useEffect(() => {
    fetchUserUUID();
  }, []);

  // Cargar sugerencias y amigos una vez que tengamos el UserUUID actual
  useEffect(() => {
    if (userUUID) {
      fetchFriends();
      fetchSugerencias();
    }
  }, [userUUID]);

  // Cargar sugerencias una vez que tengamos la lista de amigos
  useEffect(() => {
    if (friends.length > 0) {
      fetchSugerencias();
    }
  }, [friends]);

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
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend.User_Auth_Id} className="d-flex justify-content-between align-items-center mb-2">
                <p>{friend.UserName}</p>
              </div>
            ))
          ) : (
            <p>No tienes amigos aún.</p>
          )}
        </div>

        {/* Panel Derecho: Sugerencias */}
        <div className="flex-grow-1 p-3 border" style={{ backgroundColor: "#ffffff" }}>
          <h2>Sugerencias de Amigos</h2>
          {sugerencias.length > 0 ? (
            sugerencias.map((sugerencia) => (
              <div
                key={sugerencia.User_Auth_Id}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <p>{sugerencia.UserName}</p>
                <button className="btn btn-success" onClick={() => handleAddFriend(sugerencia.User_Auth_Id)}>Agregar</button>
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