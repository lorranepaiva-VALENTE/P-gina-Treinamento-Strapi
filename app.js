let indiceSlide = 0;
const slides = document.querySelectorAll('.slide');
let intervaloBanner;

function mudarSlide(direcao) {
    slides[indiceSlide].classList.remove('ativa');
    indiceSlide += direcao;
    
    if (indiceSlide >= slides.length) {
        indiceSlide = 0;
    } else if (indiceSlide < 0) {
        indiceSlide = slides.length - 1;
    }
    
    slides[indiceSlide].classList.add('ativa');
    resetarIntervalo(); // Zera o contador se o usuário clicar
}

// Troca o banner automaticamente a cada 5 segundos (5000 ms)
function autoPlay() {
    intervaloBanner = setInterval(() => {
        mudarSlide(1);
    }, 5000);
}

function resetarIntervalo() {
    clearInterval(intervaloBanner);
    autoPlay();
}

// Inicia o carrossel assim que a página carrega
autoPlay();