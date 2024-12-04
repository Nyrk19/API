let info;
async function verificarAutenticacion() {
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const correo = document.getElementById('email');
const response = await fetch('http://127.0.0.1:8000/user/me', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});
info = await response.json();
data = info
if (!response.ok || data.error) {
    window.location.href = 'http://127.0.0.1:8000/Skillmap/';
}else{
    document.querySelector('header').style.opacity = 1;
    const nombretxt = info.name
    const apellidotxt = info.surname
    const correotxt = info.correo
    nombre.value = nombretxt
    apellido.value = apellidotxt
    correo.value = correotxt
}
}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    const guardarCambiosBtn = document.getElementById('guardarCambiosButton');
    if(guardarCambiosBtn){
        guardarCambiosBtn.addEventListener('click', async function() {
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const correo = document.getElementById('email').value;
        const contrasena = document.getElementById('password').value;
        const nuevaContrasena = document.getElementById('newPassword').value;
        if (!nombre || !apellido || !correo || !contrasena) {
            showCustomPopup("Rellena los campos obligatorios para continuar",2000,"#ec5353")
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            showCustomPopup("Ingrese un correo electrónico válido",2000,"#ec5353")
            return;
        }
        const userData = {
            name: nombre,
            surname: apellido,
            correo: correo,
            password: contrasena
        };
        try {
            const response = await fetch(`http://127.0.0.1:8000/user/update`, {
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
            if (data.error){
            showCustomPopup(data.error,2000,"#ec5353")
            }else{
            showCustomPopup(data.exito,2000,"#12a14b")
            if (correo != info.correo) {
                try {
                const response = await fetch(`http://127.0.0.1:8000/answersC/updateCorreo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userCorreo: info.correo,
                        newCorreo: correo
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                await response.json();
                } catch (error) {
                console.error('Error during registration:', error);
                }
                try {
                const response = await fetch(`http://127.0.0.1:8000/answersK/updateCorreo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userCorreo: info.correo,
                        newCorreo: correo
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                await response.json();
                } catch (error) {
                console.error('Error during registration:', error);
                }
                try {
                const response = await fetch(`http://127.0.0.1:8000/answersH/updateCorreo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userCorreo: info.correo,
                        newCorreo: correo
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                await response.json();
                } catch (error) {
                console.error('Error during registration:', error);
                }
            }
            setTimeout(() => {
                window.location.href = 'http://127.0.0.1:8000/Skillmap/Dashboard';
            }, 1500);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
        });
    }
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            localStorage.removeItem('access_token');
            window.location.href = 'http://127.0.0.1:8000/Skillmap/';
        });
    } else {
        console.error('El botón con id "cerrar_sesion" no se encontró.');
    }
});

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