/* =========================================
   GruhaBuddy – API Client (Backend Integration)
   ========================================= */

const API = {
    BASE_URL: 'http://localhost:5000',
    token: null,

    _headers() {
        const h = { 'Content-Type': 'application/json' };
        if (this.token) h['Authorization'] = `Bearer ${this.token}`;
        return h;
    },

    async post(path, data) {
        const res = await fetch(this.BASE_URL + path, {
            method: 'POST',
            headers: this._headers(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async get(path) {
        const res = await fetch(this.BASE_URL + path, {
            headers: this._headers()
        });
        return res.json();
    },

    async delete(path) {
        const res = await fetch(this.BASE_URL + path, {
            method: 'DELETE',
            headers: this._headers()
        });
        return res.json();
    },

    async uploadImage(file, styles, roomType) {
        const form = new FormData();
        form.append('image', file);
        form.append('styles', styles.join(','));
        form.append('roomType', roomType || 'bedroom');

        const res = await fetch(this.BASE_URL + '/api/upload-room', {
            method: 'POST',
            headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
            body: form
        });
        return res.json();
    },

    async generateRoom(styles, roomType) {
        return this.post('/api/generate-room', { styles, roomType });
    },

    // Send a chat message to the backend, which forwards it to Gemini AI.
    // `history` is a lightweight array of { role: 'user'|'assistant', content: string }.
    async chat(message, preferences, history) {
        return this.post('/api/chat', { message, preferences, history });
    },

    async processCameraFrame(blob, style, furniture) {
        const form = new FormData();
        form.append('frame', blob, 'frame.jpg');
        form.append('style', style);
        form.append('furniture', furniture);

        const res = await fetch(this.BASE_URL + '/api/camera/process-frame', {
            method: 'POST',
            body: form
        });
        if (!res.ok) throw new Error('Frame processing failed');
        return res.blob();
    },

    imageUrl(path) {
        return this.BASE_URL + path;
    }
};

// Load token from store
(function () {
    try {
        const saved = localStorage.getItem('gruhabuddy_token');
        if (saved) API.token = saved;
    } catch (e) { }
})();
