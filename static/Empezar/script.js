let info;
let redireccionar2 = true;
let redireccionar3 = true;
async function verificarAutenticacion() {
const response = await fetch('https://api-2y57.onrender.com/user/me', {
    method: 'GET',
    headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});
info = await response.json();
data = info
if (!response.ok || data.error) {
    window.location.href = 'https://api-2y57.onrender.com/Skillmap/';
}else{
    document.querySelector('header').style.opacity = 1;
    let chaside = true;
    let kuder = true;
    let holland = true;
    try {
    const response = await fetch(`https://api-2y57.onrender.com/answersC?correo=${encodeURIComponent(data.correo)}&formulario=false`, {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    const respuestasUsuario = await response.json();
    const chaside = respuestasUsuario.formularioC;
    } catch (error) {
    console.error('Error al cargar respuestas: ', error.message);
    }
    try {
    const response = await fetch(`https://api-2y57.onrender.com/answersK?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    const respuestasUsuario = await response.json();
    kuder = respuestasUsuario.formularioK;
    } catch (error) {
    console.error('Error al cargar respuestas: ', error.message);
    }
    try {
    const response = await fetch(`https://api-2y57.onrender.com/answersH?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    const respuestasUsuario = await response.json();
    holland = respuestasUsuario.formularioH;
    } catch (error) {
        console.error('Error al cargar respuestas: ', error.message);
    }

    if (!chaside || !kuder || !holland){
        var activitiesOptions = document.querySelector('.options-member-activities');
        activitiesOptions.style.transform = 'none'
        activitiesOptions.style.border ='#333';
        activitiesOptions.style.boxShadow = '0 4px 8px #666';
        activitiesOptions.style.cursor = 'default';
        var acitivitiesName = activitiesOptions.querySelector('.options-member-name');
        acitivitiesName.style.color = '#333';
        var acitivitiesTitle = activitiesOptions.querySelector('.options-member-title');
        acitivitiesTitle.style.color = '#666';
        var resultsOptions = document.querySelector('.options-member-results');
        resultsOptions.style.transform = 'none'
        resultsOptions.style.border ='#333';
        resultsOptions.style.boxShadow = '0 4px 8px #666';
        resultsOptions.style.cursor = 'default';
        var resultsName = resultsOptions.querySelector('.options-member-name');
        resultsName.style.color = '#333';
        var resultsTitle = resultsOptions.querySelector('.options-member-title');
        resultsTitle.style.color = '#666';
        redireccionar2 = false;
        redireccionar3 = false;
        abrirEmergente("Recuerde tener la interfaz iniciada para obtener mejores resultados con la banda");
    }else {
        try {
            const response = await fetch(`https://api-2y57.onrender.com/resultados?correo=${encodeURIComponent((info).correo)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            if (data.error || !data.exito.Actividad){
                var resultsOptions = document.querySelector('.options-member-results');
                resultsOptions.style.transform = 'none'
                resultsOptions.style.border ='#333';
                resultsOptions.style.boxShadow = '0 4px 8px #666';
                resultsOptions.style.cursor = 'default';
                var resultsName = resultsOptions.querySelector('.options-member-name');
                resultsName.style.color = '#333';
                var resultsTitle = resultsOptions.querySelector('.options-member-title');
                resultsTitle.style.color = '#666';
                redireccionar3 = false;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
}

function redirigir(url){
window.location.href = url
}
function redirigir2(url){
    if (redireccionar2) {
        window.location.href = url
    }
}
function redirigir3(url){
    if (redireccionar3) {
        window.location.href = url
    }
}

function abrirEmergente(msg) {
    const emergente = document.getElementById('miEmergente');
    const mensaje = document.getElementById('Mensaje');
    mensaje.innerText = msg;
    emergente.style.display = "block";
}

function ocultarEmergente() {
    const emergente = document.getElementById('miEmergente');
    if (emergente) {
        emergente.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    const cerrarButton = document.querySelector('.cerrar');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            localStorage.removeItem('access_token');
            window.location.href = 'https://api-2y57.onrender.com/Skillmap/';
        });
    } else {
        console.error('El botón con id "cerrar_sesion" no se encontró.');
    }
    if (cerrarButton) {
        cerrarButton.onclick = function() {
            document.getElementById('miEmergente').style.display = "none";
        };
    }else {
        console.error('El botón con clase "cerrar" no se encontró.');
    }
});