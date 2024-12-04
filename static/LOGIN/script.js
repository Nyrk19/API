async function verificarAutenticacion() {
    const response = await fetch('http://127.0.0.1:8000/user/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    const data = await response.json();
    if (!response.ok || data.error) {
    } else {
        window.location.href = 'http://127.0.0.1:8000/Skillmap/Inicio';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            login();
        });
    } else {
        console.error('El formulario con id "loginForm" no se encontró.');
    }
});


async function login() {
    var correo = document.getElementById('correo').value;
    var password = document.getElementById('password').value;

    var formData = new URLSearchParams();
    formData.append('username', correo);
    formData.append('password', password);
    
    try {
        const response = await fetch('http://127.0.0.1:8000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            showCustomPopup(data.error, 2500, "#ec5353");
            
            if (data.error === "Usuario no autenticado") {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/user/codigoValido?correo=${encodeURIComponent(correo)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.error) {
                        console.log("Codigo expirado");
                        try {
                            const response = await fetch(`http://127.0.0.1:8000/user/correo?correo=${encodeURIComponent(correo)}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ correo: correo }),
                            });

                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            console.log('Correo enviado');
                            window.location.href = "http://127.0.0.1:8000/Skillmap/Autenticar";

                        } catch (error) {
                            console.error('Error during registration:', error);
                        }
                    }else {
                        console.log("Codigo activo")
                        window.location.href = "http://127.0.0.1:8000/Skillmap/Autenticar";
                    }
                } catch (error) {
                    console.error('Error during validation:', error);
                }
            }
        } else {
            setTimeout(() => {
                localStorage.setItem('access_token', data.access_token);
                window.location.href = "http://127.0.0.1:8000/Skillmap/Inicio";
            }, 1000);
        }
    } catch (error) {
        console.error('Error login:', error);
    }
}

function showCustomPopup(message, duration, backgroundColor) {
    const customPopup = document.getElementById('customPopup');
    const popupMessage = document.getElementById('popupMessage');

    customPopup.style.backgroundColor = backgroundColor;
    popupMessage.textContent = message;
    customPopup.style.display = 'block';

    // Animación de desplazamiento hacia abajo
    customPopup.style.animation = 'slideDown 0.5s';

    // Ocultar el pop-up después del tiempo especificado
    setTimeout(() => {
        customPopup.style.animation = 'slideUp 0.5s'; // Detener la animación
        setTimeout(() => {
            customPopup.style.display = 'none';
            customPopup.style.animation = ''; // Resetear la animación
        }, 500); // 500 milisegundos es la duración de la animación 'slideUp'
    }, duration);
}