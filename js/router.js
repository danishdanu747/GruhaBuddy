/* =========================================
   GruhaBuddy – Simple Hash Router
   ========================================= */

const Router = {
    routes: {},
    currentRoute: null,

    register(path, handler) {
        this.routes[path] = handler;
    },

    navigate(path) {
        window.location.hash = '#' + path;
    },

    _resolve() {
        const hash = window.location.hash.slice(1) || '/login';
        const state = Store.getState();

        // Auth guard
        const publicRoutes = ['/login', '/signup'];
        if (!state.isAuthenticated && !publicRoutes.includes(hash)) {
            this.navigate('/login');
            return;
        }
        if (state.isAuthenticated && publicRoutes.includes(hash)) {
            if (!state.onboardingComplete) {
                this.navigate('/onboarding');
            } else {
                this.navigate('/dashboard');
            }
            return;
        }

        const handler = this.routes[hash];
        if (handler) {
            this.currentRoute = hash;
            const app = document.getElementById('app');
            app.innerHTML = '';
            handler(app);
        } else {
            this.navigate('/login');
        }
    },

    init() {
        window.addEventListener('hashchange', () => this._resolve());
        this._resolve();
    }
};
