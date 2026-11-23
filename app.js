// =========================================================
// 1. FEED DE NOTÍCIAS (CARROSSEL E CURTIDAS)
// =========================================================

function rolarFeed(direcao) {
    const carrossel = document.getElementById('carrosselNoticias');
    if (!carrossel) return;

    const larguraCard = 266; // 250px largura do card + 16px de gap
    carrossel.scrollBy({
        left: direcao * larguraCard,
        behavior: 'smooth'
    });
}

function alternarCurtida(botao, idPost) {
    const contador = botao.querySelector('.contagem-curtidas');
    let numero = parseInt(contador.innerText, 10);
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

function registrarEngajamento(idPost, tipoAcao) {
    const dadosRastreamento = {
        postId: idPost,
        acao: tipoAcao,
        dataHora: new Date().toISOString()
    };

    console.log('Rastreamento de curtida coletado:', dadosRastreamento);

    /*
    Conexão futura com webhook (Power Automate / SharePoint / API interna):
    fetch('https://sua-url-de-webhook-boticario.com/curtidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosRastreamento)
    });
    */
}

// =========================================================
// 2. MODAL DE SUGESTÕES
// =========================================================

function abrirModalSugestao() {
    const modal = document.getElementById('modalSugestao');
    const feedback = document.getElementById('feedbackSugestao');
    if (!modal) return;

    if (feedback) {
        feedback.style.display = 'none';
    }

    modal.classList.add('ativo');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const primeiroCampo = document.getElementById('campoCargo');
    if (primeiroCampo) {
        primeiroCampo.focus();
    }
}

function fecharModalSugestao() {
    const modal = document.getElementById('modalSugestao');
    if (!modal) return;

    modal.classList.remove('ativo');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function fecharModalFora(evento) {
    if (evento.target.id === 'modalSugestao') {
        fecharModalSugestao();
    }
}

document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
        fecharModalSugestao();
    }
});

function enviarSugestao(evento) {
    evento.preventDefault();

    const form = document.getElementById('formSugestao');
    const feedback = document.getElementById('feedbackSugestao');

    const payloadSugestao = {
        cargo: document.getElementById('campoCargo').value.trim(),
        codigoPai: document.getElementById('campoCp').value.trim(),
        assunto: document.getElementById('campoAssunto').value,
        comentario: document.getElementById('campoComentario').value.trim(),
        dataHora: new Date().toISOString()
    };

    console.log('Sugestão registrada:', payloadSugestao);

    /*
    Conexão futura com webhook (Power Automate / SharePoint / API interna):
    fetch('https://sua-url-de-webhook-boticario.com/sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadSugestao)
    });
    */

    if (feedback) {
        feedback.style.display = 'block';
    }

    form.reset();

    setTimeout(() => {
        fecharModalSugestao();
    }, 1800);
}