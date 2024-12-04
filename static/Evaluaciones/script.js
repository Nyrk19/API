async function verificarAutenticacion() {
const response = await fetch('http://127.0.0.1:8000/user/me', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});
const data = await response.json();
if (!response.ok || data.error) {
    window.location.href = 'http://127.0.0.1:8000/Skillmap/';
}else{
    document.querySelector('header').style.opacity = 1;
    let respuestasCUsuario;
    let respuestasHUsuario;
    let respuestasKUsuario;
    try {
        const response = await fetch(`http://127.0.0.1:8000/answersC?correo=${encodeURIComponent(data.correo)}&formulario=false`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
        });
        respuestasCUsuario = await response.json();
    } catch (error) {
        console.error('Error al cargar respuestas:', error.message);
    }
    try {
        const response = await fetch(`http://127.0.0.1:8000/answersK?correo=${encodeURIComponent(data.correo)}&formulario=false`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
        });
        respuestasKUsuario = await response.json();
    } catch (error) {
        console.error('Error al cargar respuestas:', error.message);
    }
    try {
        const response = await fetch(`http://127.0.0.1:8000/answersH?correo=${encodeURIComponent(data.correo)}&formulario=false`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
        });
        respuestasHUsuario = await response.json();
    } catch (error) {
        console.error('Error al cargar respuestas:', error.message);
    }
    if (respuestasCUsuario.formularioC === true) {
        const ctaButtonChaside = document.getElementById('button-chaside');
        ctaButtonChaside.textContent = 'Ver respuestas';
    }
    if (respuestasKUsuario.formularioK === true) {
        const ctaButtonChaside = document.getElementById('button-kuder');
        ctaButtonChaside.textContent = 'Ver respuestas';
    }
    if (respuestasHUsuario.formularioH === true) {
        const ctaButtonChaside = document.getElementById('button-holland');
        ctaButtonChaside.textContent = 'Ver respuestas';
    }
}
}
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            localStorage.removeItem('access_token');
            window.location.href = 'http://127.0.0.1:8000/Skillmap/';
        });
    } else {
        console.error('El botón con id "cerrar_sesion" no se encontró.');
    }
});