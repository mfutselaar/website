document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-socials > a').forEach((element) => {
        element.setAttribute('data-tooltip', element.title);
        element.title = '';

        element.addEventListener('mouseenter', (event) => {
            document.getElementById('nav-socials-info').innerText = event.target.getAttribute('data-tooltip');
        })

        element.addEventListener('mouseleave', (event) => {
            document.getElementById('nav-socials-info').innerText = '';
        })
    })
})