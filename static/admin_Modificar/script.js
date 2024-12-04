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
        document.querySelector('header').style.opacity = 1;
        buscarUsuarios();
    }
}

async function buscarUsuarios(event) {
    if (event) {
        event.preventDefault();
    }

    const userType = document.getElementById('userType').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('correo').value;

    let tipo = '';
    if (userType === 'admin') {
        tipo = 'Administrador';
    } else if (userType === 'user') {
        tipo = 'Usuario Común';
    } else {
        tipo = 'Todos';
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/admin/findUsers?tipo=${tipo}&nombre=${name}&apellido=${surname}&correo=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });

        const data = await response.json();
        const resultsTableBody = document.querySelector('#resultsTable tbody');
        resultsTableBody.innerHTML = '';

        if (data.length > 0) {
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.tipo}</td>
                    <td>${user.name}</td>
                    <td>${user.surname}</td>
                    <td>${user.correo}</td>
                    <td><button class="button" onclick="editarUsuario('${user.tipo}', '${user.name}', '${user.surname}', '${user.correo}')">Editar</button></td>
                `;
                resultsTableBody.appendChild(row);
            });
            document.getElementById('resultsTable').style.opacity = 1;
        } else {
            resultsTableBody.innerHTML = '<tr><td colspan="5">No se encontraron resultados.</td></tr>';
            document.getElementById('resultsTable').style.opacity = 1;
        }
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
    }
}

function editarUsuario(userType, userName, userSurname, userEmail) {
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('form-container').style.opacity = '0';
    document.getElementById('nombre').value = userName;
    document.getElementById('apellido').value = userSurname;
    document.getElementById('correo').value = userEmail;

    const btnEliminar = document.getElementById('eliminarUsuarioButton');
    const btnCambiar = document.getElementById('guardarCambiosButton');

    btnEliminar.setAttribute('data-correo', userEmail);
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.setAttribute('data-type', userType);

    btnCambiar.setAttribute('data-correo', userEmail);
    btnCambiar.textContent = 'Guardar';
    btnCambiar.setAttribute('data-type', userType);

    document.getElementById('form-container').style.opacity = '1';
}

async function guardarCambios() {
    const userCorreo = document.getElementById('guardarCambiosButton').getAttribute('data-correo');
    const userType = document.getElementById('guardarCambiosButton').getAttribute('data-type');
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const editor_contrasena = document.getElementById('contrasena').value;

    if (!nombre || !apellido || !correo || !editor_contrasena) {
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
        password: "",
    };

    try {
        const endpoint = userType === 'Administrador' ? '/updateAdmins' : '/updateUsers';
        const response = await fetch(`http://127.0.0.1:8000/admin${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo: userCorreo,
                editorPass: editor_contrasena,
                editorCorreo: info.correo,
                ...userData
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Operación exitosa:', data);
        if (data.error) {
            showCustomPopup(data.error, 2000, "#ec5353");
        } else {
            showCustomPopup(data.exito, 2000, "#12a14b");
            setTimeout(() => {
                window.location.href = 'http://127.0.0.1:8000/Skillmap/Admin/Modificar';
            }, 1500);
        }
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
    }
}

async function eliminarUsuario() {
    const userCorreo = document.getElementById('guardarCambiosButton').getAttribute('data-correo');
    const userType = document.getElementById('guardarCambiosButton').getAttribute('data-type');
    const editor_contrasena = document.getElementById('contrasena').value;

    if (!editor_contrasena) {
        showCustomPopup("Ingresa la contraseña para continuar", 2000, "#ec5353");
        return;
    }

    try {
        const endpoint = userType === 'Administrador' ? '/deleteAdmins' : '/deleteUsers';
        const response = await fetch(`http://127.0.0.1:8000/admin${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo: userCorreo,
                editorPass: editor_contrasena,
                editorCorreo: info.correo,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Operación exitosa:', data);
        if (data.error) {
            showCustomPopup(data.error, 2000, "#ec5353");
        } else {
            showCustomPopup(data.exito, 2000, "#12a14b");
            setTimeout(() => {
                window.location.href = 'http://127.0.0.1:8000/Skillmap/Admin/Modificar';
            }, 1500);
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();

    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    const buscarUsuariosForm = document.getElementById('hero');

    if (buscarUsuariosForm) {
        buscarUsuariosForm.addEventListener('submit', function(event) {
            event.preventDefault();
            buscarUsuarios(event);
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