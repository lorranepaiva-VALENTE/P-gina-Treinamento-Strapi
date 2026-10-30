let indiceSlide = 0;
const slides = document.querySelectorAll('.slide');

function mudarSlide(direcao) {
    slides[indiceSlide].classList.remove('ativa');
    indiceSlide += direcao;
    
    // Faz o banner voltar ao início ou ir para o final se passar do limite
    if (indiceSlide >= slides.length) {
        indiceSlide = 0;
    } else if (indiceSlide < 0) {
        indiceSlide = slides.length - 1;
    }
    
    slides[indiceSlide].classList.add('ativa');
}