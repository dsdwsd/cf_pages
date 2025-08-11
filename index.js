document.addEventListener('DOMContentLoaded', () => {
    const linkGrid = document.getElementById('link-grid');
    const addLinkForm = document.getElementById('add-link-form');
    const linkNameInput = document.getElementById('link-name');
    const linkUrlInput = document.getElementById('link-url');

    /**
     * 从后端 API 加载链接并渲染到页面
     */
    async function loadLinksFromServer() {
        try {
            // 使用 fetch 调用我们的 Worker API
            const response = await fetch('/api/links');
            if (!response.ok) throw new Error('Failed to fetch links');
            const links = await response.json();

            // 渲染页面
            renderLinks(links);
        } catch (error) {
            console.error('Error loading links:', error);
            linkGrid.innerHTML = '<p style="color: red;">无法加载链接，请检查后端服务是否正常。</p>';
        }
    }

    /**
     * 将链接数据渲染成卡片
     * @param {Array} links - 从 API 获取的链接数组
     */
    function renderLinks(links) {
        linkGrid.innerHTML = '';
        links.forEach(link => {
            const card = createLinkCard(link);
            linkGrid.appendChild(card);
        });
    }

    // 创建卡片的函数和之前一样
    function createLinkCard(link) {
        const card = document.createElement('a');
        card.href = link.url;
        card.target = '_blank';
        card.className = 'link-card';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        const domain = new URL(link.url).hostname;
        iconDiv.style.backgroundImage = `url(https://icons.duckduckgo.com/ip3/${domain}.ico)`;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = link.name;

        card.appendChild(iconDiv);
        card.appendChild(nameSpan);
        return card;
    }

    /**
     * 处理表单提交，将新链接发送到后端 API
     */
    async function handleAddLink(event) {
        event.preventDefault();
        const name = linkNameInput.value.trim();
        const url = linkUrlInput.value.trim();

        if (name && url) {
            try {
                const response = await fetch('/api/links', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, url }),
                });

                if (!response.ok) throw new Error('Failed to add link');

                // 添加成功后，清空输入框并重新从服务器加载所有链接
                addLinkForm.reset();
                loadLinksFromServer();
            } catch (error) {
                console.error('Error adding link:', error);
                alert('添加失败，请重试。');
            }
        }
    }

    // 添加事件监听
    addLinkForm.addEventListener('submit', handleAddLink);

    // 页面加载时，自动从服务器获取数据
    loadLinksFromServer();
});