// IMPORTAÇÃO APENAS DO BANCO DE DADOS
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';


// 1. CONEXÃO COM O SUPABASE
const supabaseUrl = 'INSERIR LINK DO BANCO DE DADOS';
const supabaseKey = 'INSERIR CHAVE DE ACESSO DO BANCO DE DADOS';
const supabase = createClient(supabaseUrl, supabaseKey);


// 2. PERFIL PADRÃO (VISITANTE)
let usuarioAtual = {
 nome: "Visitante Anônimo",
 email: "visitante@hub.com",
 cp: "N/A",
 loja: "N/A"
};


// 3. A ANTENA DO WALKIE-TALKIE (postMessage)
let dadosRecebidos = false;


window.addEventListener('message', function(event) {
 // Verifica se a mensagem tem os dados da extranet
 if (event.data && event.data.acao === 'LOGIN_EXTRANET') {
  
   // Se for a primeira vez que recebe, atualiza os dados
   if (!dadosRecebidos) {
     usuarioAtual.nome = event.data.nome;
     usuarioAtual.email = event.data.email;
     usuarioAtual.cp = event.data.cp;
     usuarioAtual.loja = event.data.loja;
    
     console.log("🔥 SUCESSO! Dados recebidos pelo Walkie-Talkie:", usuarioAtual);
     dadosRecebidos = true;
    
     // Recarrega o feed para marcar as postagens que essa pessoa específica já curtiu
     carregarFeed();
   }
 }
});




// Variáveis de Controle
let bannerIndex = 0; let materialIndex = 0;
let intervalBanner; let intervalMaterial;
let postCarouselsLog = {};
let postsGlobais = [];


document.addEventListener("DOMContentLoaded", () => {
 carregarHub();
 carregarFeed();
 carregarCardsDinamicos();
});


// ---------------------------------------------------
// SISTEMA DE NAVEGAÇÃO DE ABAS E CARDS DA HOME
// ---------------------------------------------------
window.openTab = (tabId, btnElement) => {
 document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
 document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
 document.getElementById(tabId).classList.add('active');
 if (btnElement) btnElement.classList.add('active');
};


window.navegarComMenu = (tabId, indexBotaoNav) => {
 const botoesNav = document.querySelectorAll('.nav-btn');
 window.openTab(tabId, botoesNav[indexBotaoNav]);
};


// Controles dos Trilhos e Ver Todos
window.rolarTrilho = (id, dir) => { const t = document.getElementById(id); if (t) t.scrollBy({ left: dir * 345, behavior: 'smooth' }); };
window.toggleVerTodos = (id, btn) => { const t = document.getElementById(id); if (t) { t.classList.toggle('grid-expanded'); btn.innerText = t.classList.contains('grid-expanded') ? "Ver menos" : "Ver todos"; } };


// Mapeamento de Funções Globais
window.mudarBanner = mudarBanner; window.irParaBanner = irParaBanner;
window.mudarMaterial = mudarMaterial; window.irParaMaterial = irParaMaterial;
window.dispararCurtida = dispararCurtida; window.abrirComentarios = abrirComentarios;
window.enviarComentario = enviarComentario; window.mudarSlidePost = mudarSlidePost;
window.abrirModalImagem = abrirModalImagem; window.fecharModalImagem = fecharModalImagem;
window.enviarComentarioViewer = enviarComentarioViewer; window.mudarSlideViewer = mudarSlideViewer;




// ---------------------------------------------------
// MOTOR DE RENDERIZAÇÃO DO FEED
// ---------------------------------------------------
async function carregarFeed() {
 const feedMount = document.getElementById('feed-mount');
  const { data: posts, error } = await supabase
   .from('feed_posts')
   .select(`*, feed_likes ( usuario_email ), feed_comentarios ( * ), feed_post_imagens ( imagem_url, ordem )`)
   .eq('status', 'Ativo')
   .order('criado_em', { ascending: false });


 if (error) { feedMount.innerHTML = `<p style="text-align:center; color:red;">Erro ao carregar feed.</p>`; return; }
 if (!posts || posts.length === 0) { feedMount.innerHTML = '<p style="text-align:center;">Nenhum post ativo.</p>'; return; }


 let feedHTML = '<div class="feed-container">';
 postsGlobais = posts;


 posts.forEach(post => {
   // Agora validamos a curtida pelo EMAIL capturado, sendo único por colaborador
   const curtiu = post.feed_likes.some(like => like.usuario_email === usuarioAtual.email);
   const classeLike = curtiu ? 'liked' : '';
   const likesCount = post.feed_likes.length;


   postCarouselsLog[post.id] = 0;


   let areaDeMidiaHTML = "";
   let fotos = post.feed_post_imagens || [];
   fotos.sort((a, b) => a.ordem - b.ordem);


   const linkEhVideo = (url) => url && url.match(/\.(mp4|webm|ogg)$/i);


   if (fotos.length <= 1) {
     if (linkEhVideo(post.imagem_post)) {
       areaDeMidiaHTML = `<video src="${post.imagem_post}" controls class="post-image" style="background: #000; object-fit: contain;"></video>`;
     } else {
       areaDeMidiaHTML = `<img src="${post.imagem_post}" class="post-image" style="cursor: pointer;" onclick="abrirModalImagem(${post.id})">`;
     }
   } else {
     areaDeMidiaHTML = `<div class="post-carousel-container" id="carousel-post-container-${post.id}">`;
     let indHTML = `<div class="carousel-indicators">`;
    
     fotos.forEach((foto, idx) => {
       let active = idx === 0 ? 'active' : '';
       let midiaTag = linkEhVideo(foto.imagem_url)
         ? `<video src="${foto.imagem_url}" controls style="width: 100%; height: 100%; object-fit: contain; background: #000;"></video>`
         : `<img src="${foto.imagem_url}" style="cursor: pointer;" onclick="abrirModalImagem(${post.id})">`;
        
       areaDeMidiaHTML += `<div class="slide-p slide-p-${post.id} ${active}">${midiaTag}</div>`;
       indHTML += `<div class="indicator-p indicator-p-${post.id} ${active}"></div>`;
     });
    
     indHTML += `</div>`;
     areaDeMidiaHTML += indHTML + `<button class="carousel-btn carousel-prev" onclick="mudarSlidePost(${post.id}, -1)">&#10094;</button><button class="carousel-btn carousel-next" onclick="mudarSlidePost(${post.id}, 1)">&#10095;</button></div>`;
   }


   let linkBotaoHTML = "";
   if (post.link_acao && post.link_acao.trim() !== "") {
     let alvoDoLink = post.link_acao.includes('artigo.html') ? '_self' : '_blank';
     linkBotaoHTML = `<a href="${post.link_acao}" target="${alvoDoLink}" class="btn-post-link">Acessar Link</a>`;
   }


   let dataPostFormatada = new Date(post.criado_em).toLocaleDateString('pt-BR');


   feedHTML += `
     <article class="post-card" id="post-${post.id}">
       <div class="post-header"><img src="${post.autor_avatar || 'https://via.placeholder.com/40'}" class="post-avatar"><div class="post-author-info"><h4>${post.autor_nome}</h4><span>${dataPostFormatada}</span></div></div>
      
       ${areaDeMidiaHTML}
      
       <div class="post-actions">
         <button class="action-btn btn-like ${classeLike}" onclick="dispararCurtida(${post.id}, this)">
           <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
         </button>
        
         <button class="action-btn btn-comment" style="display: none;" onclick="abrirComentarios(${post.id})">
           <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
         </button>
        
         ${linkBotaoHTML}
       </div>


       <div class="post-content">
         <div class="likes-count" id="like-count-${post.id}">${likesCount} curtidas</div>
         <p class="post-caption"><strong>${post.autor_nome}</strong> ${post.legenda}</p>
        
         <a class="post-comments-link" style="display: none;" onclick="abrirComentarios(${post.id})" style="margin-top:15px;">
           ${post.feed_comentarios.length > 0 ? `Ver todos os ${post.feed_comentarios.length} comentários...` : `Seja o primeiro a comentar...`}
         </a>
        
         <div class="comments-section" id="comments-section-${post.id}">
           <div id="comments-list-${post.id}"></div>
           <div class="comment-input-wrapper" style="display: none;">
             <input type="text" id="input-com-${post.id}" class="comment-input" placeholder="Adicione um comentário...">
             <button class="btn-send-comment" onclick="enviarComentario(${post.id})">Publicar</button>
           </div>
         </div>
       </div>
     </article>`;
 });
 feedHTML += '</div>'; feedMount.innerHTML = feedHTML;
}


function mudarSlidePost(postId, dir) {
 let slides = document.querySelectorAll(`.slide-p-${postId}`); let inds = document.querySelectorAll(`.indicator-p-${postId}`);
 if(!slides.length) return;
 slides[postCarouselsLog[postId]].classList.remove('active'); if(inds.length) inds[postCarouselsLog[postId]].classList.remove('active');
 postCarouselsLog[postId] = (postCarouselsLog[postId] + dir + slides.length) % slides.length;
 slides[postCarouselsLog[postId]].classList.add('active'); if(inds.length) inds[postCarouselsLog[postId]].classList.add('active');
}




// ---------------------------------------------------
// MOTOR DOS CARDS DINÂMICOS (FERRAMENTAS E GB)
// ---------------------------------------------------
async function carregarCardsDinamicos() {
 const mountFerramentas = document.getElementById('mount-ferramentas');
 const mountGb = document.getElementById('mount-gb');


 const { data: cards, error } = await supabase.from('cards_dinamicos').select('*').eq('status', 'Ativo');


 if (error || !cards) {
   mountFerramentas.innerHTML = `<p style="text-align:center; color:red;">Erro ao carregar ferramentas.</p>`;
   mountGb.innerHTML = `<p style="text-align:center; color:red;">Erro ao carregar dados do GB.</p>`;
   return;
 }


 const montarHTMLdaAba = (nomeDaAba, isGbCard) => {
   const meusCards = cards.filter(c => c.aba === nomeDaAba);
   if (meusCards.length === 0) return '<p style="color:var(--text-muted); text-align:center; padding: 40px;">Nenhum material cadastrado nesta seção ainda.</p>';


   let categorias = [...new Set(meusCards.map(c => c.categoria))];
   const ordemOficial = ["Para Toda a Rede", "Canal Loja", "Canal VD", "Categorias"];


   categorias.sort((a, b) => {
     let indexA = ordemOficial.indexOf(a); let indexB = ordemOficial.indexOf(b);
     if (indexA === -1) indexA = 999; if (indexB === -1) indexB = 999;
     return indexA - indexB;
   });


   let htmlFinal = '';


   categorias.forEach(cat => {
     const cardsDaCategoria = meusCards.filter(c => c.categoria === cat);
     const trilhoId = `trilho-${nomeDaAba}-${cat.replace(/\s+/g, '-').toLowerCase()}`;
     const exibirControles = cardsDaCategoria.length > 3;


     htmlFinal += `
       <div class="category-section">
         <div class="category-header">
           <h3 class="category-title">${cat}</h3>
           ${exibirControles ? `<button class="btn-ver-todos" onclick="toggleVerTodos('${trilhoId}', this)">Ver todos</button>` : ''}
         </div>
         <div class="scroller-wrapper">
           ${exibirControles ? `<button class="rail-btn rail-prev" onclick="rolarTrilho('${trilhoId}', -1)">&#10094;</button>` : ''}
           <div class="cards-scroller" id="${trilhoId}">`;
    
     cardsDaCategoria.forEach(card => {
       const iconeHTML = card.icone_url
         ? `<img src="${card.icone_url}">`
         : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`;
      
       const classeExtra = isGbCard ? ' gb-card' : '';
       const textoDoBotao = (card.texto_botao && card.texto_botao.trim() !== "") ? card.texto_botao : "Acessar Link";
       const alvoDoLink = (card.link_acao && card.link_acao.includes('artigo.html')) ? '_self' : '_blank';


       htmlFinal += `
         <div class="tool-card${classeExtra}">
           <div class="tool-icon">${iconeHTML}</div>
           <h4>${card.titulo}</h4>
           <p>${card.descricao}</p>
           <a href="${card.link_acao || '#'}" target="${alvoDoLink}">${textoDoBotao} &rarr;</a>
          
           <!-- CORTINA PREMIUM FLUTUANTE -->
           <div class="premium-tooltip">${card.descricao}</div>
         </div>`;
     });


     htmlFinal += `
           </div>
           ${exibirControles ? `<button class="rail-btn rail-next" onclick="rolarTrilho('${trilhoId}', 1)">&#10095;</button>` : ''}
         </div>
       </div>`;
   });


   return htmlFinal;
 };


 mountFerramentas.innerHTML = montarHTMLdaAba('ferramentas', false);
 mountGb.innerHTML = montarHTMLdaAba('gb', true);
}




// ---------------------------------------------------
// MOTOR DOS CARROSSEL LATERAIS (HUB)
// ---------------------------------------------------
async function carregarHub() {
 const bannerMount = document.getElementById('carousel-banner-mount');
 const materialMount = document.getElementById('carousel-material-mount');
 bannerMount.innerHTML = ''; materialMount.innerHTML = '';
 clearInterval(intervalBanner); clearInterval(intervalMaterial);


 const { data: dados, error } = await supabase.from('hub_inicio').select('*').eq('status', 'Ativo');
 if (error || !dados || dados.length === 0) {
   bannerMount.innerHTML = '<p style="text-align:center; color:#6B7280; font-size:13px;">Sem destaques.</p>';
   materialMount.innerHTML = '<p style="text-align:center; color:#6B7280; font-size:13px;">Sem materiais.</p>';
   return;
 }
 const banners = dados.filter(d => d.tipo.toLowerCase() === 'banner');
 const materiais = dados.filter(d => d.tipo.toLowerCase() === 'material');


 if (banners.length > 0) {
   let html = `<div class="carousel-container carousel-banner-size"><div class="carousel-indicators">`;
   banners.forEach((banner, idx) => { html += `<div class="indicator-b ${idx === 0 ? 'active' : ''}" onclick="irParaBanner(${idx})"></div>`; });
   html += `</div>`;
   banners.forEach((banner, idx) => {
     let alvoB = (banner.link_acao && banner.link_acao.includes('artigo.html')) ? '_self' : '_blank';
     html += `<div class="slide-b ${idx === 0 ? 'active' : ''}"><img src="${banner.imagem_url}"><div class="slide-banner-content"><h2>${banner.titulo}</h2><p>${banner.descricao}</p><a href="${banner.link_acao}" target="${alvoB}" class="btn-acao">Acessar</a></div></div>`;
   });
   if (banners.length > 1) html += `<button class="carousel-btn carousel-prev" onclick="mudarBanner(-1)">&#10094;</button><button class="carousel-btn carousel-next" onclick="mudarBanner(1)">&#10095;</button>`;
   bannerMount.innerHTML = html + `</div>`; if (banners.length > 1) iniciarTimerBanner();
 } else { bannerMount.innerHTML = '<p style="text-align:center; color:#6B7280; font-size:13px;">Sem destaques.</p>'; }


 if (materiais.length > 0) {
   let html = `<div class="carousel-container carousel-material-size"><div class="carousel-indicators">`;
   materiais.forEach((mat, idx) => { html += `<div class="indicator-m ${idx === 0 ? 'active' : ''}" onclick="irParaMaterial(${idx})"></div>`; });
   html += `</div>`;
   materiais.forEach((mat, idx) => {
     let alvoM = (mat.link_acao && mat.link_acao.includes('artigo.html')) ? '_self' : '_blank';
     html += `<div class="slide-m ${idx === 0 ? 'active' : ''}"><div class="card-material-content"><img src="${mat.imagem_url}" class="mat-card-img"><div class="card-material-body"><h4>${mat.titulo}</h4><p>${mat.descricao}</p><a href="${mat.link_acao}" target="${alvoM}" class="btn-acao">Acessar Treinamento</a></div></div></div>`;
   });
   if (materiais.length > 1) html += `<button class="carousel-btn carousel-prev" onclick="mudarMaterial(-1)">&#10094;</button><button class="carousel-btn carousel-next" onclick="mudarMaterial(1)">&#10095;</button>`;
   materialMount.innerHTML = html + `</div>`; if (materiais.length > 1) iniciarTimerMaterial();
 } else { materialMount.innerHTML = '<p style="text-align:center; color:#6B7280; font-size:13px;">Sem materiais.</p>'; }
}
function iniciarTimerBanner() { intervalBanner = setInterval(() => mudarBanner(1), 5000); }
function mudarBanner(dir) { let slides = document.querySelectorAll('.slide-b'); let inds = document.querySelectorAll('.indicator-b'); if(!slides.length) return; slides[bannerIndex].classList.remove('active'); if(inds.length) inds[bannerIndex].classList.remove('active'); bannerIndex = (bannerIndex + dir + slides.length) % slides.length; slides[bannerIndex].classList.add('active'); if(inds.length) inds[bannerIndex].classList.add('active'); }
function irParaBanner(idx) { clearInterval(intervalBanner); bannerIndex = idx; mudarBanner(0); iniciarTimerBanner(); }


function iniciarTimerMaterial() { intervalMaterial = setInterval(() => mudarMaterial(1), 6000); }
function mudarMaterial(dir) { let slides = document.querySelectorAll('.slide-m'); let inds = document.querySelectorAll('.indicator-m'); if(!slides.length) return; slides[materialIndex].classList.remove('active'); if(inds.length) inds[materialIndex].classList.remove('active'); materialIndex = (materialIndex + dir + slides.length) % slides.length; slides[materialIndex].classList.add('active'); if(inds.length) inds[materialIndex].classList.add('active'); }
function irParaMaterial(idx) { clearInterval(intervalMaterial); materialIndex = idx; mudarMaterial(0); iniciarTimerMaterial(); }




// ---------------------------------------------------
// INTERAÇÕES SOCIAIS DO FEED
// ---------------------------------------------------
async function dispararCurtida(postId, btnElement) {
 const isLiked = btnElement.classList.contains('liked'); btnElement.classList.toggle('liked'); let spanCount = document.getElementById(`like-count-${postId}`); let totalAtual = parseInt(spanCount.innerText);
 // Banco usa o EMAIL real capturado na URL
 if (!isLiked) { spanCount.innerText = (totalAtual + 1) + " curtidas"; await supabase.from('feed_likes').insert([{ post_id: postId, usuario_email: usuarioAtual.email }]); }
 else { spanCount.innerText = (totalAtual - 1) + " curtidas"; await supabase.from('feed_likes').delete().match({ post_id: postId, usuario_email: usuarioAtual.email }); }
}
function abrirComentarios(postId) { const div = document.getElementById(`comments-section-${postId}`); div.style.display = (div.style.display === 'block') ? 'none' : 'block'; }
async function enviarComentario(postId) {
 const input = document.getElementById(`input-com-${postId}`); const texto = input.value.trim(); if (texto === "") return;
 input.value = "Enviando..."; input.disabled = true;
 // Banco usa o NOME real capturado na URL
 const { data, error } = await supabase.from('feed_comentarios').insert([{ post_id: postId, usuario_nome: usuarioAtual.nome, comentario: texto }]).select();
 if (!error && data) { input.value = ""; input.disabled = false; document.getElementById(`comments-list-${postId}`).innerHTML += `<div class="comment-line"><strong>${usuarioAtual.nome}</strong> ${texto} <span class="comment-date">${new Date().toLocaleDateString('pt-BR')}</span></div>`; }
 else { alert("Erro ao enviar comentário."); input.value = texto; input.disabled = false; }
}




// ---------------------------------------------------
// TELA DE CINEMA (VISUALIZADOR MODAL)
// ---------------------------------------------------
function abrirModalImagem(postId) {
 const post = postsGlobais.find(p => p.id === postId); if (!post) return;
 const modal = document.getElementById('modal-image-viewer');
  document.getElementById('viewer-header-mount').innerHTML = `<img src="${post.autor_avatar || 'https://via.placeholder.com/40'}" class="post-avatar" style="width: 44px; height: 44px; border: 2px solid var(--peach-accent); border-radius: 50%; padding:2px;">
   <div><h4 style="margin:0; font-size:15px; color:var(--navy-dark); font-weight:600;">${post.autor_nome}</h4><span style="font-size:12px; color:var(--text-muted);">${new Date(post.criado_em).toLocaleDateString('pt-BR')}</span></div>`;


 let fotos = post.feed_post_imagens || []; fotos.sort((a, b) => a.ordem - b.ordem); let indiceAtual = postCarouselsLog[post.id] || 0;
 let mediaMount = document.getElementById('viewer-media-mount');
 const linkEhVideoViewer = (url) => url && url.match(/\.(mp4|webm|ogg)$/i);
  if (fotos.length <= 1) {
    if (linkEhVideoViewer(post.imagem_post)) {
      mediaMount.innerHTML = `<video src="${post.imagem_post}" controls autoplay style="max-width:100%; max-height:100%; object-fit:contain;"></video>`;
    } else {
      mediaMount.innerHTML = `<img src="${post.imagem_post}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
    }
 } else {
    let htmlMedia = '';
    fotos.forEach((foto, idx) => {
      let display = idx === indiceAtual ? 'block' : 'none';
      let tagMidiaModal = linkEhVideoViewer(foto.imagem_url)
        ? `<video src="${foto.imagem_url}" controls class="viewer-slide viewer-slide-${post.id}" style="display:${display}; width:100%; height:100%; object-fit:contain; position:absolute;"></video>`
        : `<img src="${foto.imagem_url}" class="viewer-slide viewer-slide-${post.id}" style="display:${display}; width:100%; height:100%; object-fit:contain; position:absolute;">`;
      htmlMedia += tagMidiaModal;
    });
    htmlMedia += `<button class="carousel-btn carousel-prev" style="left:20px; z-index:10;" onclick="mudarSlideViewer(${post.id}, -1)">&#10094;</button><button class="carousel-btn carousel-next" style="right:20px; z-index:10;" onclick="mudarSlideViewer(${post.id}, 1)">&#10095;</button>`;
    mediaMount.innerHTML = htmlMedia;
 }


 let linkNaTelaDeCinema = "";
 if (post.link_acao && post.link_acao.trim() !== "") {
    let alvoDoModal = post.link_acao.includes('artigo.html') ? '_self' : '_blank';
    linkNaTelaDeCinema = `<br><a href="${post.link_acao}" target="${alvoDoModal}" class="btn-post-link" style="margin-top:10px;">Acessar Link</a>`;
 }


 let htmlComments = `<div class="comment-line" style="border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 15px; margin-bottom: 15px;"><strong>${post.autor_nome}</strong> ${post.legenda} ${linkNaTelaDeCinema}</div>`;
 document.getElementById('viewer-comments-list').innerHTML = htmlComments;


 document.getElementById('viewer-actions-mount').innerHTML = `<div class="comment-input-wrapper" style="display:none;"><input type="text" id="input-viewer-${post.id}" class="comment-input" placeholder="Adicione um comentário..."><button class="btn-send-comment" onclick="enviarComentarioViewer(${post.id})">Publicar</button></div>`;
 modal.style.display = 'flex';
}


function fecharModalImagem() { document.getElementById('modal-image-viewer').style.display = 'none'; }


function mudarSlideViewer(postId, dir) {
  let slides = document.querySelectorAll(`.viewer-slide-${postId}`); if(!slides.length) return;
  slides[postCarouselsLog[postId]].style.display = 'none'; postCarouselsLog[postId] = (postCarouselsLog[postId] + dir + slides.length) % slides.length; slides[postCarouselsLog[postId]].style.display = 'block';
  mudarSlidePost(postId, dir);
}


async function enviarComentarioViewer(postId) {
 const input = document.getElementById(`input-viewer-${postId}`); const texto = input.value.trim(); if (texto === "") return;
 input.value = "Enviando..."; input.disabled = true;
 // Banco usa o NOME real capturado na URL
 const { data, error } = await supabase.from('feed_comentarios').insert([{ post_id: postId, usuario_nome: usuarioAtual.nome, comentario: texto }]).select();
 if (!error && data) {
   input.value = ""; input.disabled = false;
   let novoComentarioHTML = `<div class="comment-line"><strong>${usuarioAtual.nome}</strong> ${texto} <span class="comment-date">${new Date().toLocaleDateString('pt-BR')}</span></div>`;
   document.getElementById('viewer-comments-list').innerHTML += novoComentarioHTML;
   const listaFeedFundo = document.getElementById(`comments-list-${postId}`); if(listaFeedFundo) listaFeedFundo.innerHTML += novoComentarioHTML;
   const postIndex = postsGlobais.findIndex(p => p.id === postId); if(postIndex > -1) postsGlobais[postIndex].feed_comentarios.push(data[0]);
 } else { alert("Erro ao enviar comentário."); input.value = texto; input.disabled = false; }
}