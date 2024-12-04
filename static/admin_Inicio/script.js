async function verificarAutenticacion() {
const response = await fetch('http://127.0.0.1:8000/admin/me', {
    method: 'GET',
    headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});
const data = await response.json();
if (!response.ok || data.error) {
    window.location.href = 'http://127.0.0.1:8000/Skillmap/Admin';
}else{
    document.querySelector('header').style.opacity = 1;
}
}
function redirigir(url){
window.location.href = url
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