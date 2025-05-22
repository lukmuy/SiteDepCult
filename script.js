// Função para inicializar o slider do banner da loja
function initSlider() {
  console.log("Inicializando slider...");
  
  // Verifica se estamos na página da loja e se o slider existe
  const menulojaSlider = document.querySelector('.menuloja-slider');
  if (!menulojaSlider) {
    console.log("Slider não encontrado na página");
    return;
  }
  
  console.log("Slider encontrado, configurando...");
  
  // Adiciona a navegação do slider
  const slides = document.querySelector('.menuloja-slides');
  const slideElements = document.querySelectorAll('.menuloja-slide');
  const slideCount = slideElements.length;
  
  console.log(`Total de slides encontrados: ${slideCount}`);
  
  // Cria os botões de navegação
  const navContainer = document.createElement('div');
  navContainer.className = 'menuloja-navigation';
  
  for (let i = 0; i < slideCount; i++) {
    const navBtn = document.createElement('div');
    navBtn.className = 'menuloja-nav-btn' + (i === 0 ? ' active' : '');
    navBtn.dataset.slide = i;
    navBtn.addEventListener('click', () => goToSlide(i));
    navContainer.appendChild(navBtn);
  }
  
  menulojaSlider.appendChild(navContainer);
  
  // Variáveis para controlar o slider
  let currentSlide = 0;
  let slideInterval;
  
  // Função para ir para um slide específico
  function goToSlide(index) {
    // Atualiza o slide atual
    currentSlide = index;
    
    // Atualiza os botões de navegação
    document.querySelectorAll('.menuloja-nav-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === currentSlide);
    });
    
    // Move para o slide correspondente
    slides.style.transform = `translateX(-${currentSlide * 25}%)`;
    console.log(`Navegando para o slide ${currentSlide + 1}`);
  }
  
  // Função para avançar para o próximo slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    goToSlide(currentSlide);
  }
  
  // Inicia a transição automática do slider
  function startSlideInterval() {
    // Limpa intervalo anterior, se existir
    if (slideInterval) {
      clearInterval(slideInterval);
    }
    
    // Define novo intervalo para avançar slides automaticamente a cada 5 segundos
    slideInterval = setInterval(nextSlide, 5000);
    console.log("Iniciando transição automática do slider");
  }
  
  // Pausa a transição quando o cursor estiver sobre o slider
  menulojaSlider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
    console.log("Pausando transição automática");
  });
  
  // Reinicia a transição quando o cursor sair do slider
  menulojaSlider.addEventListener('mouseleave', () => {
    startSlideInterval();
    console.log("Retomando transição automática");
  });
  
  // Inicia a transição automática
  startSlideInterval();
  
  // Força a verificação inicial
  goToSlide(0);
}

// Modificação da função loadPage para chamar initSlider após carregar a página
function loadPage(path) {
    const contentDiv = document.getElementById("content");
    const page = routes[path] || routes["/"];  // se não encontrar nada, carrega a home

    fetch(page)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            history.pushState({}, "", path); // atualiza a url sem recarregar
            
            // Inicializa o slider se estivermos na página da loja
            console.log(`Página carregada: ${path}`);
            setTimeout(initSlider, 100); // Adicionado pequeno timeout para garantir que o DOM esteja pronto
        })
        .catch(error => console.error("Erro ao carregar a página:", error));
}

// Resto do código original...
const routes = {
    "/": "Rotas/home.html",
    "/historia": "Rotas/historia.html",
    "/loja": "Rotas/loja.html",
    "/musica": "Rotas/musica.html",
    "/eventos": "Rotas/evento.html",
    "/contato": "Rotas/contato.html",
};

function navigate(event, path) {
    event.preventDefault(); 
    loadPage(path);
}

// Inicializa a aplicação
window.onpopstate = () => loadPage(window.location.pathname);
document.addEventListener("DOMContentLoaded", () => loadPage(window.location.pathname));

// Função de pesquisa (mantida do código original)
async function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById("search-input").value.toLowerCase();
    const contentDiv = document.getElementById("content");

    const resultados = [];

    for (const [path, file] of Object.entries(routes)) {
        try {
            const response = await fetch(file);
            const html = await response.text();

            if (html.toLowerCase().includes(query)) {
                const trecho = getSnippet(html, query);
                resultados.push({ path, trecho });
            }
        } catch (err) {
            console.error(`Erro ao buscar em ${file}:`, err);
        }
    }

    if (resultados.length > 0) {
        contentDiv.innerHTML = `
            <h2>Resultados da busca:</h2>
            <ul>
                ${resultados.map(r => `
                    <li>
                        <a href="${r.path}" onclick="navigate(event, '${r.path}')">${r.path}</a><br>
                        <small>${r.trecho}</small>
                    </li>
                `).join("")}
            </ul>
        `;
    } else {
        contentDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    }
}

function getSnippet(html, query) {
    const text = html.replace(/<[^>]+>/g, ""); // remove tags HTML
    const index = text.toLowerCase().indexOf(query);

    if (index === -1) return "";

    const start = Math.max(0, index - 40);
    const end = Math.min(text.length, index + query.length + 40);
    return "..." + text.slice(start, end).trim() + "...";
}