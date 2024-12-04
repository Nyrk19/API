let info;

async function verificarAutenticacion() {
    const response = await fetch('http://127.0.0.1:8000/admin/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });

    info = await response.json();
    if (!response.ok || info.error) {
        window.location.href = 'http://127.0.0.1:8000/Skillmap/Admin';
    } else {
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const correo = document.getElementById('email');
        document.querySelector('header').style.opacity = 1;
        nombre.value = info.name;
        apellido.value = info.surname;
        correo.value = info.correo;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();

    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    const guardarCambiosBtn = document.getElementById('guardarCambiosButton');

    if (guardarCambiosBtn) {
        guardarCambiosBtn.addEventListener('click', async function () {
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const correo = document.getElementById('email').value;
            const contrasena = document.getElementById('password').value;
            const nuevaContrasena = document.getElementById('newPassword').value;

            if (!nombre || !apellido || !correo || !contrasena) {
                showCustomPopup("Rellena los campos obligatorios para continuar", 2000, "#ec5353");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                showCustomPopup("Ingrese un correo electrónico válido", 2000, "#ec5353");
                return;
            }

            const userData = {
                name: nombre,
                surname: apellido,
                correo: correo,
                password: contrasena
            };

            try {
                const response = await fetch('http://127.0.0.1:8000/admin/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        correo: info.correo,
                        newPass: nuevaContrasena,
                        ...userData
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Registration successful:', data);

                if (data.error) {
                    showCustomPopup(data.error, 2000, "#ec5353");
                } else {
                    showCustomPopup(data.exito, 2000, "#12a14b");
                    setTimeout(() => {
                        window.location.href = 'http://127.0.0.1:8000/Skillmap/Admin/Dashboard';
                    }, 1500);
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        });
    }

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function () {
            localStorage.removeItem('access_token');
            window.location.href = 'http://127.0.0.1:8000/Skillmap/';
        });
    } else {
        console.error('El botón con id "cerrar_sesion" no se encontró.');
    }
});

// Función para mostrar un popup personalizado
function showCustomPopup(message, duration, backgroundColor) {
    const customPopup = document.getElementById('customPopup');
    const popupMessage = document.getElementById('popupMessage');

    customPopup.style.backgroundColor = backgroundColor;
    popupMessage.textContent = message;
    customPopup.style.display = 'block';

    customPopup.style.animation = 'slideDown 0.5s';

    setTimeout(() => {
        customPopup.style.animation = 'slideUp 0.5s';
        setTimeout(() => {
            customPopup.style.display = 'none';
            customPopup.style.animation = '';
        }, 500);
    }, duration);
}