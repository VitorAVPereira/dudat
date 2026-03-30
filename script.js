// 1. Função que busca um arquivo HTML e coloca dentro de um container
async function loadComponent(containerId, filename) {
    try {
        // Faz o pedido (fetch) para buscar o arquivo
        const response = await fetch(filename);

        // Se o arquivo foi encontrado...
        if (response.ok) {
            // Transforma a resposta em texto HTML
            const htmlContent = await response.text();
            // Injeta o HTML dentro da Div que escolhemos no index.html
            document.getElementById(containerId).innerHTML = htmlContent;
        } else {
            console.error('Erro ao carregar ' + filename);
        }
    } catch (error) {
        console.error('Erro de conexão ao tentar carregar ' + filename, error);
    }
}

// 2. Quando a página carregar por completo, nós chamamos a função
window.addEventListener('DOMContentLoaded', () => {
    loadComponent('home-container', 'home.html');
    loadComponent('about-container', 'about.html');
    loadComponent('services-container', 'services.html');
    loadComponent('why-us-container', 'why-us.html');
    loadComponent('results-container', 'results.html');
    loadComponent('portfolio-container', 'portfolio.html');
    loadComponent('contact-container', 'contact.html');
});

// 3. O código do menu que muda de cor ao rolar a página (mantido)
window.addEventListener('scroll', function () {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

setTimeout(() => {
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Pega todos os botões do site que tenham a classe 'btn-primary'
    const bookingButtons = document.querySelectorAll('.btn-primary');

    // Para cada botão que encontramos, adicionamos o evento de clique
    bookingButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Impede que o botão tente mudar de página
            modal.style.display = 'flex'; // Mostra a janela
        });
    });

    // Quando clica no X, esconde a janela
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Quando clica na área escura fora da caixa branca, também esconde a janela
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

}, 500); // 500 milissegundos de atraso

// --- 5. Lógica do Carrossel Instagram ---
const track = document.querySelector('.carousel-track');
const cards = Array.from(document.querySelectorAll('.card'));
const nextButton = document.querySelector('.nav-arrow.right');
const prevButton = document.querySelector('.nav-arrow.left');
const dots = Array.from(document.querySelectorAll('.dot'));

// Se existir um carrossel na tela atual, a lógica acontece
if (track) {
    let currentIndex = 0;

    // Variáveis para detectar o arrastar do dedo no celular
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Função que atualiza o visual (Muda a foto, acende a bolinha e esconde setas)
    function updateCarousel() {
        // Move o trilho horizontalmente (ex: -100%, -200%)
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Atualiza os pontinhos
        dots.forEach((dot, index) => {
            if (index === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });

        // Mostra ou esconde setas nos limites
        if (currentIndex === 0) prevButton.classList.add('hidden');
        else prevButton.classList.remove('hidden');

        if (currentIndex === cards.length - 1) nextButton.classList.add('hidden');
        else nextButton.classList.remove('hidden');
    }

    // --- Cliques nas Setas ---
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

    // --- Lógica de Swipe (Toque e Arraste no Celular) ---
    track.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX; // Grava onde o dedo encostou
        isDragging = true;

        // Pega a posição exata do CSS no momento do toque
        const style = window.getComputedStyle(track);
        const matrix = new WebKitCSSMatrix(style.transform);
        prevTranslate = matrix.m41;

        track.style.transition = 'none'; // Desliga a animação suave para o dedo arrastar rápido
    });

    track.addEventListener('touchmove', (event) => {
        if (!isDragging) return;
        const currentPosition = event.touches[0].clientX;
        const diff = currentPosition - startX; // Calcula o quanto o dedo andou

        // Aplica uma "resistência" se o usuário tentar arrastar antes da foto 1 ou depois da última
        if ((currentIndex === 0 && diff > 0) || (currentIndex === cards.length - 1 && diff < 0)) {
            currentTranslate = prevTranslate + (diff * 0.2);
        } else {
            currentTranslate = prevTranslate + diff;
        }

        track.style.transform = `translateX(${currentTranslate}px)`;
    });

    track.addEventListener('touchend', (event) => {
        isDragging = false;
        track.style.transition = 'transform 0.3s ease-out'; // Religa a animação suave

        const endX = event.changedTouches[0].clientX;
        const diff = endX - startX;

        // Se arrastou mais de 50 pixels para o lado, avança ou recua a foto
        if (diff < -50 && currentIndex < cards.length - 1) {
            currentIndex++;
        } else if (diff > 50 && currentIndex > 0) {
            currentIndex--;
        }

        updateCarousel(); // Realinha as fotos perfeitamente
    });

    // Chama a função logo que a página carrega para arrumar o estado inicial
    updateCarousel();
}