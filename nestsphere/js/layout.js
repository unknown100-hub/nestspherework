const here = location.pathname.split('/').pop() || 'index.html';
const link = (href, label) =>
  `<a href="${href}" class="${here === href ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'} transition-colors">${label}</a>`;
const links = link('index.html','Home') + link('index.html#about','About Us') + link('login.html','Login') + link('register.html','Register');

document.getElementById('site-header').innerHTML = `
<header class="w-full bg-white/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
    <a href="index.html" class="flex items-center gap-2.5 shrink-0">
      <span class="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center">
        <span class="material-symbols-outlined text-[19px]">real_estate_agent</span></span>
      <span class="font-display text-xl font-bold text-primary whitespace-nowrap">Nest<span class="text-secondary">Sphere</span></span>
    </a>
    <nav class="hidden md:flex items-center gap-7 text-sm font-medium">${links}</nav>
    <div class="flex items-center gap-3">
      <span class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-low border border-outline-variant/20 text-xs text-on-surface-variant">
        <span class="w-2 h-2 rounded-full bg-secondary-container"></span><b class="text-on-surface">KES</b> | Nairobi, KE</span>
      <button id="menu-btn" aria-label="Menu" class="md:hidden p-1.5 rounded-lg hover:bg-surface-container">
        <span class="material-symbols-outlined">menu</span></button>
    </div>
  </div>
  <nav id="mobile-nav" class="hidden md:hidden border-t border-outline-variant/30 px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-white">${links}</nav>
</header>`;

document.getElementById('site-footer').innerHTML = `
<footer class="w-full bg-white/80 border-t border-outline-variant/30 py-4 px-4 sm:px-8">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
    <div class="flex flex-wrap items-center justify-center gap-2">
      <span class="font-medium text-on-surface">© 2026 NestSphere Technologies Ltd.</span>
      <span class="px-2 py-0.5 rounded bg-surface-container">NCA Accredited</span>
      <span class="px-2 py-0.5 rounded bg-surface-container">EARB Registered</span>
      <span class="px-2 py-0.5 rounded bg-surface-container">ArdhiSasah Synchronized</span>
    </div>
    <a href="#" class="text-secondary font-semibold">Diaspora Desk 24/7</a>
  </div>
</footer>`;

document.getElementById('menu-btn').addEventListener('click', () =>
  document.getElementById('mobile-nav').classList.toggle('hidden'));
