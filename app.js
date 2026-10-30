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

// Rolagem pelas setas do feed
function rolarFeed(direcao) {
    const carrossel = document.getElementById('carrosselNoticias');
    const larguraCard = 266; // 250px largura + 16px de espaçamento
    carrossel.scrollBy({
        left: direcao * larguraCard,
        behavior: 'smooth'
    });
}

// Alternar Curtida com ponto de rastreamento
function alternarCurtida(botao, idPost) {
    const contador = botao.querySelector('.contagem-curtidas');
    let numero = parseInt(contador.innerText);
    const estaCurtido = botao.classList.contains('curtido');

    if (estaCurtido) {
        botao.classList.remove('curtido');
        contador.innerText = numero - 1;
        registrarEngajamento(idPost, 'descurtir');
    } else {
        botao.classList.add('curtido');
        contador.innerText = numero + 1;
        registrarEngajamento(idPost, 'curtir');
    }
}

// Alternar caixa de comentários
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

// Inserir comentário com ponto de coleta
function enviarComentario(evento, input, idPost) {
    if (evento.key === 'Enter' && input.value.trim() !== '') {
        const texto = input.value.trim();
        const area = input.closest('.area-comentarios');
        const lista = area.querySelector('.lista-comentarios');
        
        const novoComentario = document.createElement('div');
        novoComentario.className = 'item-comentario';
        novoComentario.innerText = texto;
        
        lista.appendChild(novoComentario);
        input.value = '';

        registrarEngajamento(idPost, 'comentario', texto);
    }
}

// Função de telemetria / rastreamento para conectar à API corporativa
function registrarEngajamento(idPost, tipoAcao, conteudo = '') {
    const dadosRastreamento = {
        postId: idPost,
        acao: tipoAcao,
        comentario: conteudo,
        dataHora: new Date().toISOString()
    };

    console.log("Rastreamento coletado:", dadosRastreamento);

    /* 
    Exemplo de conexão futura com Power Automate ou endpoint interno:
    fetch('https://sua-url-de-webhook-boticario.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosRastreamento)
    });
    */
}