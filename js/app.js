/* =========================================
   GruhaBuddy – App Entry Point
   ========================================= */

(function () {
    // Register all routes
    Router.register('/login', renderLoginPage);
    Router.register('/signup', renderSignupPage);
    Router.register('/onboarding', renderOnboardingPage);
    Router.register('/dashboard', renderDashboardPage);
    Router.register('/chat', renderChatPage);
    Router.register('/saved', renderSavedPage);
    Router.register('/ar', renderARPage);
    Router.register('/upload', renderUploadPage);
    Router.register('/camera', renderCameraPage);
    Router.register('/profile', renderProfilePage);

    // Initialize router
    Router.init();

    console.log('%c🏠 GruhaBuddy', 'font-size: 20px; font-weight: bold; color: #14b8a6;');
    console.log('%cAI Interior Design Assistant — Loaded!', 'font-size: 12px; color: #94a3b8;');
})();
