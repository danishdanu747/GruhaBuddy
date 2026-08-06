/* =========================================
   GruhaBuddy – Login Page
   ========================================= */

function renderLoginPage(container) {
    container.innerHTML = `
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-logo">
                <div class="auth-logo-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </div>
                <h1>GruhaBuddy</h1>
                <p>Design your space with AI</p>
            </div>

            <div class="auth-card glass-card">
                <h2>Welcome Back</h2>
                <p>Sign in to continue designing your dream space</p>

                <form class="auth-form" id="loginForm">
                    <div class="input-group">
                        <label for="login-email">Email Address</label>
                        <input type="email" id="login-email" class="input-field" placeholder="your@email.com" required autocomplete="email">
                    </div>
                    <div class="input-group">
                        <label for="login-password">Password</label>
                        <div class="password-wrapper">
                            <input type="password" id="login-password" class="input-field" placeholder="••••••••" required autocomplete="current-password">
                            <span class="password-toggle" id="togglePassword">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div class="auth-extras">
                        <label>
                            <input type="checkbox" checked> Remember me
                        </label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%">
                        Sign In
                    </button>
                </form>

                <div class="divider" style="margin: var(--space-6) 0;">or continue with</div>

                <div class="auth-social">
                    <button class="btn" id="googleLogin">
                        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.5 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 15.4 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.4 0-9.9-3.5-11.3-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/></svg>
                        Continue with Google
                    </button>
                    <button class="btn" id="githubLogin">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        Continue with GitHub
                    </button>
                </div>

                <button class="guest-btn" id="guestLogin">
                    ✨ Continue as Guest
                </button>
            </div>

            <div class="auth-footer">
                Don't have an account? <a href="#/signup">Create one</a>
            </div>
        </div>
    </div>`;

    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        Store.login(email, password);
        showToast('Welcome back! 👋', 'success');
        Router.navigate('/onboarding');
    });

    document.getElementById('guestLogin').addEventListener('click', () => {
        Store.guestLogin();
        showToast('Welcome, Guest! 🌟', 'success');
        Router.navigate('/onboarding');
    });

    document.getElementById('googleLogin').addEventListener('click', () => {
        Store.login('user@gmail.com', '', 'Alex');
        showToast('Signed in with Google! 👋', 'success');
        Router.navigate('/onboarding');
    });

    document.getElementById('githubLogin').addEventListener('click', () => {
        Store.login('user@github.com', '', 'Developer');
        showToast('Signed in with GitHub! 👋', 'success');
        Router.navigate('/onboarding');
    });

    document.getElementById('togglePassword').addEventListener('click', () => {
        const input = document.getElementById('login-password');
        input.type = input.type === 'password' ? 'text' : 'password';
    });
}

// Toast system
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(60px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
