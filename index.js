// 当整个页面加载完毕后执行
document.addEventListener('DOMContentLoaded', () => {

    // 1. 获取所有的链接卡片元素
    const linkCards = document.querySelectorAll('.link-card');

    // 2. 遍历每一个卡片
    linkCards.forEach(card => {
        // 3. 从卡片的 href 属性中获取目标网站的 URL
        const url = new URL(card.href);
        const domain = url.hostname; // 提取出域名，例如 "www.github.com"

        // 4. 构建获取图标的 API 地址
        // 我们使用 Google 的免费服务，它很稳定。sz=64 表示我们想要 64x64 像素的图标
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;

        // 5. 在卡片中找到图标元素
        const iconDiv = card.querySelector('.icon');

        // 6. 将获取到的图标 URL 设置为图标元素的背景图片
        if (iconDiv) {
            iconDiv.style.backgroundImage = `url(${faviconUrl})`;
        }
    });

});