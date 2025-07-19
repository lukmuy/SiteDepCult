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
    const page = routes[path] || routes["/"]; // se não encontrar nada, carrega a home

    // Adiciona classe de loading
    contentDiv.classList.add('loading');

    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Limpa o conteúdo anterior
            contentDiv.innerHTML = '';
            
            // Adiciona o novo conteúdo
            contentDiv.innerHTML = html;
            
            // Remove classe de loading
            contentDiv.classList.remove('loading');
            
            // Atualiza a URL sem recarregar
            history.pushState({}, "", path);
            
            // Rola para o topo da página
            window.scrollTo(0, 0);
            
            console.log(`Página carregada: ${path}`);
            
            // Inicializa funcionalidades específicas de cada página
            setTimeout(() => {
                if (path === "/loja") {
                    initSlider();
                } else if (path === "/historia") {
                    initHistoria();
                }
            }, 100);
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
            contentDiv.classList.remove('loading');
        });
}

// Função de navegação
function navigate(event, path) {
    event.preventDefault();
    loadPage(path);
}

// Função para inicializar o slider do banner da loja
function initSlider() {
    console.log("Inicializando slider...");
    
    const menulojaSlider = document.querySelector('.menuloja-slider');
    if (!menulojaSlider) {
        console.log("Slider não encontrado na página");
        return;
    }
    
    console.log("Slider encontrado, configurando...");
    
    const slides = document.querySelector('.menuloja-slides');
    const slideElements = document.querySelectorAll('.menuloja-slide');
    const slideCount = slideElements.length;
    
    console.log(`Total de slides encontrados: ${slideCount}`);
    
    // Remove navegação existente se houver
    const existingNav = menulojaSlider.querySelector('.menuloja-navigation');
    if (existingNav) {
        existingNav.remove();
    }
    
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
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Função para ir para um slide específico
    function goToSlide(index) {
        currentSlide = index;
        
        document.querySelectorAll('.menuloja-nav-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === currentSlide);
        });
        
        slides.style.transform = `translateX(-${currentSlide * 25}%)`;
        console.log(`Navegando para o slide ${currentSlide + 1}`);
    }
    
    // Função para avançar para o próximo slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }
    
    // Função para voltar ao slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }
    
    // Inicia a transição automática do slider
    function startSlideInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
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
    
    // Suporte para touch/swipe em dispositivos móveis
    menulojaSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(slideInterval);
    }, { passive: true });
    
    menulojaSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlideInterval();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe para esquerda
            } else {
                prevSlide(); // Swipe para direita
            }
        }
    }
    
    // Inicia a transição automática
    startSlideInterval();
    
    // Força a verificação inicial
    goToSlide(0);
}

// Função para inicializar a página de história
function initHistoria() {
    console.log("Inicializando página de história...");
    
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const countUp = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(countUp, 10);
            } else {
                counter.innerText = target + '+';
            }
        });
    };

    // Trigger counter on scroll
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                countUp();
                observer.disconnect();
            }
        });
        observer.observe(heroSection);
    }

    // Store current filters
    let currentYear = 'all';
    let currentType = 'all';

    // Function to apply both filters
    function applyFilters() {
        const eventCards = document.querySelectorAll('.event-card');
        let visibleIndex = 0;
        
        eventCards.forEach(card => {
            const cardYear = card.getAttribute('data-year');
            const cardType = card.getAttribute('data-type');
            
            // Check if card matches both filters
            const yearMatch = currentYear === 'all' || cardYear === currentYear || cardYear === 'all';
            const typeMatch = currentType === 'all' || cardType === currentType;
            
            if (yearMatch && typeMatch) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                card.style.animationDelay = `${visibleIndex * 0.1}s`;
                visibleIndex++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
    }

    // Year Filter
    const yearBtns = document.querySelectorAll('.year-btn');
    yearBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            yearBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current year
            currentYear = btn.getAttribute('data-year');
            
            // Apply both filters
            applyFilters();
        });
    });

    // Type Filter
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Update active tag
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            // Update current type
            currentType = tag.getAttribute('data-type');
            
            // Apply both filters
            applyFilters();
        });
    });

    // Modal
    const modal = document.getElementById('eventModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeModal = document.querySelector('.close-modal');
    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.event-image');
            const title = card.querySelector('.event-title').textContent;
            const description = card.querySelector('.event-description').textContent;

            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalTitle.textContent = title;
            modalDescription.textContent = description;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Animate cards on scroll
    const animateOnScroll = () => {
        const visibleCards = document.querySelectorAll('.event-card:not(.hidden)');
        visibleCards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            const cardVisible = cardTop < window.innerHeight - 100;
            
            if (cardVisible && !card.classList.contains('animated')) {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
    
    console.log("Página de história inicializada com sucesso!");
}

// Função de pesquisa
async function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById("search-input").value.toLowerCase().trim();
    
    if (!query) {
        alert("Por favor, digite algo para pesquisar.");
        return;
    }
    
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = '<div style="text-align: center; padding: 50px;"><p>Pesquisando...</p></div>';
    
    const resultados = [];

    for (const [path, file] of Object.entries(routes)) {
        try {
            const response = await fetch(file);
            const html = await response.text();

            // Remove tags de script e style para melhor busca
            const cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                 .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

            if (cleanHtml.toLowerCase().includes(query)) {
                const trecho = getSnippet(cleanHtml, query);
                const pageName = getPageName(path);
                resultados.push({ path, trecho, pageName });
            }
        } catch (err) {
            console.error(`Erro ao buscar em ${file}:`, err);
        }
    }

    if (resultados.length > 0) {
        contentDiv.innerHTML = `
            <div style="padding: 20px;">
                <h2>Resultados da busca para: "${query}"</h2>
                <p>${resultados.length} resultado(s) encontrado(s)</p>
                <ul style="list-style: none; padding: 0;">
                    ${resultados.map(r => `
                        <li style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
                            <a href="${r.path}" onclick="navigate(event, '${r.path}')" style="font-size: 18px; font-weight: bold; color: #ff6b00;">
                                ${r.pageName}
                            </a><br>
                            <small style="color: #666;">${r.trecho}</small>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `;
    } else {
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Nenhum resultado encontrado</h2>
                <p>Não encontramos nada para "${query}"</p>
                <a href="/" onclick="navigate(event, '/')">Voltar para Home</a>
            </div>
        `;
    }
}

function getPageName(path) {
    const names = {
        "/": "Home",
        "/historia": "História",
        "/loja": "Loja",
        "/musica": "Música",
        "/eventos": "Eventos",
        "/contato": "Contato"
    };
    return names[path] || "Página";
}

function getSnippet(html, query) {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const index = text.toLowerCase().indexOf(query);

    if (index === -1) return "";

    const start = Math.max(0, index - 60);
    const end = Math.min(text.length, index + query.length + 60);
    let snippet = text.slice(start, end).trim();
    
    // Adiciona reticências se necessário
    if (start > 0) snippet = "..." + snippet;
    if (end < text.length) snippet = snippet + "...";
    
    // Destaca o termo pesquisado
    const regex = new RegExp(`(${query})`, 'gi');
    snippet = snippet.replace(regex, '<strong style="background-color: #ffeb3b;">$1</strong>');
    
    return snippet;
}

// Menu mobile
function initMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    // Cria botão de menu mobile se não existir
    if (!document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '☰';
        menuBtn.style.display = 'none';
        
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('mobile-nav-open');
            menuBtn.innerHTML = nav.classList.contains('mobile-nav-open') ? '✕' : '☰';
        });
        
        header.appendChild(menuBtn);
    }
    
    // Fecha menu ao clicar em um link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('mobile-nav-open');
            document.querySelector('.mobile-menu-btn').innerHTML = '☰';
        });
    });
}

// Detecta mudanças de tamanho da tela
function handleResize() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    // Carrega a página inicial
    loadPage(window.location.pathname);
    
    // Inicializa menu mobile
    initMobileMenu();
    
    // Adiciona listener para redimensionamento
    window.addEventListener('resize', handleResize);
    handleResize(); // Verifica o tamanho inicial
    
    // Adiciona estilos CSS para o menu mobile dinamicamente
    if (!document.querySelector('#mobile-menu-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-menu-styles';
        style.textContent = `
            .loading {
                opacity: 0.5;
                pointer-events: none;
            }
            
            .mobile-menu-btn {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: white;
                font-size: 30px;
                cursor: pointer;
                z-index: 1001;
                padding: 5px;
            }
            
            @media (max-width: 768px) {
                nav {
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 80%;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.95);
                    transition: left 0.3s ease;
                    z-index: 1000;
                    overflow-y: auto;
                    padding-top: 80px;
                }
                
                nav.mobile-nav-open {
                    left: 0;
                }
                
                nav a {
                    display: block;
                    padding: 15px 20px;
                    border-bottom: 1px solid #333;
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Gerencia navegação do histórico do navegador
window.onpopstate = () => loadPage(window.location.pathname);

// Previne comportamento padrão de links externos
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.startsWith('http') && !link.target) {
        const path = new URL(link.href).pathname;
        if (routes[path]) {
            e.preventDefault();
            navigate(e, path);
        }
    }
});