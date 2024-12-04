async function verificarAutenticacion() {
    const response = await fetch('http://127.0.0.1:8000/user/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    let data = await response.json();
    if (!response.ok || data.error) {
        window.location.href = 'http://127.0.0.1:8000/Skillmap/';
    }else{
        const nombre = document.getElementById('nombre');
        const correo = document.getElementById('email');
        document.querySelector('header').style.opacity = 1;
        console.log(data.name, data.surname, data.correo)
        nombretxt = "Nombre: "+data.name+" "+data.surname
        correotxt = "Correo: "+data.correo
        nombre.textContent = nombretxt
        correo.textContent = correotxt

        const response = await fetch(`http://127.0.0.1:8000/resultados/info?correo=${encodeURIComponent(data.correo)}`, {
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
            recomContainer = document.querySelector('.recommendations');
            pathContainer = document.querySelector('.education-pathways');
            data.exito.forEach((carrera, index) => {
                const carreraP = document.createElement('p');
                carreraP.id = `carrera${index+1}`
                carreraP.innerHTML = `<strong>Carrera ${index+1}:</strong> ${carrera.nombre}`;
                recomContainer.appendChild(carreraP);
                if (index >= 0 && index <= 2) {
                    const perfilIngreso = document.createElement('p');
                    perfilIngreso.innerHTML = `<strong>Perfil de ingreso ${index+1}:</strong> <br>${carrera.perfilIngreso}`;
                    pathContainer.appendChild(perfilIngreso);
                }
                carrera.escuelas.forEach((escuela, escuelaIndex) => {
                    console.log(escuela.nombre)
                });
            });
            const admision = document.createElement('p');
            admision.innerHTML = `
                <strong>Admision:</strong> <br>
                Cumplir en tiempo y forma con cada una de las etapas del Proceso de Admisión señaladas en la convocatoria de ingreso al Nivel Superior Sistema Escolarizado del IPN tales como:<br>
                &nbsp;&nbsp;• Certificado oficial de estudios de nivel medio superior<br>
                &nbsp;&nbsp;• Certificado de estudios de secundaria<br>
                &nbsp;&nbsp;• Clave Única de Registro de Población (CURP)<br>
                &nbsp;&nbsp;• Acta de nacimiento<br>
                &nbsp;&nbsp;• Aprobar el examen de ingreso<br><br>
                <strong><em>Te recomendamos visital la página oficial del IPN para consultar el proceso de admision actual</em></strong>
            `;
            const pagina = document.createElement('a');
            pagina.href = 'https://www.ipn.mx/dev/educacion-a-distancia/polivirtual/admision.html';
            pagina.textContent = 'Ir a la pagina de proceso de admision del IPN';
            pagina.target = '_blank';
            pathContainer.appendChild(admision);
            pathContainer.appendChild(pagina);
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