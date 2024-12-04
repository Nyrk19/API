let ultimaPregunta = 0;
let ultimaRespuesta = 0;
let nombreCompleto = "";

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
    } else {
    document.querySelector('header').style.opacity = 1;
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', 'bot');

    function mostrarMensaje() {
        nombreCompleto = data.name + " " + data.surname;
        const mensaje = "Hola " + nombreCompleto + ", ¿en qué te puedo ayudar el día de hoy?<br><br>" +
                        "1. Acerca de Skillmap<br>" +
                        "2. Acerca de los desarrolladores<br>" +
                        "3. Acerca de mis resultados";
        messageContainer.innerHTML = '<div class="avatar-container"><img src="http://127.0.0.1:8000/static/Login/logo.png" class="avatar"></div><div class="message-content">' + mensaje + '</div>';
        document.getElementById('conversation').appendChild(messageContainer);
    }

    setTimeout(mostrarMensaje, 700);
    }
}

function scrollToBottom() {
    const conversation = document.getElementById('conversation');
    conversation.scrollTop = conversation.scrollHeight;
}

async function respuesta(uPregunta, uRespuesta) {
    let respuesta = "";
    if (uRespuesta === 0) {
    switch(uPregunta) {
        case 1:
        respuesta = "SkillMap es la respuesta ante la problemática de la falta de preparación y orientación adecuada para los estudiantes en México al enfrentar la decisión de elegir una carrera.<br>"+
                    "El presente sistema web educativo para orientación vocacional se alinea con investigaciones que destacan la importancia de la tecnología en este campo.<br><br>"+
                    "1. ¿Por que usar SkillMap?<br>" +
                    "2. ¿Que tiene de innovador SkillMap?<br>" +
                    "3. ¿Como funciona la plataforma?<br>"+
                    "4. Misión, visión, valores<br>"+
                    "5. Regresar a la bienvenida";
        ultimaRespuesta = 1;
        break;
        case 2:
        respuesta = "Estos son los desarrolladores de Skillmap, puedes saber más de ellos seleccionando su opción: <br><br>"+
                    "1. Aguilar Perez Alejandro.<br>" +
                    "2. López González César Alexander.<br>" +
                    "3. Moreno Saucedo Oscar Samuel.<br>"+
                    "4. Ramirez Bermidez Alan Rodrigo.<br>"+
                    "5. Regresar a la bienvenida";
        ultimaRespuesta = 2;
        break;
        case 3:
        respuesta = "Tus resultados en Skillmap los obtendrás tras realizar el cuestionario y actividades.<br><br>"+
                    "1. ¿Que tan certeros son los resultados?<br>"+
                    "2. ¿Como puedo descargar mis resultados?<br>"+
                    "3. Tengo duda sobre mis resultados<br>"+
                    "4. Regresar a la bienvenida";
        ultimaRespuesta = 3;
        break;
        default:
        respuesta = "Lo siento, intenta responder nuevamente.";
    }
    } else if (uRespuesta === 1) {
    switch (uPregunta) {
        case 1:
        respuesta = "Con Skillmap, podrás obtener resultados más certeros gracias a una combinación de formularios y actividades diseñadas específicamente para evaluar tus intereses y aptitudes. Además, incorporamos el uso de la banda sensorial Neurosky Mindwave, que mide la actividad cerebral en tiempo real para proporcionar una evaluación más precisa. Esta tecnología permite capturar datos sobre tu estado mental y emocional durante las actividades, mejorando así la precisión de los resultados que obtienes en Skillmap.";
        break;
        case 2:
        respuesta = "La innovación de Skillmap radica en la integración de inteligencia artificial con la información recabada de la banda sensorial Neurosky Mindwave. La IA analiza los datos recopilados sobre la actividad cerebral y el estado emocional del usuario para ajustar y personalizar los resultados obtenidos en los formularios y actividades. Este enfoque permite una mayor asertividad en las recomendaciones, ya que combina información objetiva y subjetiva para ofrecerte sugerencias más alineadas con tus características personales y emocionales.";
        break;
        case 3:
        respuesta = "Mientras estás resolviendo tus actividades en Skillmap, la banda sensorial Neurosky Mindwave mide constantemente los valores de tus ondas cerebrales, proporcionando datos sobre tu estado emocional y nivel de concentración. Esta información se combina con los resultados de las actividades realizadas para ofrecer una evaluación integral. De esta manera, Skillmap no solo considera tus respuestas a las preguntas y actividades, sino también tu estado emocional en el momento, lo que permite generar una recomendación más precisa sobre las carreras que mejor se ajustan a tu perfil.";
        break;
        case 4:
        respuesta = "Mision: Nuestra misión es ayudarte a descubrir y mapear tu camino profesional con las herramientas y el asesoramiento más innovadores.<br><br>"+
                    "Vision: Aspiramos a ser la plataforma líder en orientación profesional, facilitando el desarrollo y crecimiento continuo de nuestros usuarios.<br><br>"+
                    "Valores:<br>"+
                    "   ·Innovación: Constantemente buscamos formas de mejorar nuestra plataforma.<br>"+
                    "   ·Integridad: Operamos con transparencia y honestidad.<br>"+
                    "   ·Compromiso: Estamos dedicados al éxito de nuestros usuarios.<br>";
        break;
        case 5:
        respuesta = "Hola " + nombreCompleto + ", ¿en qué te puedo ayudar el día de hoy?<br><br>" +
                    "1. Acerca de Skillmap<br>" +
                    "2. Acerca de los desarrolladores<br>" +
                    "3. Acerca de mis resultados";
        ultimaRespuesta = 0;
        break;
        default:
        respuesta = "Lo siento, intenta responder nuevamente.";
    }
    } else if (uRespuesta === 2) {
    switch (uPregunta) {
        case 1:
        respuesta = "Aguilar Perez Alejandro:<br>"+
                    "Informacion de Alejandro...";
        break;
        case 2:
        respuesta = "López González César Alexander:<br>"+
                    "Informacion de César Alexander...";
        break;
        case 3:
        respuesta = "Moreno Saucedo Oscar Samuel:<br>"+
                    "Informacion de Oscar Samuel...";
        break;
        case 4:
        respuesta = "Ramirez Bermudez Alan Rodrigo:<br>"+
                    "Informacion de Alan Rodrigo..";
        break;
        case 5:
        respuesta = "Hola " + nombreCompleto + ", ¿en qué te puedo ayudar el día de hoy?<br><br>" +
                    "1. Acerca de Skillmap<br>" +
                    "2. Acerca de los desarrolladores<br>" +
                    "3. Acerca de mis resultados";
        ultimaRespuesta = 0;
        break;
        default:
        respuesta = "Lo siento, intenta responder nuevamente.";
    }
    } else if (uRespuesta === 3) {
    switch (uPregunta) {
        case 1:
        respuesta = "Los resultados tienen una certeza de ...";
        break;
        case 2:
        respuesta = "En el apartado de resultados en la parte inferior de la pagina podras encontrar un boton para obtener tus resultados en PDF ya sea descargandolos o enviados a tu correo registrado"
        break;
        case 3:
        resouesta = "Ante cualquier duda puedes mandarnos un correo a skillmap2024@outlook.com o marcandonos al 5611670871"
        break;
        case 4:
        respuesta = "Hola " + nombreCompleto + ", ¿en qué te puedo ayudar el día de hoy?<br><br>" +
                    "1. Acerca de Skillmap<br>" +
                    "2. Acerca de los desarrolladores<br>" +
                    "3. Acerca de mis resultados";
        ultimaRespuesta = 0;
        break;
        default:
        respuesta = "Lo siento, intenta responder nuevamente.";
    }
    } else {
    respuesta = "Lo siento, no entiendo tu pregunta.";
    }
    return respuesta;
}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    const formBtn = document.getElementById('messageForm');
    if (formBtn) {
        formBtn.addEventListener('submit', async function(event) {
            event.preventDefault();
            const message = parseInt(document.getElementById('message').value);
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message', 'user');
            messageContainer.innerHTML = '<div class="message-content">' + message + '</div><div class="avatar-container"><img src="http://127.0.0.1:8000/static/Contacto/user.png" class="avatar"></div>';
            document.getElementById('conversation').appendChild(messageContainer);
            document.getElementById('message').value = '';
            ultimaPregunta = message;
            const thinkingContainer = document.createElement('div');
            thinkingContainer.classList.add('message', 'bot');
            scrollToBottom();
            thinkingContainer.innerHTML = '<div class="avatar-container"><img src="http://127.0.0.1:8000/static/Login/logo.png" class="avatar"></div><div class="message-content"><span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span></div>';
            document.getElementById('conversation').appendChild(thinkingContainer);
            scrollToBottom();
            const botResponse = await respuesta(ultimaPregunta, ultimaRespuesta);
            setTimeout(() => {
            thinkingContainer.innerHTML = '<div class="avatar-container"><img src="http://127.0.0.1:8000/static/Login/logo.png" class="avatar"></div><div class="message-content">' + botResponse + '</div>';
            }, 1000);
            scrollToBottom();
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