document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const correo = document.getElementById('email').value;

            if (!correo) {
                showCustomPopup("Por favor, ingresa tu correo electrónico", 2000, "#ec5353");
                return;
            }
            
            update_pass(correo);
        });
    }
});
async function update_pass(correo) {
    try {
        const url = `http://127.0.0.1:8000/user/contraseña?correo=${encodeURIComponent(correo)}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });                    

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('VALOR:', data);
        if (data.error){
            showCustomPopup(data.error,2000,"#ec5353")
        }else{
            showCustomPopup(data.exito,2000,"#12a14b")
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

    customPopup.style.animation = 'slideDown 0.5s';

    setTimeout(() => {
        customPopup.style.animation = 'slideUp 0.5s';
        setTimeout(() => {
            customPopup.style.display = 'none';
            customPopup.style.animation = ''; 
        }, 500);
    }, duration);
}