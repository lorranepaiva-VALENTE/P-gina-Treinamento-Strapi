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
    const contador = botao.querySelector('.contagem-curtidas, .contador-curtidas, span');
    if (!contador) return;

    let numero = parseInt(contador.innerText, 10) || 0;
    const estaCurtido = botao.classList.contains('curtido');

    if (estaCurtido) {
        botao.classList.remove('curtido');
        contador.innerText = Math.max(0, numero - 1);
        registrarEngajamento(idPost, 'descurtir');
    } else {
        botao.classList.add('curtido');
        contador.innerText = numero + 1;
        registrarEngajamento(idPost, 'curtir');
        registrarCurtidaPlanilha(idPost);
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
// =========================================================
// 5. SELETOR DE VÍDEOS - SUBPÁGINA IAF FORÇA DE VENDAS
// =========================================================

const videosDashboardFV = {
    fv: {
        nome: 'Força de Vendas',
        tituloOverlay: 'Dashboard Força de Vendas',
        descricaoOverlay: 'O vídeo explicativo passo a passo estará disponível em breve.',
        videoUrl: '' // Quando publicar no Strapi, coloque aqui a URL .mp4
    },
    ciclo: {
        nome: 'Ciclo',
        tituloOverlay: 'Dashboard Ciclo',
        descricaoOverlay: 'O vídeo explicativo sobre o acompanhamento do Ciclo estará disponível em breve.',
        videoUrl: '' // Quando publicar no Strapi, coloque aqui a URL .mp4
    }
};

function selecionarVideoFV(chave, botaoClicado) {
    const config = videosDashboardFV[chave];
    if (!config) return;

    const botoes = document.querySelectorAll('.btn-seletor-video');
    botoes.forEach((btn) => btn.classList.remove('ativo'));
    if (botaoClicado) {
        botaoClicado.classList.add('ativo');
    }

    const legenda = document.getElementById('legendaVideoFV');
    if (legenda) {
        legenda.innerHTML = `Tutorial selecionado: <strong>${config.nome}</strong> • <span class="destaque-breve-topo">Em breve</span>`;
    }

    const overlay = document.getElementById('overlayEmBreveFV');
    const tituloOverlay = document.getElementById('tituloOverlayVideoFV');
    const descOverlay = document.getElementById('descricaoOverlayVideoFV');
    const player = document.getElementById('playerVideoFV');
    const source = document.getElementById('sourceVideoFV');

    if (tituloOverlay) tituloOverlay.innerText = config.tituloOverlay;
    if (descOverlay) descOverlay.innerText = config.descricaoOverlay;

    if (config.videoUrl && config.videoUrl.trim() !== '') {
        if (overlay) overlay.classList.add('oculto');
        if (source && player) {
            source.src = config.videoUrl;
            player.load();
        }
    } else {
        if (overlay) overlay.classList.remove('oculto');
    }
}
// =========================================================
// 6. SELETOR DE VÍDEO - SUBPÁGINA IAF ACADEMY
// =========================================================

const videosDashboardAcademy = {
    'alta-lideranca': {
        nome: 'Alta liderança',
        tituloOverlay: 'Dashboard Academy — Alta liderança',
        descricaoOverlay: 'O vídeo explicativo passo a passo estará disponível em breve.',
        videoUrl: '' // Quando publicar no Strapi, coloque aqui a URL .mp4
    }
};

function selecionarVideoAcademy(chave, botaoClicado) {
    const config = videosDashboardAcademy[chave];
    if (!config) return;

    if (botaoClicado) {
        botaoClicado.classList.add('ativo');
    }

    const legenda = document.getElementById('legendaVideoAcademy');
    if (legenda) {
        legenda.innerHTML = `Tutorial selecionado: <strong>${config.nome}</strong> • <span class="destaque-breve-topo">Em breve</span>`;
    }

    const overlay = document.getElementById('overlayEmBreveAcademy');
    const tituloOverlay = document.getElementById('tituloOverlayVideoAcademy');
    const descOverlay = document.getElementById('descricaoOverlayVideoAcademy');
    const player = document.getElementById('playerVideoAcademy');
    const source = document.getElementById('sourceVideoAcademy');

    if (tituloOverlay) tituloOverlay.innerText = config.tituloOverlay;
    if (descOverlay) descOverlay.innerText = config.descricaoOverlay;

    if (config.videoUrl && config.videoUrl.trim() !== '') {
        if (overlay) overlay.classList.add('oculto');
        if (source && player) {
            source.src = config.videoUrl;
            player.load();
        }
    } else {
        if (overlay) overlay.classList.remove('oculto');
    }
}
// =========================================================
// 7. SELETOR DE VÍDEO - SUBPÁGINA IAF LAB LIDERANÇA & BACKOFFICE
// =========================================================

const videosDashboardLideranca = {
    'treinamentos-gerais': {
        nome: 'Treinamentos gerais',
        tituloOverlay: 'Dashboard Treinamentos Gerais',
        descricaoOverlay: 'O vídeo explicativo passo a passo estará disponível em breve.',
        videoUrl: '' // Quando publicar no Strapi, coloque aqui a URL .mp4
    }
};

function selecionarVideoLideranca(chave, botaoClicado) {
    const config = videosDashboardLideranca[chave];
    if (!config) return;

    if (botaoClicado) {
        botaoClicado.classList.add('ativo');
    }

    const legenda = document.getElementById('legendaVideoLideranca');
    if (legenda) {
        legenda.innerHTML = `Tutorial selecionado: <strong>${config.nome}</strong> • <span class="destaque-breve-topo">Em breve</span>`;
    }

    const overlay = document.getElementById('overlayEmBreveLideranca');
    const tituloOverlay = document.getElementById('tituloOverlayVideoLideranca');
    const descOverlay = document.getElementById('descricaoOverlayVideoLideranca');
    const player = document.getElementById('playerVideoLideranca');
    const source = document.getElementById('sourceVideoLideranca');

    if (tituloOverlay) tituloOverlay.innerText = config.tituloOverlay;
    if (descOverlay) descOverlay.innerText = config.descricaoOverlay;

    if (config.videoUrl && config.videoUrl.trim() !== '') {
        if (overlay) overlay.classList.add('oculto');
        if (source && player) {
            source.src = config.videoUrl;
            player.load();
        }
    } else {
        if (overlay) overlay.classList.remove('oculto');
    }
}
// 6. Registrar Feedback dos Tutoriais (Joinha / Não Joinha)
function registrarFeedbackTutorial(botaoClicado, avaliacao) {
    const container = botaoClicado.closest(".box-feedback-tutorial");
    if (!container) return;

    // Evita múltiplos envios repetidos no mesmo clique
    if (container.dataset.enviado === "true") return;
    container.dataset.enviado = "true";

    const nomeTutorial = container.dataset.tutorial || document.title;

    // Destaca o botão escolhido
    const botoes = container.querySelectorAll(".btn-feedback-voto");
    botoes.forEach(btn => btn.classList.remove("votado"));
    botaoClicado.classList.add("votado");

    // Exibe mensagem de agradecimento
    const msg = container.querySelector(".msg-feedback-obrigado");
    if (msg) {
        msg.innerText = "Obrigado pelo seu feedback!";
        msg.classList.add("visivel");
    }

    // Envia para a aba "Feedback Tutoriais" no Google Sheets
    enviarParaPlanilha("feedback_tutorial", {
        tutorial: nomeTutorial,
        avaliacao: avaliacao
    });
}
// =========================================================
// 8. INTEGRAÇÃO EXTRANET (USUÁRIO LOGADO) + GOOGLE SHEETS
// =========================================================

const URL_PLANILHA_SHEETS = "https://script.google.com/a/macros/grupoboticario.com.br/s/AKfycbwLmwb_mEqqxKqjTaxHQnJUvyMDBTP8mlHbd7OrKzelg_CeBU_kOd8Q8tkrOMNhVbOQFA/exec";

// Tenta recuperar o usuário caso ele já tenha sido salvo ao navegar entre páginas
let usuarioExtranet = JSON.parse(sessionStorage.getItem("usuario_extranet_gb")) || {
    nome: "Visitante",
    email: "",
    cp: "",
    loja: ""
};

let acessoRegistradoNestaPagina = false;

// 1. Escuta o "Walkie-Talkie" enviado pela Extranet
window.addEventListener("message", function (event) {
    if (event.data && event.data.acao === "LOGIN_EXTRANET") {
        // Ignora se já recebemos os dados nessa tela
        if (usuarioExtranet.email === event.data.email && acessoRegistradoNestaPagina) {
            return;
        }

        usuarioExtranet = {
            nome: event.data.nome || "Visitante",
            email: event.data.email || "",
            cp: event.data.cp || "",
            loja: event.data.loja || ""
        };

        // Salva na sessão para as subpáginas (IAF) também saberem quem é
        sessionStorage.setItem("usuario_extranet_gb", JSON.stringify(usuarioExtranet));

        // Registra o acesso à página atual assim que identifica o usuário
        if (!acessoRegistradoNestaPagina) {
            acessoRegistradoNestaPagina = true;
            enviarParaPlanilha("navegacao", { acao: "Acessou a página" });
        }
    }
});

// Se já estava salvo na sessão (ex: entrou numa subpágina), registra o acesso direto
if (usuarioExtranet.email && !acessoRegistradoNestaPagina) {
    acessoRegistradoNestaPagina = true;
    enviarParaPlanilha("navegacao", { acao: "Acessou a página" });
}

// 2. Função central que envia qualquer evento para a planilha
function enviarParaPlanilha(tipo, dadosExtras = {}) {
    if (!URL_PLANILHA_SHEETS || URL_PLANILHA_SHEETS.includes("COLE_AQUI")) return;

    const formData = new FormData();
    formData.append("tipo", tipo);
    formData.append("nome", usuarioExtranet.nome);
    formData.append("email", usuarioExtranet.email);
    formData.append("cp", usuarioExtranet.cp);
    formData.append("loja", usuarioExtranet.loja);
    formData.append("pagina", document.title);

    for (const chave in dadosExtras) {
        formData.append(chave, dadosExtras[chave]);
    }

    return fetch(URL_PLANILHA_SHEETS, {
        method: "POST",
        body: formData
    }).catch(err => console.error("Erro ao enviar para planilha:", err));
}

// 3. Registrar Sugestão (agora com Cargo e Código Pai)
function registrarSugestaoPlanilha(cargo, codigoPai, tipoSugestao, textoSugestao) {
    return enviarParaPlanilha("sugestao", {
        cargo: cargo,
        codigoPai: codigoPai,
        tipoSugestao: tipoSugestao,
        sugestao: textoSugestao
    });
}

// 4. Registrar Curtidas nas Notícias
function registrarCurtidaPlanilha(tituloNoticia) {
    enviarParaPlanilha("curtida", { noticia: tituloNoticia });
}

// 5. Registrar Cliques em Botões Importantes (Unibê, PDFs, Modais, GB Resolve)
function registrarCliquePlanilha(nomeAcao) {
    enviarParaPlanilha("navegacao", { acao: nomeAcao });
}
// Conexão do Formulário de Sugestão com a Planilha
const formSugestao = document.getElementById("formSugestao");

if (formSugestao) {
    formSugestao.addEventListener("submit", function (e) {
        e.preventDefault();

        const cargoDigitado = document.getElementById("campoCargo").value;
        const codigoPaiDigitado = document.getElementById("campoCp").value;
        const tipoSelecionado = document.getElementById("campoAssunto").value;
        const textoDigitado = document.getElementById("campoComentario").value;

        registrarSugestaoPlanilha(cargoDigitado, codigoPaiDigitado, tipoSelecionado, textoDigitado)
            .then(() => {
                alert("Sugestão enviada com sucesso!");
                formSugestao.reset();
            });
    });
}
// Carrega a contagem real de curtidas da planilha ao abrir a página
function carregarCurtidasReais() {
    if (!URL_PLANILHA_SHEETS || URL_PLANILHA_SHEETS.includes("COLE_AQUI")) return;

    fetch(URL_PLANILHA_SHEETS)
        .then(res => res.json())
        .then(contagens => {
            document.querySelectorAll("[data-contador-post]").forEach(span => {
                const idPost = span.getAttribute("data-contador-post");
                span.innerText = contagens[idPost] || 0;
            });
        })
        .catch(err => console.error("Erro ao carregar curtidas:", err));
}

document.addEventListener("DOMContentLoaded", carregarCurtidasReais);