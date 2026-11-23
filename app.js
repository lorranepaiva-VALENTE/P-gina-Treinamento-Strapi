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
// =========================================================
// 3. MODAL DE DETALHES - NOSSAS CAPACITAÇÕES
// =========================================================

const dadosCapacitacoes = {
    academy: {
        titulo: 'Academy & Sucessores',
        oQueE: 'Programa de desenvolvimento contínuo para franqueados, operadores e sucessores homologados, com jornadas focadas em competências essenciais para perenidade do negócio.',
        comoApoia: 'Garante que a alta liderança das franquias esteja preparada para gerenciar a complexidade das operações com visão estratégica, inovação e alinhamento à nossa cultura.',
        btn1Texto: 'Acessar Plataforma Academy',
        btn1Link: 'LINK_PLATAFORMA_ACADEMY',
        btn2Texto: 'Acessar Trilha de Sucessores',
        btn2Link: 'LINK_TRILHA_SUCESSORES'
    },
    loja: {
        titulo: 'Canal Loja',
        oQueE: 'Capacitação voltada para a equipe de loja, liderança e multiplicadoras, com foco em realizar vendas da melhor forma possível, sempre centradas no cliente.',
        comoApoia: 'Aprofunda o conhecimento no Modelo de Atendimento O Boticário e Chega Junto (QDB), além do programa de fidelidade, garantindo resultados sustentáveis e de qualidade.',
        btn1Texto: 'Acessar Botileza (O Boticário)',
        btn1Link: 'LINK_BOTILEZA_BOTICARIO',
        btn2Texto: 'Acessar Chega Junto (QDB)',
        btn2Link: 'LINK_CHEGA_JUNTO_QDB'
    },
    lideranca: {
        titulo: 'Liderança & Backoffice',
        oQueE: 'Trilhas de desenvolvimento exclusivas para o time de liderança, backoffice das franquias e multiplicadoras, estruturadas nos pilares do futuro da rede.',
        comoApoia: 'Prepara as equipes para atuarem com foco na excelência, fortalecendo fundamentos críticos como gestão de pessoas, gestão financeira e visão sistêmica da franquia.',
        btn1Texto: 'Acessar Trilha Liderança',
        btn1Link: 'LINK_TRILHA_LIDERANCA',
        btn2Texto: 'Acessar Plataforma Backoffice',
        btn2Link: 'LINK_PLATAFORMA_BACKOFFICE'
    },
    vd: {
        titulo: 'Venda Direta',
        oQueE: 'Frentes de capacitação direcionadas para a equipe, liderança e multiplicadoras de VD, além de conteúdos abertos diretamente para revendedores.',
        comoApoia: 'Oferece o modelo de atendimento Maestria para gestão dos Espaços do Revendedor e garante acesso fácil e dinâmico aos conteúdos de vendas via YouTube.',
        btn1Texto: 'Acessar Maestria (Espaço VD)',
        btn1Link: 'LINK_MAESTRIA_ESPACO_VD',
        btn2Texto: 'Acessar Canal do YouTube',
        btn2Link: 'LINK_CANAL_YOUTUBE_VD'
    }
};

function abrirModalCapacitacao(chave) {
    const dados = dadosCapacitacoes[chave];
    const modal = document.getElementById('modalCapacitacao');
    if (!dados || !modal) return;

    document.getElementById('tituloModalCapacitacao').innerText = dados.titulo;
    document.getElementById('textoOQueE').innerText = dados.oQueE;
    document.getElementById('textoComoApoia').innerText = dados.comoApoia;

    const btn1 = document.getElementById('btnModalCap1');
    const btn2 = document.getElementById('btnModalCap2');

    btn1.querySelector('span').innerText = dados.btn1Texto;
    btn1.href = dados.btn1Link;

    btn2.querySelector('span').innerText = dados.btn2Texto;
    btn2.href = dados.btn2Link;

    modal.classList.add('ativo');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function fecharModalCapacitacao() {
    const modal = document.getElementById('modalCapacitacao');
    if (!modal) return;

    modal.classList.remove('ativo');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function fecharModalCapacitacaoFora(evento) {
    if (evento.target.id === 'modalCapacitacao') {
        fecharModalCapacitacao();
    }
}
// =========================================================
// 4. FEEDBACK DO VÍDEO TUTORIAL - GESTÃO DE TREINAMENTOS
// =========================================================

function registrarFeedbackTutorial(foiUtil) {
    const grupoBotoes = document.getElementById('botoesFeedbackTutorial');
    const mensagemAgradecimento = document.getElementById('msgFeedbackTutorial');

    if (grupoBotoes) {
        grupoBotoes.style.display = 'none';
    }

    if (mensagemAgradecimento) {
        mensagemAgradecimento.style.display = 'inline-flex';
    }

    const dadosFeedback = {
        tutorial: 'Treinamentos Gerais',
        util: foiUtil,
        dataHora: new Date().toISOString()
    };

    console.log('Feedback do tutorial registrado:', dadosFeedback);

    /*
    Conexão futura com webhook (Power Automate / SharePoint / API interna):
    fetch('https://sua-url-de-webhook-boticario.com/feedback-tutorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFeedback)
    });
    */
}

document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
        fecharModalCapacitacao();
    }
});