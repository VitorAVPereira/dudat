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
