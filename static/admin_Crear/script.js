let info;
async function verificarAutenticacion() {
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const correo = document.getElementById('email');
const response = await fetch('http://127.0.0.1:8000/admin/me', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});
info = await response.json();
data = info
if (!response.ok || data.error) {
    window.location.href = 'http://127.0.0.1:8000/Skillmap/Admin';
}else{
    document.querySelector('header').style.opacity = 1;
}
}

async function enviar(){
    await verificarAutenticacion();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('email').value;
    const tipo = document.getElementById('tipoUsuario').value;
    const editor_contrasena = document.getElementById('contrasena').value;
    if (!nombre || !apellido || !correo) {
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
        password: " "
    };
    const userTestC = {
        user_email: correo,
        ...Object.fromEntries(
            Array.from({ length: 98 }, (_, i) => [`res${i + 1}`, null])
        ),
        ...Object.fromEntries(
            Array.from({ length: 98 }, (_, i) => [`res${i + 1}_time`, null])
        ),
        formularioC: null
    };
    
    const userTestK = {
        user_email: correo,
        ...Object.fromEntries(
            Array.from({ length: 168 * 2 }, (_, i) => [`res${Math.floor(i / 2) + 1}_${i % 2 + 1}`, " "])
        ),
        ...Object.fromEntries(
            Array.from({ length: 168 * 2 }, (_, i) => [`res${Math.floor(i / 2) + 1}_${i % 2 + 1}_time`, null])
        ),
        formularioK: null
    };
    
    
    const userTestH = {
        user_email: correo,
        ...Object.fromEntries(
            Array.from({ length: 45 }, (_, i) => [`res${i + 1}`, false])
        ),
        ...Object.fromEntries(
            Array.from({ length: 41 }, (_, i) => [`res${i + 46}`, " "])
        ),
        ...Object.fromEntries(
            Array.from({ length: 86 }, (_, i) => [`res${i + 1}_time`, null])
        ),
        formularioH: null
    };
    if(tipo === "usuario"){
        try {
            const response = await fetch(`http://127.0.0.1:8000/admin/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                editorPass: editor_contrasena,
                editorCorreo: info.correo,
                ...userData
            }),
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        info = await response.json();
        const data = info
        if (data.error){
            showCustomPopup(data.error,2000,"#ec5353")
        }else{
            try {
                const response = await fetch('http://127.0.0.1:8000/answersC', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userTestC),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.error){
                    showCustomPopup(data.error,2000,"#ec5353")
                }else{
                    try {
                        const response = await fetch('http://127.0.0.1:8000/answersK', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(userTestK),
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        if (data.error){
                            showCustomPopup(data.error,2000,"#ec5353")
                        }else{
                            try {
                                const response = await fetch('http://127.0.0.1:8000/answersH', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(userTestH),
                                });
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                const data = await response.json();
                                if (data.error){
                                    showCustomPopup(data.error,2000,"#ec5353")
                                }else{
                                    const bandaData = {
                                        id_usuario: correo,
                                        delta: [],
                                        theta: [],
                                        lowAlpha: [],
                                        highAlpha: [],
                                        lowBeta: [],
                                        highBeta: [],
                                        lowGamma: [],
                                        highGamma: [],
                                        times: [],
                                        status: false
                                    };
                                    
                                    fetch("http://127.0.0.1:8000/banda", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(bandaData)
                                    })
                                    const banda = await response.json();
                                    if (banda.error){
                                        showCustomPopup(banda.error,2000,"#ec5353")
                                    }else {                                   
                                        showCustomPopup("Usuario creado",2000,"#12a14b")
                                        setTimeout(function() {
                                            window.location.href = "http://127.0.0.1:8000/Skillmap/Admin/Inicio";
                                        }, 4000);
                                    }
                                }
                            } catch (error) {
                                console.error('Error during registration:', error);
                            }
                        }
                    } catch (error) {
                        console.error('Error during registration:', error);
                    }
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }
    
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }else {
        try {
        const response = await fetch('http://127.0.0.1:8000/admin/createAdmin', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            
            body: JSON.stringify({
            editorPass: editor_contrasena,
            editorCorreo: info.correo,
            ...userData
            }),
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error){
            showCustomPopup(data.error,2000,"#ec5353");
        }else{
            showCustomPopup("Usuario creado",2000,"#12a14b");
            setTimeout(function() {
                window.location.href = "http://127.0.0.1:8000/Skillmap/Admin/Inicio";
            }, 4000);
        }
        }catch (error) {
        console.error('Error during registration:', error);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    const crearUsuarioBtn = document.getElementById('crearUsuarioButton')
    if (crearUsuarioBtn) {
        crearUsuarioBtn.addEventListener('click', enviar);
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