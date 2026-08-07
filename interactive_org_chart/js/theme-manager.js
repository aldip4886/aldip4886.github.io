/**
 * Theme Manager for Tailwind CSS v3 (Light Mode Default & Switcher)
 * Stores preference in localStorage ('app_theme')
 * Default theme: 'light' (Dominasi warna putih elegan)
 */

window.ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('app_theme') || 'light';
        this.setTheme(savedTheme);
        this.bindEvents();
    },

    setTheme(theme) {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
            localStorage.setItem('app_theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('app_theme', 'light');
        }
        this.updateToggleIcon(theme);
    },

    toggleTheme() {
        const currentTheme = localStorage.getItem('app_theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    updateToggleIcon(theme) {
        const toggleBtns = document.querySelectorAll('#theme-toggle-btn, .theme-toggle-btn');
        toggleBtns.forEach(btn => {
            if (theme === 'light') {
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-700">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                `;
                btn.title = "Ganti ke Tema Gelap (Dark Mode)";
            } else {
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                `;
                btn.title = "Ganti ke Tema Terang (Light Mode)";
            }
        });
    },

    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            const toggleBtns = document.querySelectorAll('#theme-toggle-btn, .theme-toggle-btn');
            toggleBtns.forEach(btn => {
                btn.onclick = () => this.toggleTheme();
            });
            this.updateToggleIcon(localStorage.getItem('app_theme') || 'light');
        });
    }
};

window.ThemeManager.init();
