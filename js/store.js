/* =========================================
   GruhaBuddy – Global State Store
   ========================================= */

const Store = {
    _state: {
        user: null,
        isAuthenticated: false,
        onboardingComplete: false,
        preferences: {
            roomType: '',
            roomSize: '',
            budget: 25000,
            style: '',
            rentalMode: false
        },
        savedDesigns: [],
        chatHistory: [],
        currentDesign: null
    },

    _listeners: [],

    getState() {
        return { ...this._state };
    },

    setState(updates) {
        this._state = { ...this._state, ...updates };
        this._notify();
        this._persist();
    },

    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    },

    _notify() {
        this._listeners.forEach(fn => fn(this._state));
    },

    _persist() {
        try {
            localStorage.setItem('gruhabuddy_state', JSON.stringify(this._state));
        } catch (e) { /* ignore */ }
    },

    _hydrate() {
        try {
            const saved = localStorage.getItem('gruhabuddy_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                this._state = { ...this._state, ...parsed };
            }
        } catch (e) { /* ignore */ }
    },

    // ---- Auth Actions ----
    login(email, password, name) {
        const user = {
            id: 'u_' + Date.now(),
            name: name || email.split('@')[0],
            email: email,
            avatar: (name || email)[0].toUpperCase(),
            joinedAt: new Date().toISOString()
        };
        this.setState({
            user,
            isAuthenticated: true
        });
        return user;
    },

    signup(name, email, password) {
        return this.login(email, password, name);
    },

    guestLogin() {
        const user = {
            id: 'guest_' + Date.now(),
            name: 'Guest',
            email: 'guest@gruhabuddy.app',
            avatar: 'G',
            isGuest: true,
            joinedAt: new Date().toISOString()
        };
        this.setState({
            user,
            isAuthenticated: true
        });
        return user;
    },

    logout() {
        this.setState({
            user: null,
            isAuthenticated: false,
            onboardingComplete: false,
            preferences: {
                roomType: '',
                roomSize: '',
                budget: 25000,
                style: '',
                rentalMode: false
            },
            chatHistory: [],
            currentDesign: null
        });
        localStorage.removeItem('gruhabuddy_state');
    },

    // ---- Preferences Actions ----
    setPreferences(prefs) {
        this.setState({
            preferences: { ...this._state.preferences, ...prefs },
            onboardingComplete: true
        });
    },

    // ---- Chat Actions ----
    addMessage(message) {
        const msg = {
            id: 'm_' + Date.now() + Math.random().toString(36).slice(2, 6),
            timestamp: new Date().toISOString(),
            ...message
        };
        this.setState({
            chatHistory: [...this._state.chatHistory, msg]
        });
        return msg;
    },

    clearChat() {
        this.setState({ chatHistory: [] });
    },

    // ---- Saved Designs Actions ----
    saveDesign(design) {
        const d = {
            id: 'd_' + Date.now(),
            savedAt: new Date().toISOString(),
            ...design
        };
        this.setState({
            savedDesigns: [...this._state.savedDesigns, d]
        });
        return d;
    },

    deleteDesign(designId) {
        this.setState({
            savedDesigns: this._state.savedDesigns.filter(d => d.id !== designId)
        });
    },

    getDesign(designId) {
        return this._state.savedDesigns.find(d => d.id === designId) || null;
    }
};

// Hydrate on load
Store._hydrate();
