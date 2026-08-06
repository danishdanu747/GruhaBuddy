/* =========================================
   GruhaBuddy – Signup Page
   ========================================= */

function renderSignupPage(container) {
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
                <h2>Create Account</h2>
                <p>Start transforming your space today</p>

                <form class="auth-form" id="signupForm">
                    <div class="input-group">
                        <label for="signup-name">Full Name</label>
                        <input type="text" id="signup-name" class="input-field" placeholder="John Doe" required>
                    </div>
                    <div class="input-group">
                        <label for="signup-email">Email Address</label>
                        <input type="email" id="signup-email" class="input-field" placeholder="your@email.com" required>
                    </div>
                    <div class="input-group">
                        <label for="signup-password">Password</label>
                        <div class="password-wrapper">
                            <input type="password" id="signup-password" class="input-field" placeholder="Min. 8 characters" required minlength="8">
                            <span class="password-toggle" id="toggleSignupPassword">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div class="auth-extras">
                        <label>
                            <input type="checkbox" required> I agree to the <a href="#">Terms of Service</a>
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%">
                        Create Account
                    </button>
                </form>

                <div class="divider" style="margin: var(--space-6) 0;">or sign up with</div>

                <div class="auth-social">
                    <button class="btn" id="signupGoogle">
                        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.5 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 15.4 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.4 0-9.9-3.5-11.3-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/></svg>
                        Sign up with Google
                    </button>
                </div>
            </div>

            <div class="auth-footer">
                Already have an account? <a href="#/login">Sign in</a>
            </div>
        </div>
    </div>`;

    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        Store.signup(name, email, password);
        showToast('Account created! Welcome to GruhaBuddy 🎉', 'success');
        Router.navigate('/onboarding');
    });

    document.getElementById('signupGoogle').addEventListener('click', () => {
        Store.login('user@gmail.com', '', 'Alex');
        showToast('Signed up with Google! 🎉', 'success');
        Router.navigate('/onboarding');
    });

    document.getElementById('toggleSignupPassword').addEventListener('click', () => {
        const input = document.getElementById('signup-password');
        input.type = input.type === 'password' ? 'text' : 'password';
    });
}
