async function verificarAutenticacion() {
    const response = await fetch('https://api-2y57.onrender.com/admin/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        window.location.href = 'https://api-2y57.onrender.com/Skillmap/Admin';
    }else{
        const nombre = document.getElementById('nombre');
        const correo = document.getElementById('email');
        document.querySelector('header').style.opacity = 1;
        let nombretxt = "Nombre: "+data.name+" "+data.surname
        let correotxt = "Correo: "+data.correo
        nombre.textContent = nombretxt
        correo.textContent = correotxt
    }
}
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            localStorage.removeItem('access_token');
            window.location.href = 'https://api-2y57.onrender.com/Skillmap/';
        });
    } else {
        console.error('El botón con id "cerrar_sesion" no se encontró.');
    }
});