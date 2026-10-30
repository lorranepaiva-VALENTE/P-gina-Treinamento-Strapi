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
// Interação de Curtida (Like com animação e incremento)
function alternarCurtida(botao) {
    const contador = botao.querySelector('.contagem-curtidas');
    let numero = parseInt(contador.innerText);

    if (botao.classList.contains('curtido')) {
        botao.classList.remove('curtido');
        contador.innerText = numero - 1;
    } else {
        botao.classList.add('curtido');
        contador.innerText = numero + 1;
    }
}

// Expande ou recolhe o campo de comentário
function alternarCaixaComentario(botao) {
    const card = botao.closest('.conteudo-post');
    const area = card.querySelector('.area-comentarios');
    
    if (area.style.display === 'none' || area.style.display === '') {
        area.style.display = 'block';
        area.querySelector('input').focus();
    } else {
        area.style.display = 'none';
    }
}

// Insere o comentário na lista ao pressionar 'Enter'
function enviarComentario(evento, input) {
    if (evento.key === 'Enter' && input.value.trim() !== '') {
        const area = input.closest('.area-comentarios');
        const lista = area.querySelector('.lista-comentarios');
        
        const novoComentario = document.createElement('div');
        novoComentario.className = 'item-comentario';
        novoComentario.innerText = input.value.trim();
        
        lista.appendChild(novoComentario);
        input.value = '';
    }
}