document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    const contents = {
        imagens: document.getElementById('imagens'),
        videos: document.getElementById('videos'),
        anatomia: document.getElementById('anatomia'),
        fisica: document.getElementById('fisica'),
        curiosidades: document.getElementById('curiosidades')
    };

    function activateTab(tabId) {
        // Remove active de todos os botões
        tabs.forEach(function(btn) {
            btn.classList.remove('active');
        });

        // Remove active de todos os conteúdos
        for (var key in contents) {
            if (contents[key]) {
                contents[key].classList.remove('active');
            }
        }

        // Adiciona active ao botão clicado
        var activeBtn = null;
        tabs.forEach(function(btn) {
            if (btn.dataset.tab === tabId) {
                activeBtn = btn;
            }
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Adiciona active ao conteúdo correspondente
        if (contents[tabId]) {
            contents[tabId].classList.add('active');
        }
    }

    // Adiciona evento de clique em cada botão
    tabs.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var tabId = this.dataset.tab;
            activateTab(tabId);
        });
    });
});
