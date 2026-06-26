document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    
    const contents = {
        imagens: document.getElementById('imagens'),
        videos: document.getElementById('videos'),
        explorar: document.getElementById('explorar'),
        curiosidades: document.getElementById('curiosidades')
    };

    function activateTab(tabId) {
        tabs.forEach(btn => btn.classList.remove('active'));
        Object.values(contents).forEach(content => content.classList.remove('active'));

        const activeBtn = Array.from(tabs).find(btn => btn.dataset.tab === tabId);
        if (activeBtn) activeBtn.classList.add('active');

        if (contents[tabId]) contents[tabId].classList.add('active');
    }

    tabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = btn.dataset.tab;
            activateTab(tabId);
        });
    });
});
