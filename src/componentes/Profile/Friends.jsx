import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { getSugerencias, enviarSolicitudAmistad, obtenerSolicitudesPendientes, aceptarSolicitudAmistad, getFriends, removeFriend, rechazarSolicitudAmistad } from "../supabase/api";

export const Friends = () => {
  const [userUUID, setUserUUID] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [friends, setFriends] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]); // Nuevo estado para manejar solicitudes pendientes
  const navigate = useNavigate();

  // Función para obtener el usuario actual desde Supabase
  const fetchUserUUID = async () => {
    try {
      const uuid = localStorage.getItem('userId');
      const UUID_formatted = uuid.replace(/['"]+/g, '');
      if (uuid) {
        setUserUUID(UUID_formatted);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error obteniendo el UserUUID actual:", error.message);
    }
  };

  // Obtener lista de amigos
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

  // Obtener sugerencias de amigos
  const fetchSugerencias = async () => {
    try {
      if (!userUUID) return;

      // Filtrar sugerencias excluyendo aquellos con solicitudes pendientes
      const data = await getSugerencias(userUUID, solicitudes);
      console.log(data);

      if (data && data.length > 0) {
        // Excluir amigos de las sugerencias
        const filteredSugerencias = data.filter(sugerencia =>
          !friends.some(friend => friend.User_Auth_Id === sugerencia.User_Auth_Id)
        );
        setSugerencias(filteredSugerencias);
      }
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error.message);
    }
  };

  // Obtener solicitudes de amistad pendientes
  const fetchSolicitudes = async () => {
    try {
      if (!userUUID) return;
      const data = await obtenerSolicitudesPendientes(userUUID);
      setSolicitudes(data);
    } catch (error) {
      console.error("Error obteniendo solicitudes:", error.message);
    }
  };

  // Enviar solicitud de amistad
  const handleEnviarSolicitud = async (amigoUUID) => {
    try {
      const result = await enviarSolicitudAmistad(userUUID, amigoUUID);
      if (result) {
        alert("Solicitud de amistad enviada.");
        fetchSolicitudes(); // Refrescar solicitudes después de enviar
      }
    } catch (error) {
      console.error("Error enviando solicitud de amistad:", error.message);
    }
  };

  // Aceptar solicitud de amistad
  const handleAceptarSolicitud = async (solicitudId, amigoUUID) => {
    try {
      const result = await aceptarSolicitudAmistad(solicitudId, amigoUUID, userUUID);
      if (result) {
        alert("Solicitud de amistad aceptada.");
        fetchFriends(); // Actualizar lista de amigos después de aceptar la solicitud
        fetchSolicitudes(); // Refrescar solicitudes
      }
    } catch (error) {
      console.error("Error aceptando solicitud de amistad:", error.message);
    }
  };

  // Rechazar solicitud de amistad
  const handleRechazarSolicitud = async (solicitudId) => {
    try {
      const result = await rechazarSolicitudAmistad(solicitudId);
      if (result) {
        alert("Solicitud de amistad rechazada.");
        fetchSolicitudes(); // Refrescar las solicitudes después de rechazar
        fetchSugerencias(); // Refrescar las sugerencias para que aparezca de nuevo la persona
      }
    } catch (error) {
      console.error("Error rechazando solicitud de amistad:", error.message);
    }
  };

  // Eliminar amigo
  const handleEliminarAmigo = async (amigoUUID) => {
    try {
      const result = await removeFriend(userUUID, amigoUUID);
      if (result) {
        alert("Amigo eliminado exitosamente.");
        fetchFriends(); // Refrescar lista de amigos después de eliminar
      }
    } catch (error) {
      console.error("Error eliminando amigo:", error.message);
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
      fetchSolicitudes(); // Cargar solicitudes cuando tengamos el userUUID
    }
  }, [userUUID]);

  // Cargar sugerencias una vez que tengamos la lista de amigos
  useEffect(() => {
    if (friends.length >= 0) {
      fetchSugerencias();
    }
  }, [friends, solicitudes]); // Dependiendo de solicitudes también

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
                {/*<button className="btn btn-danger" onClick={() => handleEliminarAmigo(friend.User_Auth_Id)}>Eliminar</button>*/}
                {/*<button className="btn btn-danger" onClick={async () => { await handleEliminarAmigo(friend.User_Auth_Id); window.location.reload();  }}> Eliminar </button>*/}
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await handleEliminarAmigo(friend.User_Auth_Id); // Elimina al amigo

                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, delete it!"
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire({
                          title: "Deleted!",
                          text: "Your file has been deleted.",
                          icon: "success"
                        });

                        // Agrega un retraso antes de recargar la página
                        setTimeout(() => {
                          window.location.reload();
                        }, 3000); //  = 3 segundos
                      }
                    });
                  }}
                >
                  Eliminar
                </button>
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
              <div key={sugerencia.User_Auth_Id} className="d-flex justify-content-between align-items-center mb-2">
                <p>{sugerencia.UserName}</p>
                {/* <button className="btn btn-primary" onClick={() => handleEnviarSolicitud(sugerencia.User_Auth_Id)}> Enviar Solicitud </button>*/}
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    await handleEnviarSolicitud(sugerencia.User_Auth_Id); // Ejecuta la función para enviar la solicitud

                    // Muestra la alerta personalizada
                    Swal.fire({
                      title: "¡Solicitud enviada!",
                      text: "Tu solicitud ha sido enviada exitosamente.",
                      icon: "success",
                      confirmButtonText: "Entendido",
                      confirmButtonColor: "#d33",
                    }).then(() => {
                      window.location.reload(); // Recarga la página después de cerrar la alerta
                    });
                  }}
                >
                  Enviar Solicitud
                </button>
              </div>
            ))
          ) : (
            <p>No hay sugerencias disponibles.</p>
          )}
        </div>
      </div>

      {/* Panel de Solicitudes Pendientes */}
      <div className="mt-4">
        <h2>Solicitudes Pendientes</h2>
        {solicitudes.length > 0 ? (
          solicitudes.map((solicitud) => (
            <div key={solicitud.id} className="d-flex justify-content-between align-items-center mb-2">
              <p>{solicitud.UserName}</p>
              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={() => handleAceptarSolicitud(solicitud.id, solicitud.UserUUID)}> Aceptar </button>
                <button className="btn btn-danger" onClick={() => handleRechazarSolicitud(solicitud.id)}> Rechazar </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes solicitudes pendientes.</p>
        )}
      </div>
    </div>
  );
};