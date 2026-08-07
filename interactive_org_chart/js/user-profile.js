/**
 * KLC2 User Profile Dynamic Token Obtainer & Profile Fetcher
 * Alur Kerja:
 * 1. Default (saat belum login & token tidak ada): Nama "Peserta", Role "Pegawai DJBC", Avatar Inisial "P"
 * 2. Mengambil authorization token langsung dari https://klc2.kemenkeu.go.id/res/lms/course_category
 * 3. Menyimpan token ke localStorage ('klc_token')
 * 4. Menggunakan token untuk fetch profil dari https://klc2.kemenkeu.go.id/res/user/principal/me/profile
 */

window.UserProfile = {
    tokenCategoryUrl: 'https://klc2.kemenkeu.go.id/res/lms/course_category',
    apiUrl: 'https://klc2.kemenkeu.go.id/res/user/principal/me/profile',
    pollIntervalMs: 30000, // 30 seconds interval
    pollTimer: null,

    // Default profile saat peserta belum login / authorization token tidak tersedia
    fallbackProfile: {
        name: 'Peserta',
        role: 'Pegawai DJBC',
        avatarUrl: '', // Kosong agar avatar inisial huruf "P" ditampilkan
        nip: '-',
        email: '-'
    },
    isAuthenticated: false,
    currentUser: null,

    async init() {
        // 1. Tampilkan profile tersimpan / fallback "Peserta" - "Pegawai DJBC" - Inisial "P"
        const savedProfile = this.getSavedProfile();
        if (savedProfile && savedProfile.name && savedProfile.name !== 'Peserta') {
            this.render(savedProfile);
        } else {
            this.render(this.fallbackProfile);
        }

        // 2. Periksa URL Parameters terlebih dahulu jika token disisipkan langsung
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token') || urlParams.get('access_token');
        if (urlToken) {
            this.saveToken(urlToken);
        }

        // 3. Mengambil authorization token langsung dari https://klc2.kemenkeu.go.id/res/lms/course_category
        const token = await this.obtainTokenFromKLC2();

        // 4. Jika token tersedia, fetch profil dari API KLC2
        if (token) {
            const success = await this.fetchProfile(token);
            if (!success && !savedProfile) {
                this.render(this.fallbackProfile);
            }
        } else {
            // Jika token tidak tersedia, tetap gunakan default Peserta, Pegawai DJBC, Inisial "P"
            this.render(this.fallbackProfile);
        }

        // 5. Pasang listener navigasi & polling 30 detik
        this.setupNavigationListeners();
        this.start30SecPolling();
    },

    /**
     * Langkah 1 & 2: Mengambil authorization token dari https://klc2.kemenkeu.go.id/res/lms/course_category & menyimpannya
     */
    async obtainTokenFromKLC2() {
        try {
            console.log('[UserProfile] Fetching authorization token dari https://klc2.kemenkeu.go.id/res/lms/course_category...');

            // Request GET ke https://klc2.kemenkeu.go.id/res/lms/course_category dengan credentials: 'include'
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);

            const res = await fetch(this.tokenCategoryUrl, {
                method: 'GET',
                credentials: 'include',
                headers: { 
                    'Accept': 'application/json, text/plain, */*',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                // Ekstrak token dari Authorization Header / X-Auth-Token jika tersedia
                const authHeader = res.headers.get('Authorization') || res.headers.get('X-Auth-Token') || res.headers.get('token');
                if (authHeader) {
                    const cleanToken = authHeader.replace(/^Bearer\s+/i, '').trim();
                    this.saveToken(cleanToken);
                    return cleanToken;
                }

                try {
                    const json = await res.json();
                    const token = json.token || json.access_token || json.data?.token || json.data?.access_token || json.payload?.token;
                    if (token) {
                        this.saveToken(token);
                        return token;
                    }
                } catch (e) {}
            }

            // Ekstrak token dari Cookie browser (klc_token / access_token / SESSION)
            const cookieToken = this.getCookie('klc_token') || this.getCookie('access_token') || this.getCookie('token');
            if (cookieToken) {
                this.saveToken(cookieToken);
                return cookieToken;
            }
        } catch (e) {
            console.log('[UserProfile] Catatan pengambilan token dari course_category:', e.message);
        }

        return this.getStoredToken();
    },

    saveToken(token) {
        if (!token) return;
        try {
            localStorage.setItem('klc_token', token);
            sessionStorage.setItem('klc_token', token);
            console.log('[UserProfile] Authorization token berhasil disimpan ke storage.');
        } catch (e) {}
    },

    getStoredToken() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get('token') || urlParams.get('access_token');
            if (urlToken) {
                this.saveToken(urlToken);
                return urlToken;
            }

            return localStorage.getItem('klc_token') || 
                   sessionStorage.getItem('klc_token') || 
                   localStorage.getItem('access_token') || '';
        } catch (e) {
            return '';
        }
    },

    getCookie(name) {
        try {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            if (match) return decodeURIComponent(match[2]);
        } catch(e) {}
        return '';
    },

    /**
     * Langkah 3: Menggunakan token untuk fetch data profil user dari https://klc2.kemenkeu.go.id/res/user/principal/me/profile
     */
    async fetchProfile(token = '') {
        try {
            const activeToken = token || this.getStoredToken();
            if (!activeToken) {
                this.render(this.fallbackProfile);
                return false;
            }

            console.log('[UserProfile] Fetching profile data menggunakan token...');

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const headers = { 'Accept': 'application/json' };
            if (activeToken) {
                headers['Authorization'] = activeToken.startsWith('Bearer') ? activeToken : `Bearer ${activeToken}`;
            }

            const response = await fetch(this.apiUrl, {
                method: 'GET',
                credentials: 'include',
                headers: headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const json = await response.json();
                const profile = this.parseProfileData(json);
                if (profile && profile.name) {
                    this.saveProfileToStorage(profile);
                    this.render(profile);
                    return true;
                }
            }
        } catch (err) {
            console.log('[UserProfile] Response fetch profile note:', err.message);
        }
        return false;
    },

    parseProfileData(json) {
        if (!json) return null;
        const data = json.data || json.payload || json.principal || json.user || json;
        if (!data) return null;

        // Extract User Name: "name" and Photo: "image_url" from server response JSON
        let userName = data.name || data.fullName || data.full_name || data.nama || 'Peserta';
        let userPhoto = data.image_url || data.avatar || data.avatarUrl || data.avatar_url || data.photo || '';
        let role = data.role || data.unit || data.jabatan || (data.nip ? `NIP: ${data.nip}` : 'Pegawai DJBC');

        return {
            name: userName,
            avatarUrl: userPhoto,
            role: role,
            email: data.email || '-',
            nip: data.nip || data.preferred_username || '-'
        };
    },

    saveProfileToStorage(profile) {
        try {
            if (!profile) return;
            this.isAuthenticated = true;
            this.currentUser = profile;
            localStorage.setItem('klc_user_profile', JSON.stringify(profile));
        } catch (e) {}
    },

    getSavedProfile() {
        try {
            const str = localStorage.getItem('klc_user_profile');
            if (str) return JSON.parse(str);
        } catch (e) {}
        return null;
    },

    setupNavigationListeners() {
        window.addEventListener('hashchange', () => this.fetchProfile());
        window.addEventListener('popstate', () => this.fetchProfile());
        window.addEventListener('pageshow', () => this.fetchProfile());
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') this.fetchProfile();
        });
    },

    start30SecPolling() {
        if (this.pollTimer) clearInterval(this.pollTimer);
        this.pollTimer = setInterval(() => this.fetchProfile(), this.pollIntervalMs);
    },

    render(profile) {
        const user = profile || this.fallbackProfile;

        const profileWidgets = document.querySelectorAll('#user-profile-widget, .user-profile-widget');
        profileWidgets.forEach(w => {
            w.classList.remove('hidden');
            w.style.display = 'inline-flex';
            w.style.cursor = 'pointer';
            w.onclick = () => this.showProfileDetailModal(user);
        });

        const nameEls = document.querySelectorAll('#user-display-name, .user-display-name');
        const roleEls = document.querySelectorAll('#user-display-role, .user-display-role');
        const imgEls = document.querySelectorAll('#user-avatar-img, .user-avatar-img');
        const placeholderEls = document.querySelectorAll('#user-avatar-placeholder, .user-avatar-placeholder');
        const initialsEls = document.querySelectorAll('#user-avatar-initials, .user-avatar-initials');

        // Initial letter calculation: "Peserta" -> "P"
        let initials = 'P';
        if (user.name) {
            const parts = user.name.trim().split(' ').filter(Boolean);
            if (parts.length >= 2) {
                initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else if (parts.length === 1 && parts[0].length > 0) {
                initials = parts[0].substring(0, 2).toUpperCase();
            }
        }

        // Render User Name & Role ("Peserta" & "Pegawai DJBC")
        nameEls.forEach(el => { el.textContent = user.name || 'Peserta'; });
        roleEls.forEach(el => { el.textContent = user.role || 'Pegawai DJBC'; });
        initialsEls.forEach(el => { el.textContent = initials; });

        // Render User Photo or Default Avatar Placeholder (Initial P)
        if (user.avatarUrl) {
            imgEls.forEach(img => {
                img.src = user.avatarUrl;
                img.classList.remove('hidden');
                img.onerror = () => {
                    img.classList.add('hidden');
                    placeholderEls.forEach(p => {
                        p.classList.remove('hidden');
                        p.style.display = 'flex';
                    });
                };
            });
            placeholderEls.forEach(p => p.classList.add('hidden'));
        } else {
            // Unauthenticated state: show avatar placeholder with initial "P"
            imgEls.forEach(img => img.classList.add('hidden'));
            placeholderEls.forEach(p => {
                p.classList.remove('hidden');
                p.style.display = 'flex';
            });
        }
    },

    showProfileDetailModal(profile) {
        let modal = document.getElementById('klc-user-profile-detail-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'klc-user-profile-detail-modal';
            modal.className = 'fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[999999] p-4 hidden';
            document.body.appendChild(modal);
        }

        const user = profile || this.fallbackProfile;

        modal.innerHTML = `
            <div class="bg-[#0D2137] border border-[#F5A623] rounded-2xl p-6 max-w-sm w-full text-white shadow-2xl relative">
                <button id="close-user-profile-detail-modal" class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold p-1">&times;</button>
                <div class="flex flex-col items-center text-center">
                    <div class="w-20 h-20 rounded-full border-2 border-[#F5A623] overflow-hidden mb-3 shadow-lg bg-[#1A4B8C] flex items-center justify-center">
                        ${user.avatarUrl ? `<img src="${user.avatarUrl}" class="w-full h-full object-cover">` : `<span class="text-2xl font-bold text-[#F5A623]">${(user.name || 'P').substring(0, 2).toUpperCase()}</span>`}
                    </div>
                    <h3 class="text-lg font-bold text-white mb-0.5">${user.name}</h3>
                    <p class="text-xs text-[#FFC94A] font-medium mb-3">${user.role}</p>

                    ${user.nip && user.nip !== '-' ? `<div class="bg-white/5 w-full py-1.5 px-3 rounded-lg text-xs text-gray-300 mb-2 border border-white/10">NIP: ${user.nip}</div>` : ''}
                    ${user.email && user.email !== '-' ? `<div class="bg-white/5 w-full py-1.5 px-3 rounded-lg text-xs text-gray-300 mb-4 border border-white/10">${user.email}</div>` : ''}
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        document.getElementById('close-user-profile-detail-modal').onclick = () => {
            modal.classList.add('hidden');
        };
    }
};

// Listen for PostMessage from Parent Window (e.g. if embedded in KLC2 Iframe)
window.addEventListener('message', (event) => {
    if (event.data && (event.data.token || event.data.type === 'KLC_AUTH_TOKEN')) {
        const token = event.data.token || event.data.payload;
        if (token) {
            window.UserProfile.saveToken(token);
            window.UserProfile.init();
        }
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.UserProfile.init());
} else {
    window.UserProfile.init();
}
