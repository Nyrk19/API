document.addEventListener('DOMContentLoaded', async () => {
    verificarAutenticacion();
    await cargarPreguntas();
    mostrarPagina(0);
});
let info;
const preguntasPorPagina =45;
let paginaActual = 0;
const totalPaginas = 4;

async function cargarPreguntas() {
try {
    const response = await fetch('http://127.0.0.1:8000/answersH/preguntas', {
        method: 'GET'
    });

    const data = await response.json(); 
    
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';
    let preguntas;
    let numPregunta;
    let numRespuesta = 97;
    preguntas = Object.keys(data).filter(key => key.startsWith('ques')).map((key, index) => {
        let commonHTML
        if(index === 0) {
        commonHTML = `
            <div class="options-group">
                <label style = "color: black">Marque todos los adjetivos que describan su personalidad. Señale tantos como desee.</label><br>
                <label style = "color: black">Trate de definirse tal como es, no como le gustaría ser.</label>
                <br><br>
                <input type="checkbox" name="res${index+1}" value="true">
                <label>${data[key]}</label>
            </div>
        `;
        }else if(index < 45) {
        commonHTML = `
            <div class="options-group">
                <input type="checkbox" name="res${index+1}" value="true">
                <label>${data[key]}</label>
            </div>
        `;
        } else if(index < 63) {
        if (index === 45) {
            commonHTML = `
            <div>
                <label style = "color: black">Califíquese de acuerdo con las siguientes características tal como considera ser en comparación con otras personas de su edad.</label><br>
                <label style = "color: black">Seleccione la respuesta que más se ajuste a sí mismo.</label><br><br>
            </div>
            <div class='questions-options'>
                <div class='questions'>
                    <label>${data[key]}</label>
                </div>
                <div class="options-group">
                <input type="radio" name="res${index+1}" value="a">
                <label for="res${index+1}">Más que los demás </label>
                <input type="radio" name="res${index+1}" value="b">
                <label for="res${index+1}">Igual que los demás</label>
                <input type="radio" name="res${index+1}" value="c">
                <label for="res${index+1}">Menos que los demás</label>
                </div>
            </div>
            `;
        } else {
            commonHTML = `
            <div class='questions-options'>
                <div class='questions'>
                    <label>${data[key]}</label>
                </div>
                <div class="options-group">
                <input type="radio" name="res${index+1}" value="a">
                <label for="res${index+1}">Más que los demás </label>
                <input type="radio" name="res${index+1}" value="b">
                <label for="res${index+1}">Igual que los demás</label>
                <input type="radio" name="res${index+1}" value="c">
                <label for="res${index+1}">Menos que los demás</label>
                </div>
            </div>
            `;
        }
        }else if(index < 81) {
        if (index === 63) {
            commonHTML = `
            <div>
                <label>Indique qué importancia da a las siguientes clases de logros, aspiraciones y metas.</label><br><br>
            </div>
            <div class='questions-options'>
                <div class='questions'>
                    <label>${data[key]}</label>
                </div>
                <div class="options-group">
                <input type="radio" name="res${index+1}" value="a">
                <label for="res${index+1}">Más que los demás </label>
                <input type="radio" name="res${index+1}" value="b">
                <label for="res${index+1}">Igual que los demás</label>
                <input type="radio" name="res${index+1}" value="c">
                <label for="res${index+1}">Menos que los demás</label>
                </div>
            </div>
            `;
        } else {
            commonHTML = `
            <div class='questions-options'>
                <div class='questions'>
                    <label>${data[key]}</label>
                </div>
                <div class="options-group">
                <input type="radio" name="res${index+1}" value="a">
                <label for="res${index+1}">Más que los demás </label>
                <input type="radio" name="res${index+1}" value="b">
                <label for="res${index+1}">Igual que los demás</label>
                <input type="radio" name="res${index+1}" value="c">
                <label for="res${index+1}">Menos que los demás</label>
                </div>
            </div>
            `;
        }
        } else {
        if (index === 81) {
            commonHTML = `
            <label style = "color: black">Para las siguientes preguntas escoja una sola alternativa, según lo que más se ajuste a usted.</label><br>
            <br><br>
            <label>${data[key]}</label>
            `;
            numPregunta = index + 1;
        } else {
            const val = (index + 3) % 7;
            if (val != 0){
            commonHTML = `
            <div class="options-group">
                <br>
                <input type="radio" name="res${numPregunta}" value="${String.fromCharCode(numRespuesta)}">
                <label for="true">${data[key]}</label>
            </div>
            `;
            numRespuesta += 1;
            } else {
            commonHTML = `
            <br>
            <label>${data[key]}</label>
            `;
            numPregunta += 1;
            numRespuesta = 97;
            }
        }
        }
        return commonHTML;
    });
    window.preguntasTotales = preguntas;

    mostrarPagina(paginaActual);
} catch (error) {
    console.error("Error cargando preguntas:", error);
}
}

async function mostrarPagina(pagina) {
cargarRespuestas();
const questionsContainer = document.getElementById('questions-container');
questionsContainer.innerHTML = '';

let inicio, fin;

if (pagina === 0) {
    inicio = 0;
    fin = 45;
} else if (pagina === 1) {
    inicio = 45;
    fin = 63;
} else if (pagina === 2) {
    inicio = 63;
    fin = 81;
} else {
    inicio = 81;
    fin = window.preguntasTotales.length;
}

const preguntasPagina = window.preguntasTotales.slice(inicio, fin);
questionsContainer.innerHTML = preguntasPagina.join('');

agregarEventosGuardado();

const botonEnviar = document.getElementById('enviarRespuestas');
if (pagina === totalPaginas - 1) {
    botonEnviar.textContent = "Terminar Formulario";
    botonEnviar.onclick = enviarFormulario;
} else {
    botonEnviar.textContent = "Siguiente Página";
    if (pagina === 0) {
    botonEnviar.onclick = () =>cambiarPagina(1);
    }else {
    botonEnviar.onclick = () => verificarRespuestasPaginaActual() &&  cambiarPagina(1);
    }
}

}

function agregarEventosGuardado() {
const form = document.getElementById("vocational-form");
const checkboxes = form.querySelectorAll('input[type="checkbox"]');
const radioButtons = form.querySelectorAll('input[type="radio"]');
radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener("change", function() {
    const pregunta = radioButton.getAttribute("name");
    const respuesta = radioButton.value;
    actualizarBaseDeDatos(pregunta, respuesta);
    });
});
checkboxes.forEach(function(checkBox) {
    checkBox.addEventListener("change", function() {
    const pregunta = checkBox.getAttribute("name");
    let respuesta = checkBox.value;
    if (!checkBox.checked){
        respuesta = "false";
    }
    actualizarBaseDeDatos(pregunta, respuesta);
    });
});
}

function verificarRespuestasPaginaActual() {
const form = document.getElementById("vocational-form");
if (paginaActual + 1 === totalPaginas){
    const preguntaIds = ["res82", "res83", "res84", "res85", "res86"];

    for (const preguntaId of preguntaIds) {
        const radios = form.querySelectorAll(`input[name="${preguntaId}"]`);
        const algunaSeleccionada = [...radios].some(radio => radio.checked);
        if (!algunaSeleccionada) {
            showCustomPopup("Completa todas las preguntas antes de continuar", 2000, "#ec5353");
            return false;
        }
    }
    return true;
}
const radioGroups = form.querySelectorAll('.options-group');

for (const group of radioGroups) {
    const radios = group.querySelectorAll('input[type="radio"]');
    const algunaSeleccionada = [...radios].some(radio => radio.checked);
    if (!algunaSeleccionada) {
    showCustomPopup("Completa todas las preguntas antes de continuar", 2000, "#ec5353");
    return false;
    }
}
return true;
}

function cambiarPagina(incremento) {
paginaActual += incremento;

if (paginaActual < 0) {
    paginaActual = 0;
} else if (paginaActual >= totalPaginas) {
    paginaActual = totalPaginas - 1;
}
mostrarPagina(paginaActual);
}

async function enviarFormulario() {
if (verificarRespuestasPaginaActual()) {
    let formLleno = true
    try {
    const response = await fetch(`http://127.0.0.1:8000/answersH?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    const respuestasUsuario = await response.json();
    for (const [pregunta, respuesta] of Object.entries(respuestasUsuario)) {
        if (respuesta === " "){
        formLleno = false;
        break;
        }
    }
    if (!formLleno){
        showCustomPopup("Completa el formulario antes de continuar",2000,"#ec5353")
    }else{
        const response = await fetch(`http://127.0.0.1:8000/banda/svmTest`, {
            method: 'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                email: info.correo,
                test: "K"
            })
        });
        data = await response.json();
        if (data.exito) {
            actualizarBaseDeDatos("formularioH", true)
            setTimeout(() => {
                window.location.href = 'http://127.0.0.1:8000/Skillmap/Empezar/Evaluaciones';
            }, 1000);
        }
    }
    } catch (error) {
    console.error('Error al cargar respuestas:', error.message);
    }
}
}

async function verificarAutenticacion() {
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
    verificarFormularioH();
    setTimeout(function() {
        cargarRespuestas();
    }, 5100);
}
}
async function cargarRespuestas() {
try {
    const response = await fetch(`http://127.0.0.1:8000/answersH?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
    });
    const respuestasUsuario = await response.json();
    for (const [pregunta, respuesta] of Object.entries(respuestasUsuario)) {
    const checkBox = document.querySelector(`input[name="${pregunta}"][value="${respuesta}"]`);
    if (checkBox) {
        checkBox.checked = true;
    }
    }
} catch (error) {
    console.error('Error al cargar respuestas:', error.message);
}
}
document.addEventListener('DOMContentLoaded', () => {
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

async function verificarFormularioH() {
try {
    const response = await fetch(`http://127.0.0.1:8000/answersH?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
    });
    const respuestasUsuario = await response.json();
    if (respuestasUsuario.formularioH === true) {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    const botonAnterior = document.getElementById('anterior');
    const botonSiguiente = document.getElementById('siguiente');
    const botonRegresar = document.getElementById('regresar');
    const botonEnviar = document.getElementById('enviarRespuestas');
    const botonEnviarPre = document.getElementById('enviarRespuestasPRE');
    const botonEnviarPos = document.getElementById('enviarRespuestasPOS');
    checkBoxes.forEach(check => {
        check.disabled = true;
    });
    radioButtons.forEach(radioButton => {
        radioButton.disabled = true; 
    });
    botonEnviar.classList.add('hidden');
    botonEnviarPre.classList.add('hidden');
    botonEnviarPos.classList.add('hidden');
    botonAnterior.onclick = () => verificarFormularioH() && cambiarPagina(-1);
    botonSiguiente.onclick = () => verificarFormularioH() && cambiarPagina(1);
    botonRegresar.onclick = () => window.location.href = 'http://127.0.0.1:8000/Skillmap/Empezar/Evaluaciones'; 
    botonAnterior.classList.remove('hidden');        
    botonSiguiente.classList.remove('hidden');       
    botonRegresar.classList.remove('hidden');
    }
} catch (error) {
    console.error('Error al verificar formularioK:', error.message);
}
}

async function actualizarBaseDeDatos(parametro, valor) {
correo = (info).correo
const response = await fetch(`http://127.0.0.1:8000/answersH?correo=${encodeURIComponent(correo)}&parametro=${parametro}&valor=${valor}`,{
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
});
if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
}
}

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