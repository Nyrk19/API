document.addEventListener('DOMContentLoaded', async () => {
    verificarAutenticacion();
    await cargarPreguntas();
    mostrarPagina(0);
});

const preguntasPorPagina = 14;
let paginaActual = 0;
let totalPaginas = 0;

async function cargarPreguntas() {
try {
    const response = await fetch('http://127.0.0.1:8000/answersC/preguntas', {
        method: 'GET'
    });

    const data = await response.json(); 
    
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';

    let preguntas = Object.keys(data).filter(key => key.startsWith('ques')).map((key, index) => {
        return `
            <label for="res${index}">${data[key]}</label>
            <div class="options-group">
                <br>
                <input type="radio" id="true" name="res${index +1}" value="true">
                <label for="true">Sí</label>
                <br>
                <input type="radio" id="false" name="res${index +1}" value="false">
                <label for="false">No</label>
                <br>
            </div>
            <br><br>
        `;
    });

    totalPaginas = Math.ceil(preguntas.length / preguntasPorPagina);
    
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

const inicio = pagina * preguntasPorPagina;
const fin = inicio + preguntasPorPagina;

const preguntasPagina = window.preguntasTotales.slice(inicio, fin);
questionsContainer.innerHTML = preguntasPagina.join('');

agregarEventosGuardado();

const botonEnviar = document.getElementById('enviarRespuestas');
if (pagina === totalPaginas - 1) {
    botonEnviar.textContent = "Terminar Formulario";
    botonEnviar.onclick = enviarFormulario;
} else {
    botonEnviar.textContent = "Siguiente Página";
    botonEnviar.onclick = () => verificarRespuestasPaginaActual() && cambiarPagina(1);
}

}

function agregarEventosGuardado() {
const form = document.getElementById("vocational-form");
const radioButtons = form.querySelectorAll('input[type="radio"]');
radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener("change", function() {
    const pregunta = radioButton.getAttribute("name");
    const respuesta = radioButton.value;
    actualizarBaseDeDatos(pregunta, respuesta);
    });
});
}

function verificarRespuestasPaginaActual() {
const form = document.getElementById("vocational-form");
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
    const correo = info.correo
    try {
    const response = await fetch(`http://127.0.0.1:8000/answersC?correo=${encodeURIComponent(correo)}&formulario=false`, {
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
        actualizarBaseDeDatos("formularioC", true)
        const response = await fetch(`http://127.0.0.1:8000/banda/svmTest`, {
            method: 'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                email: correo,
                test: "C"
            })
        });
        data = await response.json();
        if (data.exito) {
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
    data = await response.json();
    if (!response.ok || data.error) {
        window.location.href = 'http://127.0.0.1:8000/Skillmap/';
    }else{
        info = data
        document.querySelector('header').style.opacity = 1;
        verificarFormularioC();
        setTimeout(function() {
            cargarRespuestas();
        }, 5100);
}
}
async function cargarRespuestas() {
try {
    const response = await fetch(`http://127.0.0.1:8000/answersC?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
    });
    const respuestasUsuario = await response.json();
    for (const [pregunta, respuesta] of Object.entries(respuestasUsuario)) {
    if ((respuesta == true || respuesta == false) && pregunta != "formularioC") {
        const valueToSelect = respuesta ? 'true' : 'false';
        const radioButton = document.querySelector(`input[name="${pregunta}"][value="${valueToSelect}"]`);
        if (radioButton) {
        radioButton.checked = true;
        }
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

async function verificarFormularioC() {
try {
    const response = await fetch(`http://127.0.0.1:8000/answersC?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
    });
    const respuestasUsuario = await response.json();
    if (respuestasUsuario.formularioC === true) {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const botonAnterior = document.getElementById('anterior');
    const botonSiguiente = document.getElementById('siguiente');
    const botonRegresar = document.getElementById('regresar');
    const botonEnviar = document.getElementById('enviarRespuestas');
    const botonEnviarPre = document.getElementById('enviarRespuestasPRE');
    const botonEnviarPos = document.getElementById('enviarRespuestasPOS');
    radioButtons.forEach(radioButton => {
        radioButton.disabled = true; 
    });
    botonEnviar.classList.add('hidden');
    botonEnviarPre.classList.add('hidden');
    botonEnviarPos.classList.add('hidden');
    botonAnterior.onclick = () => verificarFormularioC() && cambiarPagina(-1);
    botonSiguiente.onclick = () => verificarFormularioC() && cambiarPagina(1);
    botonRegresar.onclick = () => window.location.href = 'http://127.0.0.1:8000/Skillmap/Empezar/Evaluaciones'; 
    botonAnterior.classList.remove('hidden');        
    botonSiguiente.classList.remove('hidden');       
    botonRegresar.classList.remove('hidden');
    }
} catch (error) {
    console.error('Error al verificar formularioC:', error.message);
}
}

async function actualizarBaseDeDatos(parametro, valor) {
    correo = (info).correo
    const response = await fetch(`http://127.0.0.1:8000/answersC?correo=${encodeURIComponent(correo)}&parametro=${parametro}&valor=${valor}`,{
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