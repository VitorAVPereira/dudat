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

// 2. QUANDO A PÁGINA CARREGAR: (Adicionamos o 'async' aqui para poder usar o 'await')
window.addEventListener('DOMContentLoaded', async () => {
    
    // ATENÇÃO AQUI: Nós usamos o 'await' para o código ESPERAR a Home carregar completamente!
    await loadComponent('home-container', 'home.html');
    
    // Agora que a home já está na tela com certeza, ativamos o carrossel
    initCarousel();

    // As outras páginas podem carregar normalmente
    loadComponent('about-container', 'about.html');
    loadComponent('services-container', 'services.html');
    loadComponent('why-us-container', 'why-us.html');
    loadComponent('results-container', 'results.html');
    loadComponent('portfolio-container', 'portfolio.html');
    loadComponent('contact-container', 'contact.html');
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

    if(modal && closeBtn) {
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