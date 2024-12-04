let info;
async function verificarAutenticacion() {
    const response = await fetch('http://127.0.0.1:8000/user/me', {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    info = await response.json();
    user = info.id
    data = info
    if (!response.ok || data.error) {
        window.location.href = 'http://127.0.0.1:8000/Skillmap/';
    }else{
        document.querySelector('header').style.opacity = 1;
        try {
            const response = await fetch(`http://127.0.0.1:8000/resultados/info?correo=${encodeURIComponent(info.correo)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            data = await response.json();
            if (data.exito){
                resultsContainer = document.getElementById('resultsContainer');
                const table = document.createElement('table');
                const tr = document.createElement('tr');
                function addImagen(imageName, user) {
                    const td = document.createElement('td');
                    const img = document.createElement('img');
                    let test = {};
                    if (imageName == "K") {
                        test = {
                            "nombre": "Kudder",
                            "resultado": `${data.descripciones[4].descripcion}<br><br>${data.descripciones[5].descripcion}`,
                        };
                    }
                    if (imageName == "H") {
                        test = {
                            "nombre": "Holland",
                            "resultado": `${data.descripciones[2].descripcion}<br><br>${data.descripciones[3].descripcion}`,
                        };
                    }
                    if (imageName == "C") {
                        test = {
                            "nombre": "Chaside",
                            "resultado": `${data.descripciones[0].descripcion}<br><br>${data.descripciones[1].descripcion}`,
                        };
                    }
                    img.src = `http://127.0.0.1:8000/static/Imagenes_Resultados/${imageName}${user}.png`;
                    img.alt = `Imagen ${imageName}`;
                    img.style.width = '65%';
                    td.appendChild(img);
                    
                    td.onclick = function() {
                        event.stopPropagation();
                        abrirEmergente2(test);
                    };
                    tr.appendChild(td);
                }
                addImagen('C', user);
                addImagen('H', user);
                addImagen('K', user);

                table.appendChild(tr);
                resultsContainer.appendChild(table);
                data.exito.forEach((carrera, index) => {
                    const carreraDiv = document.createElement('div');
                    carreraDiv.classList.add('carreraCerrada');
                    carreraDiv.id = `carrera${index+1}`
                    
                    const tituloCarrera = document.createElement('h2');
                    tituloCarrera.innerText = `${carrera.nombre}`;
                    const objetivo = document.createElement('p');
                    objetivo.innerHTML = `<strong>Objetivo:</strong><br><br>${carrera.objetivo}<br><br>`;
                    const perfilIngreso = document.createElement('p');
                    perfilIngreso.innerHTML = `<strong>Perfil de ingreso:</strong><br><br>${carrera.perfilIngreso}<br><br>`;
                    const perfilEgreso = document.createElement('p');
                    perfilEgreso.innerHTML = `<strong>Perfil de egreso:</strong><br><br>${carrera.perfilEgreso}<br><br>`;
                    
                    carreraDiv.appendChild(tituloCarrera);
                    carreraDiv.appendChild(objetivo);
                    carreraDiv.appendChild(perfilIngreso);
                    carreraDiv.appendChild(perfilEgreso);

                    carrera.escuelas.forEach((escuela, escuelaIndex) => {
                        const escuelaBtn = document.createElement('button');
                        escuelaBtn.classList.add('escuela');
                        escuelaBtn.innerText = escuela.nombre;

                        escuelaBtn.onclick = function() {
                            event.stopPropagation();
                            abrirEmergente(escuela);
                        };

                        carreraDiv.appendChild(escuelaBtn);
                    });
                    resultsContainer.appendChild(carreraDiv);
                    let carreraActual = document.getElementById(`carrera${index + 1}`);
                    if (carreraActual) {
                        carreraActual.onclick = function () {
                            if (carreraActual.classList.contains('carreraAbierta')) {
                                carreraActual.classList.remove('carreraAbierta');
                                carreraActual.classList.add('carreraCerrada');
                            } else {
                                carreraActual.classList.remove('carreraCerrada');
                                carreraActual.classList.add('carreraAbierta');
                            }
                        };
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function abrirEmergente(escuela) {
    document.getElementById('nombreEscuela').innerText = escuela.nombre;
    document.getElementById('misionEscuela').innerHTML = `<strong>Mision: </strong>${escuela.mision}`;
    document.getElementById('visionEscuela').innerHTML = `<strong>Vision: </strong>${escuela.vision}`;
    document.getElementById('direccionEscuela').innerHTML = `<strong>Direccion: </strong>${escuela.direccion}`;

    document.getElementById('miEmergente').style.display = "block";
}

function abrirEmergente2(test) {
    document.getElementById('nombreEscuela').innerText = test.nombre;
    document.getElementById('misionEscuela').innerHTML = `<strong>Resultado: </strong>${test.resultado}`;
    document.getElementById('visionEscuela').innerHTML = "";
    document.getElementById('direccionEscuela').innerHTML = "";

    document.getElementById('miEmergente').style.display = "block";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('miEmergente')) {
        document.getElementById('miEmergente').style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    const cerrarButton = document.querySelector('.cerrar');
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            localStorage.removeItem('access_token');
            window.location.href = 'http://127.0.0.1:8000/Skillmap/';
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