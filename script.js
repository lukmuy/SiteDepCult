// Rotas do sistema
const routes = {
    "/": "Rotas/home.html",
    "/historia": "Rotas/historia.html",
    "/loja": "Rotas/loja.html",
    "/musica": "Rotas/musica.html",
    "/eventos": "Rotas/evento.html",
    "/contato": "Rotas/contato.html",
};

// Função para carregar páginas
function loadPage(path) {
    const contentDiv = document.getElementById("content");
    const page = routes[path] || routes["/"];

    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
            history.pushState({}, "", path);
            window.scrollTo(0, 0);
            
            // Inicializa funcionalidades específicas de cada página
            if (path === "/loja") {
                initSlider();
            } else if (path === "/historia") {
                initHistoria();
            }
        })
        .catch(error => {
            console.error("Erro ao carregar a página:", error);
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h2>Erro ao carregar a página</h2>
                    <p>Por favor, tente novamente mais tarde.</p>
                    <a href="/" onclick="navigate(event, '/')">Voltar para Home</a>
                </div>
            `;
        });
}

// Função de navegação
function navigate(event, path) {
    event.preventDefault();
    loadPage(path);
}

// Função para inicializar o slider do banner da loja
function initSlider() {
    const menulojaSlider = document.querySelector('.menuloja-slider');
    if (!menulojaSlider) return;
    
    const slides = document.querySelector('.menuloja-slides');
    const slideElements = document.querySelectorAll('.menuloja-slide');
    const slideCount = slideElements.length;
    
    // Remove navegação existente se houver
    const existingNav = menulojaSlider.querySelector('.menuloja-navigation');
    if (existingNav) {
        existingNav.remove();
    }
    
    // Cria os botões de navegação
    const navContainer = document.createElement('div');
    navContainer.className = 'menuloja-navigation';
    
    for (let i = 0; i < slideCount; i++) {
        const btn = document.createElement('div');
        btn.className = 'menuloja-nav-btn';
        if (i === 0) btn.classList.add('active');
        btn.addEventListener('click', () => goToSlide(i));
        navContainer.appendChild(btn);
    }
    
    menulojaSlider.appendChild(navContainer);
    
    let currentSlide = 0;
    let slideInterval;
    
    function goToSlide(index) {
        currentSlide = index;
        slides.style.transform = `translateX(-${index * 25}%)`;
        
        // Atualiza botões ativos
        document.querySelectorAll('.menuloja-nav-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }
    
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlideInterval() {
        clearInterval(slideInterval);
    }
    
    // Inicia o slider automático
    startSlideInterval();
    
    // Pausa o slider quando o mouse está sobre ele
    menulojaSlider.addEventListener('mouseenter', stopSlideInterval);
    menulojaSlider.addEventListener('mouseleave', startSlideInterval);
    
    // Suporte para touch/swipe
    let startX = 0;
    let endX = 0;
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    menulojaSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    menulojaSlider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
}

// Função para inicializar a página de história
function initHistoria() {
    const counters = document.querySelectorAll('.counter');
    
    const countUp = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(countUp, 20);
            } else {
                counter.innerText = target;
            }
        });
    };
    
    // Inicia a contagem quando a página carrega
    setTimeout(countUp, 500);
    
    // Filtros para a galeria
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    function applyFilters() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (activeFilter === 'all' || itemCategory === activeFilter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });
    
    // Animação de scroll para elementos
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executa uma vez no carregamento
}

// Função de busca
async function handleSearch(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length < 2) {
        alert('Por favor, digite pelo menos 2 caracteres para buscar.');
        return;
    }
    
    const searchResults = [];
    
    // Busca em todas as páginas
    for (const [path, pagePath] of Object.entries(routes)) {
        try {
            const response = await fetch(pagePath);
            const html = await response.text();
            
            const snippets = getSnippet(html, query);
            if (snippets.length > 0) {
                searchResults.push({
                    page: getPageName(path),
                    path: path,
                    snippets: snippets
                });
            }
        } catch (error) {
            console.error(`Erro ao buscar em ${pagePath}:`, error);
        }
    }
    
    displaySearchResults(searchResults, query);
}

function getPageName(path) {
    const pageNames = {
        "/": "Home",
        "/historia": "História",
        "/loja": "Loja",
        "/musica": "Música",
        "/eventos": "Eventos",
        "/contato": "Contato"
    };
    return pageNames[path] || "Página";
}

function getSnippet(html, query) {
    const snippets = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove scripts e estilos
    const scripts = doc.querySelectorAll('script, style');
    scripts.forEach(script => script.remove());
    
    const textContent = doc.body.textContent || '';
    const words = textContent.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
        if (words[i].includes(query)) {
            const start = Math.max(0, i - 5);
            const end = Math.min(words.length, i + 6);
            const snippet = words.slice(start, end).join(' ');
            snippets.push(snippet);
            
            if (snippets.length >= 3) break;
        }
    }
    
    return snippets;
}

function displaySearchResults(results, query) {
    const contentDiv = document.getElementById('content');
    
    if (results.length === 0) {
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Nenhum resultado encontrado</h2>
                <p>Não encontramos resultados para "${query}"</p>
                <a href="/" onclick="navigate(event, '/')">Voltar para Home</a>
            </div>
        `;
        return;
    }
    
    let resultsHTML = `
        <div style="padding: 50px 20px; max-width: 800px; margin: 0 auto;">
            <h2>Resultados da busca para "${query}"</h2>
            <p>Encontramos ${results.length} página(s) com resultados:</p>
    `;
    
    results.forEach(result => {
        resultsHTML += `
            <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h3><a href="#" onclick="navigate(event, '${result.path}')">${result.page}</a></h3>
                <div style="margin-top: 10px;">
        `;
        
        result.snippets.forEach(snippet => {
            resultsHTML += `<p style="color: #666; margin: 5px 0;">...${snippet}...</p>`;
        });
        
        resultsHTML += `
                </div>
            </div>
        `;
    });
    
    resultsHTML += `
        <div style="text-align: center; margin-top: 30px;">
            <a href="/" onclick="navigate(event, '/')" style="background: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voltar para Home</a>
        </div>
    </div>
    `;
    
    contentDiv.innerHTML = resultsHTML;
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carrega a página inicial
    loadPage(window.location.pathname);
    
    // Adiciona listener para o formulário de busca
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // Adiciona listeners para navegação
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('/')) {
            e.preventDefault();
            const path = e.target.getAttribute('href');
            loadPage(path);
        }
    });
    
    // Header dinâmico
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll para baixo
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll para cima
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Fecha menu mobile ao clicar em um link
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
    
    // Redimensionamento da janela
    function handleResize() {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Smooth scroll para links internos
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});