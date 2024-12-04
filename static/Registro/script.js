async function verificarAutenticacion() {
    const response = await fetch('http://127.0.0.1:8000/user/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        //document.body.style.display = 'block';
    }else{
        window.location.href = 'http://127.0.0.1:8000/Skillmap/Inicio';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const password = document.getElementById('new-password').value;

            if (passwordStrength(password) === "La contraseña es segura") {
                registerUser();
            } else {
                showCustomPopup("La contraseña no cumple con los requisitos de seguridad", 2000, "#ec5353");
            }
        });
    } else {
        console.error('El formulario con id "register-form" no se encontró.');
    }
});

function actpassStr(pass){
    const stIndicator = document.getElementById('passStrength')
    stIndicator.innerText = passwordStrength(pass);
}

function passwordStrength(pass){
    let stText = ''
    const passlength = pass.length >= 7;
    const passUpperCase = /[A-Z]/.test(pass);
    const passLowerCase = /[a-z]/.test(pass);
    const passNumbers = /\d/.test(pass);
    const passSpecialChar = /[!¡@#$%^&*,.?:|<>{}()'"]/.test(pass);
    if (passlength && passUpperCase && passLowerCase && passNumbers && passSpecialChar){
        stText = "La contraseña es segura"
    }else{
        stText = "La contraseña deberá tener"
        if(!passlength){
            stText += "\n- al menos 7 caracteres"
        }
        if(!passUpperCase){
            stText += "\n- al menos una mayúscula"
        }
        if(!passLowerCase){
            stText += "\n- al menos una minúscula"
        }
        if(!passNumbers){
            stText += "\n- al menos un número"
        }
        if(!passSpecialChar){
            stText += "\n- al menos 1 caracter especial"
        }
    }
    return stText
}

async function registerUser() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('new-password').value;
    const userData = {
        name: firstName,
        surname: lastName,
        correo: email,
        password: newPassword
    };

    const userTestC = {
        user_email: email,
        ...Object.fromEntries(
            Array.from({ length: 98 }, (_, i) => [`res${i + 1}`, null])
        ),
        ...Object.fromEntries(
            Array.from({ length: 98 }, (_, i) => [`res${i + 1}_time`, null])
        ),
        formularioC: null
    };

    const userTestK = {
        user_email: email,
        ...Object.fromEntries(
            Array.from({ length: 168 * 2 }, (_, i) => [`res${Math.floor(i / 2) + 1}_${i % 2 + 1}`, " "])
        ),
        ...Object.fromEntries(
            Array.from({ length: 168 * 2 }, (_, i) => [`res${Math.floor(i / 2) + 1}_${i % 2 + 1}_time`, null])
        ),
        formularioK: null
    };
    

    const userTestH = {
        user_email: email,
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
    

    try {
        const response = await fetch('http://127.0.0.1:8000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
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
                                        id_usuario: email,
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
                                    const data = await response.json();
                                    if (data.error){
                                        showCustomPopup(data.error,2000,"#ec5353")
                                    }else {                                   
                                        showCustomPopup("Usuario creado",2000,"#12a14b")
                                        mail(email);
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
}

async function mail(correo) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/user/correo?correo=${encodeURIComponent(correo)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: correo }),
        });                    

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        window.location.href = "http://127.0.0.1:8000/Skillmap/Autenticar";

    } catch (error) {
        console.error('Error during registration:', error);
    }
}

function showCustomPopup(message, duration, backgroundColor) {
    const customPopup = document.getElementById('customPopup');
    const popupMessage = document.getElementById('popupMessage');

    customPopup.style.backgroundColor = backgroundColor;

    popupMessage.textContent = message;
    customPopup.style.display = 'block';

    // Animación de desplazamiento hacia abajo
    customPopup.style.animation = 'slideDown 0.5s';

    // Ocultar el pop-up después del tiempo especificado
    setTimeout(() => {
        customPopup.style.animation = 'slideUp 0.5s'; // Detener la animación
        setTimeout(() => {
            customPopup.style.display = 'none';
            customPopup.style.animation = ''; // Resetear la animación
        }, 500); // 500 milisegundos es la duración de la animación 'slideUp'
    }, duration);
}