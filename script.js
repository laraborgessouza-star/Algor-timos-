document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões das abas
    const tabs = document.querySelectorAll('.tab-btn');
    
    // Mapeia os conteúdos pelo ID
    const contents = {
        imagens: document.getElementById('imagens'),
        videos: document.getElementById('videos'),
        explorar: document.getElementById('explorar')
    };

    // Função para ativar uma aba específica
    function activateTab(tabId) {
        // Remove a classe 'active' de todos os botões e conteúdos
        tabs.forEach(btn => btn.classList.remove('active'));
        Object.values(contents).forEach(content => content.classList.remove('active'));

        // Adiciona 'active' ao botão correspondente
        const activeBtn = Array.from(tabs).find(btn => btn.dataset.tab === tabId);
        if (activeBtn) activeBtn.classList.add('active');

        // Adiciona 'active' ao conteúdo correspondente
        if (contents[tabId]) contents[tabId].classList.add('active');
    }

    // Adiciona evento de clique em cada botão
    tabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = btn.dataset.tab;
            activateTab(tabId);
        });
    });

    // (Opcional) A primeira aba já está ativa pelo HTML, mas garantimos o estado
    // Caso queira, pode definir uma aba padrão:
    // activateTab('imagens');
});
