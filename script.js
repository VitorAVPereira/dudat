async function loadComponent(containerId, filename) {
    try {
        const response = await fetch(filename);
        if (response.ok) {
            const htmlContent = await response.text();
            document.getElementById(containerId).innerHTML = htmlContent;
        } else {
            console.error('Erro ao carregar ' + filename);
        }
    } catch (error) {
        console.error('Erro de conexão ao tentar carregar ' + filename, error);
    }
}

// 2. QUANDO A PÁGINA CARREGAR:
window.addEventListener('DOMContentLoaded', async () => {
    // CHAMA A TELA DE CARREGAMENTO IMEDIATAMENTE
    initSplashScreen();

    // Usamos o Promise.all para carregar todas as seções ao mesmo tempo e ESPERAR todas terminarem
    await Promise.all([
        loadComponent('home-container', 'home.html'),
        loadComponent('about-container', 'about.html'),
        loadComponent('services-container', 'services.html'),
        loadComponent('why-us-container', 'why-us.html'),
        loadComponent('results-container', 'results.html'),
        loadComponent('contact-container', 'contact.html')
    ]);

    // Só depois de todo o HTML existir na tela, nós ligamos os scripts:
    initRotatingText();
    initFadeUp();
    initServiceSliders();
});

// 3. O código do menu que muda de cor ao rolar a página
window.addEventListener('scroll', function () {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 4. Lógica da Janela Flutuante (Modal de Agendamento)
setTimeout(() => {
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-btn');
    const bookingButtons = document.querySelectorAll('.btn-primary');

    if (modal && closeBtn) {
        bookingButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                modal.style.display = 'flex';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}, 500);

// --- 5. FUNÇÃO DO CARROSSEL (Fica guardada aqui e é chamada apenas após a Home carregar) ---
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.card'));
    const nextButton = document.querySelector('.nav-arrow.right');
    const prevButton = document.querySelector('.nav-arrow.left');
    const dots = Array.from(document.querySelectorAll('.dot'));

    if (track) {
        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;
        let currentTranslate = 0;
        let prevTranslate = 0;

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, index) => {
                if (index === currentIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });

            if (currentIndex === 0) prevButton.classList.add('hidden');
            else prevButton.classList.remove('hidden');

            if (currentIndex === cards.length - 1) nextButton.classList.add('hidden');
            else nextButton.classList.remove('hidden');
        }

        nextButton.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        track.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            isDragging = true;
            const style = window.getComputedStyle(track);
            const matrix = new WebKitCSSMatrix(style.transform);
            prevTranslate = matrix.m41;
            track.style.transition = 'none';
        });

        track.addEventListener('touchmove', (event) => {
            if (!isDragging) return;
            const currentPosition = event.touches[0].clientX;
            const diff = currentPosition - startX;

            if ((currentIndex === 0 && diff > 0) || (currentIndex === cards.length - 1 && diff < 0)) {
                currentTranslate = prevTranslate + (diff * 0.2);
            } else {
                currentTranslate = prevTranslate + diff;
            }

            track.style.transform = `translateX(${currentTranslate}px)`;
        });

        track.addEventListener('touchend', (event) => {
            isDragging = false;
            track.style.transition = 'transform 0.3s ease-out';
            const endX = event.changedTouches[0].clientX;
            const diff = endX - startX;

            if (diff < -50 && currentIndex < cards.length - 1) {
                currentIndex++;
            } else if (diff > 50 && currentIndex > 0) {
                currentIndex--;
            }

            updateCarousel();
        });

        updateCarousel(); // Realinha no primeiro load
    }
}

// --- 6. Lógica do Menu Mobile (Hambúrguer) ---
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

// Se o botão existir na tela, ativamos a lógica
if (menuToggle && navList) {

    // 1. Abre/Fecha o menu ao clicar no botão hambúrguer
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active'); // Faz o botão virar X ou voltar ao normal
        navList.classList.toggle('active');   // Abre ou fecha a gaveta de links
    });

    // 2. Fecha o menu automaticamente se o usuário clicar em um dos links
    const navLinks = document.querySelectorAll('#nav-list li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
        });
    });
}

// --- 7. Função do Texto Rotativo ---
function initRotatingText() {
    const textElement = document.querySelector('.rotating-text');
    if (!textElement) return;

    // As palavras que vão ficar alternando
    const words = ['Connect.', 'Convert.', 'Grow.', 'Last.'];
    let currentIndex = 0;

    // Roda a cada 3 segundos (3000 milissegundos)
    setInterval(() => {
        textElement.classList.add('hide'); // 1. Esconde a palavra atual

        // 2. Espera meio segundo (tempo da animação do CSS) para trocar o texto
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % words.length;
            textElement.textContent = words[currentIndex];
            textElement.classList.remove('hide'); // 3. Mostra a palavra nova
        }, 500);
    }, 3000);
}


// --- 8. Função das Animações (Fade Up e Slide Right) ---
function initFadeUp() {
    // 1. Elementos que sobem (resto do site)
    const fadeUpElements = document.querySelectorAll('.section-header, .service-card, .result-card, .why-card, .contact-content');
    fadeUpElements.forEach(el => el.classList.add('fade-up'));

    // 2. Prepara os elementos da Home que vem da direita (mas NÃO anima ainda)
    const slideRightElements = document.querySelectorAll('.hero-images-stacked, .image-info, .about-title');
    slideRightElements.forEach(el => el.classList.add('slide-in-right'));

    // 3. Criamos o "Observador" APENAS para os que sobem conforme rolamos a página
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // 4. Mandamos o observador olhar APENAS para o fade-up
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));
}

// --- 9. Função do Slider de Serviços (Crossfade) ---
function initServiceSliders() {
    // 1. Pega todas as caixinhas de imagem dos serviços
    const serviceImages = document.querySelectorAll('.service-image');

    // 2. Para cada cartão de serviço, vamos criar uma rotina
    serviceImages.forEach(container => {
        const slides = container.querySelectorAll('.service-slide');

        // Se tiver menos de 2 fotos, não precisa animar
        if (slides.length <= 1) return;

        let currentSlide = 0;

        // Roda a cada 4 segundos (4000 milissegundos)
        setInterval(() => {
            // Esconde a foto atual tirando a classe 'active'
            slides[currentSlide].classList.remove('active');

            // Pula para a próxima foto (o % faz voltar para o zero se chegar na última foto)
            currentSlide = (currentSlide + 1) % slides.length;

            // Mostra a nova foto
            slides[currentSlide].classList.add('active');
        }, 4000);
    });
}

// --- 10. Função da Tela de Carregamento (Splash Screen) ---
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const progressNumber = document.getElementById('progress-number');

    if (!splashScreen || !progressNumber) return;

    let progress = 0;
    const intervalTime = 12;

    document.body.style.overflow = 'hidden';

    const counter = setInterval(() => {
        progress += 1;
        progressNumber.textContent = progress;

        if (progress >= 100) {
            clearInterval(counter);

            setTimeout(() => {
                // Esconde a tela de Splash
                splashScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
                window.scrollTo(0, 0);

                // A MÁGICA ESTÁ AQUI: Dispara a animação da Home 0.1s depois que a tela clarear!
                setTimeout(() => {
                    const slideRightElements = document.querySelectorAll('.slide-in-right');
                    slideRightElements.forEach(el => el.classList.add('visible'));
                }, 100);

            }, 200);
        }
    }, intervalTime);
}