import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getUsuarioByUUID, deleteUser } from "../supabase/api";
import { deleteAuthUser } from '../supabase/apiAdmin';

import { useEffect, useState } from "react";

export const Settings = () => {
    const [userUUID, setUserUUID] = useState('');
    const [activeSection, setActiveSection] = useState(null);
    const [user, setUser] = useState({});

    useEffect(() => {
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
        fetchUserUUID();
    }, [userUUID]);

    //MÉTODO PARA ELIMINAR EL USUARIO DE LA BASE DE DATOS
    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Eliminar Cuenta',
            text: "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar cuenta',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                // Clear local storage first
                localStorage.clear();
                
                // Delete account
                await deleteAuthUser(userUUID);
                
                // Show success message
                await Swal.fire({
                    title: 'Cuenta eliminada',
                    text: 'Tu cuenta ha sido eliminada exitosamente',
                    icon: 'success'
                });

                // Redirect to home
                window.location.href = '/';
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', error.message, 'error');
            }
        }
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex flex-column">
                <div className="container">
                    <Link to="../profile">
                        <i className="bi bi-arrow-bar-left me-3 text-dark fs-4"></i>
                    </Link>
                    <a className="navbar-brand" href="/">Sport Hub</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Settings Section */}
            <div className="container mt-5">
                <h2>Configuración</h2>

                <div className="list-group mt-4">
                    {/* Eliminar Cuenta */}
                    <button
                        className="list-group-item list-group-item-action"
                        onClick={() => setActiveSection(activeSection === 'delete' ? null : 'delete')}
                    >
                        Eliminar Cuenta
                    </button>
                    {/* Cambiar Contraseña */}
                    <button
                        className="list-group-item list-group-item-action"
                        onClick={() => setActiveSection(activeSection === 'change-password' ? null : 'change-password')}
                    >
                        Cambiar Contraseña
                    </button>
                    {/* Configuración de privacidad */}
                    <button
                        className="list-group-item list-group-item-action"
                        onClick={() => setActiveSection(activeSection === 'privacy' ? null : 'privacy')}
                    >
                        Configuración de privacidad
                    </button>
                </div>

                {/* Dynamic Section Content Below All Options */}
                <div className="mt-4">
                    {activeSection === 'delete' && (
                        <div id="delete-account-settings" className="mt-3">
                            <p>Para eliminar tu cuenta, haz clic en el botón de abajo. Se te pedirá confirmación.</p>
                            <i className="bi bi-exclamation-lg text-danger fs-3 mt-5"></i>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteAccount}
                            >
                                Eliminar cuenta
                            </button>
                        </div>
                    )}
                    {activeSection === 'change-password' && (
                        <div id="change-password-settings" className="mt-3">
                            <p>Si desea hacer un cambio de contraseña, pulse la siguiente opción</p> <hr />
                            <Link to='../ResetPassword'>
                            <button
                                className="btn btn-warning"
                                
                            >
                                Cambiar Contraseña
                            </button>
                            </Link>
                        </div>
                    )}
                    {activeSection === 'privacy' && (
                        <div id="privacy-settings" className="mt-3">
                            <p>Aquí podrás ajustar tus configuraciones de privacidad. (Detalles por implementar)</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
