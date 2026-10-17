// Playable 试玩案例 — 首页逻辑（静态数据版）
// 平铺渲染全部试玩卡片，点击弹出二维码（手机扫码打开）+ 打开项目按钮。
(function () {
  'use strict';

  const ICON_SVG =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="2" y="6" width="20" height="12" rx="2"/>' +
    '<path d="M6 12h4"/>' +
    '<path d="M8 10v4"/>' +
    '<circle cx="17" cy="10" r="1" fill="currentColor"/>' +
    '<circle cx="15" cy="12" r="1" fill="currentColor"/>' +
    '</svg>';

  // 站点目录基础地址，兼容 GitHub Pages 的 /Playable/ 子路径
  function siteBase() {
    return location.href.replace(/[^/]*$/, '');
  }
  function projectURL(path) {
    return siteBase() + path;
  }

  function createProjectItem(page, index) {
    const item = document.createElement('div');
    item.className = 'project-item has-cover';
    item.setAttribute('data-name', page.name);
    item.setAttribute('data-path', page.path);
    item.setAttribute('data-partner', page.partner || '');
    // 封面图用内联 background-image，相对 index.html 解析，本地与 Pages 都正确
    if (page.cover) {
      item.style.backgroundImage = `url("${page.cover}")`;
    }
    // 交错入场延迟
    item.style.animationDelay = (index * 0.04) + 's';
    item.innerHTML =
      '<div class="card-shimmer"></div>' +
      '<div class="card-icon">' + ICON_SVG + '</div>' +
      '<h3>' + (page.name || '未知页面') + '</h3>';
    return item;
  }

  // 模态弹窗引用
  let modal, modalTitle, modalSub, openProjectBtn, closeBtn, currentProjectPath = '';

  function showModal(title, sub, path) {
    modalTitle.textContent = title;
    modalSub.textContent = sub || '';
    currentProjectPath = path;
    generateQRCode(projectURL(path), 'qrcode');
    modal.style.display = 'block';
  }
  function hideModal() { modal.style.display = 'none'; }
  function openProject() {
    if (currentProjectPath) window.open(currentProjectPath, '_blank');
  }
  function generateQRCode(url, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 150; canvas.height = 150;
    container.appendChild(canvas);
    new QRious({ element: canvas, value: url, size: 150 });
  }

  function render(pages) {
    const container = document.getElementById('pageList');
    container.innerHTML = '';
    if (!pages || pages.length === 0) {
      container.innerHTML = '<div class="no-pages">暂无可用页面</div>';
      return;
    }
    pages.forEach((page, i) => container.appendChild(createProjectItem(page, i)));
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 数据源：js/data.js 提供的 window.PAGES
    const pages = Array.isArray(window.PAGES) ? window.PAGES : [];

    modal = document.getElementById('modal');
    modalTitle = document.getElementById('modal-title');
    modalSub = document.getElementById('modal-sub');
    openProjectBtn = document.getElementById('open-project-btn');
    closeBtn = document.querySelector('.close');

    render(pages);

    document.getElementById('pageList').addEventListener('click', function (e) {
      const el = e.target.closest('.project-item');
      if (!el) return;
      showModal(
        el.getAttribute('data-name'),
        el.getAttribute('data-partner') ? '厂商：' + el.getAttribute('data-partner') : '扫描二维码在手机上打开',
        el.getAttribute('data-path')
      );
    });

    openProjectBtn.addEventListener('click', openProject);
    closeBtn.addEventListener('click', hideModal);
    window.addEventListener('click', function (e) {
      if (e.target === modal) hideModal();
    });
  });
})();
