document.addEventListener('DOMContentLoaded', () => {
    
    const trigger_button = document.querySelector('#trigger-loader');

    trigger_button.addEventListener('click', () => {
        const loading = document.querySelector('.loader');
        loading.style.display = 'block';
    });
});