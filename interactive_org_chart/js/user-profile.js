/**
 * KLC2 User Profile Integration & Avatar Loader
 * Endpoint: https://klc2.kemenkeu.go.id/res/user/principal/me/profile
 * Data mapping:
 * - User Name: "name"
 * - Photo: "image_url"
 */

window.UserProfile = {
    apiUrl: 'https://klc2.kemenkeu.go.id/res/user/principal/me/profile',
    
    defaultProfile: {
        name: 'Aldi Pratama',
        role: 'KLC Kemenkeu',
        avatarUrl: 'https://aset-satu.kemenkeu.go.id/api/photo/GetPhotoUrl/PWwA2WwH4r_vWT536TBkHtl616mVjsaz2Nlndt6dR7g',
        nip: '198608042007101002',
        email: 'aldi.pratama@kemenkeu.go.id'
    },
    isAuthenticated: false,
    currentUser: null,

    async init() {
        // 1. Check URL parameters for direct name/photo
        const urlParams = new URLSearchParams(window.location.search);
        const paramName = urlParams.get('name') || urlParams.get('userName');
        const paramPhoto = urlParams.get('image_url') || urlParams.get('photo') || urlParams.get('avatar');

        if (paramName || paramPhoto) {
            const customProfile = {
                name: paramName || 'Aldi Pratama',
                avatarUrl: paramPhoto || 'https://aset-satu.kemenkeu.go.id/api/photo/GetPhotoUrl/PWwA2WwH4r_vWT536TBkHtl616mVjsaz2Nlndt6dR7g',
                role: 'KLC Kemenkeu'
            };
            this.saveProfileToStorage(customProfile);
            this.render(customProfile);
            return;
        }

        // 2. Load saved profile from localStorage if exists
        const savedProfile = this.getSavedProfile();
        if (savedProfile) {
            this.render(savedProfile);
        } else {
            // Render default profile (Aldi Pratama)
            this.render(this.defaultProfile);
        }

        // 3. Extract token from URL params, postMessage, or Storage
        let token = this.getStoredToken();

        if (token) {
            const jwtProfile = this.parseJwt(token);
            if (jwtProfile) {
                this.saveProfileToStorage(jwtProfile);
                this.render(jwtProfile);
                return;
            }
        }

        // 4. Fetch live user profile JSON response from API server
        await this.fetchProfile(token);
    },

    saveProfileToStorage(profile) {
        try {
            this.isAuthenticated = true;
            this.currentUser = profile;
            localStorage.setItem('klc_user_profile', JSON.stringify(profile));
        } catch (e) {
            console.log('Error saving profile:', e);
        }
    },

    getSavedProfile() {
        try {
            const str = localStorage.getItem('klc_user_profile');
            if (str) return JSON.parse(str);
        } catch (e) {}
        return null;
    },

    getStoredToken() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get('token') || urlParams.get('access_token');
            if (urlToken) {
                localStorage.setItem('klc_token', urlToken);
                return urlToken;
            }

            return localStorage.getItem('klc_token') || 
                   localStorage.getItem('token') || 
                   sessionStorage.getItem('klc_token') || 
                   sessionStorage.getItem('token') || '';
        } catch (e) {
            return '';
        }
    },

    parseJwt(tokenStr) {
        try {
            const cleanToken = tokenStr.replace(/^Bearer\s+/i, '').trim();
            const parts = cleanToken.split('.');
            if (parts.length !== 3) return null;

            const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
            const data = JSON.parse(decodeURIComponent(escape(payloadStr)));

            return this.parseProfileData(data);
        } catch (e) {
            console.log('Error parsing JWT token:', e);
            return null;
        }
    },

    async fetchProfile(token = '') {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const headers = { 'Accept': 'application/json' };
            if (token) {
                headers['Authorization'] = token.startsWith('Bearer') ? token : `Bearer ${token}`;
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
                this.saveProfileToStorage(profile);
                this.render(profile);
                return true;
            }
        } catch (err) {
            console.log('KLC Profile fetch fallback note:', err.message);
        }
        return false;
    },

    parseProfileData(json) {
        const data = json.data || json.payload || json.principal || json.user || json;
        
        // Extract User Name: "name" and Photo: "image_url" from server response JSON
        let userName = data.name || data.fullName || data.full_name || data.nama || 'Aldi Pratama';
        let userPhoto = data.image_url || data.avatar || data.avatarUrl || data.avatar_url || data.photo || 'https://aset-satu.kemenkeu.go.id/api/photo/GetPhotoUrl/PWwA2WwH4r_vWT536TBkHtl616mVjsaz2Nlndt6dR7g';
        let role = data.role || data.unit || data.jabatan || (data.nip ? `NIP: ${data.nip}` : 'KLC Kemenkeu');

        return {
            name: userName,
            avatarUrl: userPhoto,
            role: role,
            email: data.email || 'aldi.pratama@kemenkeu.go.id',
            nip: data.nip || data.preferred_username || '198608042007101002'
        };
    },

    render(profile) {
        const profileWidgets = document.querySelectorAll('#user-profile-widget, .user-profile-widget');
        profileWidgets.forEach(w => {
            w.classList.remove('hidden');
            w.style.display = 'inline-flex';
            w.style.cursor = 'pointer';
            w.onclick = () => this.showProfileDetailModal(profile);
        });

        const nameEls = document.querySelectorAll('#user-display-name, .user-display-name');
        const roleEls = document.querySelectorAll('#user-display-role, .user-display-role');
        const imgEls = document.querySelectorAll('#user-avatar-img, .user-avatar-img');
        const placeholderEls = document.querySelectorAll('#user-avatar-placeholder, .user-avatar-placeholder');
        const initialsEls = document.querySelectorAll('#user-avatar-initials, .user-avatar-initials');

        // Initials calculation from user name
        let initials = 'AP';
        if (profile.name) {
            const parts = profile.name.trim().split(' ').filter(Boolean);
            if (parts.length >= 2) {
                initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else if (parts.length === 1 && parts[0].length > 0) {
                initials = parts[0].substring(0, 2).toUpperCase();
            }
        }

        // Render User Name: "name" to top right header
        nameEls.forEach(el => { el.textContent = profile.name; });
        roleEls.forEach(el => { if (profile.role) el.textContent = profile.role; });
        initialsEls.forEach(el => { el.textContent = initials; });

        // Render User Photo: "image_url" to avatar image element in top right header
        if (profile.avatarUrl) {
            imgEls.forEach(img => {
                img.src = profile.avatarUrl;
                img.classList.remove('hidden');
                img.onerror = () => {
                    img.classList.add('hidden');
                    placeholderEls.forEach(p => p.classList.remove('hidden'));
                };
            });
            placeholderEls.forEach(p => p.classList.add('hidden'));
        } else {
            imgEls.forEach(img => img.classList.add('hidden'));
            placeholderEls.forEach(p => p.classList.remove('hidden'));
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

        modal.innerHTML = `
            <div class="bg-[#0D2137] border border-[#F5A623] rounded-2xl p-6 max-w-sm w-full text-white shadow-2xl relative">
                <button id="close-user-profile-detail-modal" class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold p-1">&times;</button>
                <div class="flex flex-col items-center text-center">
                    <div class="w-20 h-20 rounded-full border-2 border-[#F5A623] overflow-hidden mb-3 shadow-lg bg-[#1A4B8C] flex items-center justify-center">
                        ${profile.avatarUrl ? `<img src="${profile.avatarUrl}" class="w-full h-full object-cover">` : `<span class="text-2xl font-bold text-[#F5A623]">${profile.name.substring(0, 2).toUpperCase()}</span>`}
                    </div>
                    <h3 class="text-lg font-bold text-white mb-0.5">${profile.name}</h3>
                    <p class="text-xs text-[#FFC94A] font-medium mb-3">${profile.role}</p>

                    ${profile.nip ? `<div class="bg-white/5 w-full py-1.5 px-3 rounded-lg text-xs text-gray-300 mb-2 border border-white/10">NIP: ${profile.nip}</div>` : ''}
                    ${profile.email ? `<div class="bg-white/5 w-full py-1.5 px-3 rounded-lg text-xs text-gray-300 mb-4 border border-white/10">${profile.email}</div>` : ''}
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
            localStorage.setItem('klc_token', token);
            window.UserProfile.init();
        }
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.UserProfile.init());
} else {
    window.UserProfile.init();
}
