document.addEventListener('DOMContentLoaded', () => {
    const verifyForm = document.getElementById('verify');
    if (verifyForm) {
        verifyForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const codigo = document.getElementById('codigo').value;

            if (!codigo) {
                showCustomPopup("Por favor, ingresa el código de verificación", 2000, "#ec5353");
                return;
            }
            
            validar_usuario(codigo);
        });
    }
});

function truncate(input){
    input.value = input.value.replace(/\D/g, '');
    if (input.value.length > 5){
        input.value = input.value.slice(0, 5);
    }
}

async function validar_usuario(codigo) {
    try {
        const url = `http://127.0.0.1:8000/user/validar?code=${codigo}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });                    

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Autenticaod:', data);
        if (data.error){
            showCustomPopup(data.error,2000,"#ec5353")
        }else{
            showCustomPopup("Codigo validado",2000,"#12a14b")
            setTimeout(() => {
                window.location.href = "http://127.0.0.1:8000/Skillmap";
            }, 1800);
        }

    } catch (error) {
        console.error('Error during validation:', error);
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