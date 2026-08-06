/* =========================================
   GruhaBuddy – Onboarding Flow
   ========================================= */

function renderOnboardingPage(container) {
    const state = Store.getState();
    // If already onboarded, skip
    if (state.onboardingComplete) {
        Router.navigate('/dashboard');
        return;
    }

    let step = 1;
    const totalSteps = 5;
    const prefs = {
        roomType: '',
        roomSize: '',
        budget: 25000,
        style: '',
        rentalMode: false
    };

    function render() {
        container.innerHTML = `
        <div class="onboarding-page">
            <div class="onboarding-container">
                <div class="onboarding-progress">
                    <div class="onboarding-progress-header">
                        <span>Step ${step} of ${totalSteps}</span>
                        <div class="onboarding-step-dots">
                            ${Array.from({ length: totalSteps }, (_, i) => `
                                <div class="step-dot ${i + 1 < step ? 'done' : ''} ${i + 1 === step ? 'active' : ''}"></div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${(step / totalSteps) * 100}%"></div>
                    </div>
                </div>

                <div class="onboarding-card glass-card" id="onboardingStep">
                    ${getStepContent(step)}
                </div>
            </div>
        </div>`;

        attachStepListeners(step);
    }

    function getStepContent(s) {
        switch (s) {
            case 1:
                return `
                    <h2>🏠 What room are you designing?</h2>
                    <p>Choose the type of room you want to transform</p>
                    <div class="option-grid stagger-children">
                        ${roomOption('bedroom', '🛏️', 'Bedroom', 'Cozy sleeping space')}
                        ${roomOption('livingroom', '🛋️', 'Living Room', 'Social & relaxation')}
                        ${roomOption('study', '📚', 'Study Room', 'Productive workspace')}
                        ${roomOption('kitchen', '🍳', 'Kitchen', 'Cooking & dining')}
                        ${roomOption('hostel', '🏨', 'Hostel / PG', 'Compact & rental')}
                        ${roomOption('office', '💼', 'Home Office', 'Professional setup')}
                    </div>
                    <div class="onboarding-nav">
                        <button class="btn btn-ghost" onclick="Router.navigate('/dashboard')">Skip for now</button>
                        <button class="btn btn-primary" id="nextBtn" disabled>Next →</button>
                    </div>`;
            case 2:
                return `
                    <h2>📐 How big is your room?</h2>
                    <p>This helps us suggest correctly sized furniture</p>
                    <div class="option-grid stagger-children">
                        ${sizeOption('small', '📦', 'Small', '< 120 sq ft')}
                        ${sizeOption('medium', '🏠', 'Medium', '120–200 sq ft')}
                        ${sizeOption('large', '🏡', 'Large', '200+ sq ft')}
                    </div>
                    <div class="onboarding-nav">
                        <button class="btn btn-ghost" id="prevBtn">← Back</button>
                        <button class="btn btn-primary" id="nextBtn" disabled>Next →</button>
                    </div>`;
            case 3:
                return `
                    <h2>💰 What's your budget?</h2>
                    <p>We'll optimize recommendations within your range</p>
                    <div class="budget-slider-container">
                        <div class="budget-display">
                            <div class="budget-amount" id="budgetValue">₹${prefs.budget.toLocaleString('en-IN')}</div>
                            <div class="budget-label">Estimated total budget</div>
                        </div>
                        <input type="range" class="budget-range" id="budgetSlider" min="5000" max="200000" step="1000" value="${prefs.budget}">
                        <div class="budget-range-labels">
                            <span>₹5,000</span>
                            <span>₹1,00,000</span>
                            <span>₹2,00,000</span>
                        </div>
                    </div>
                    <div class="onboarding-nav">
                        <button class="btn btn-ghost" id="prevBtn">← Back</button>
                        <button class="btn btn-primary" id="nextBtn">Next →</button>
                    </div>`;
            case 4:
                return `
                    <h2>🎨 Choose your style</h2>
                    <p>Pick the aesthetic that resonates with you</p>
                    <div class="option-grid stagger-children">
                        ${styleOption('modern', '🏢', 'Modern', 'Clean & sleek')}
                        ${styleOption('minimalist', '🌿', 'Minimalist', 'Less is more')}
                        ${styleOption('boho', '🎨', 'Boho', 'Warm & eclectic')}
                        ${styleOption('aesthetic', '✨', 'Aesthetic', 'Trendy vibes')}
                        ${styleOption('luxury', '💎', 'Luxury', 'Premium feel')}
                        ${styleOption('traditional', '🏛️', 'Traditional', 'Classic charm')}
                    </div>
                    <div class="onboarding-nav">
                        <button class="btn btn-ghost" id="prevBtn">← Back</button>
                        <button class="btn btn-primary" id="nextBtn" disabled>Next →</button>
                    </div>`;
            case 5:
                return `
                    <h2>🔧 Rental / Student mode?</h2>
                    <p>We'll suggest no-drill, temporary, and budget-friendly options</p>
                    <div class="option-grid stagger-children">
                        ${rentalOption(true, '🎓', 'Yes', 'Temporary setup, no modifications')}
                        ${rentalOption(false, '🏡', 'No', 'I own / can modify the space')}
                    </div>
                    <div class="onboarding-nav">
                        <button class="btn btn-ghost" id="prevBtn">← Back</button>
                        <button class="btn btn-accent btn-lg" id="finishBtn">🚀 Generate My Design</button>
                    </div>`;
        }
    }

    function roomOption(val, icon, label, desc) {
        return `<div class="option-card ${prefs.roomType === val ? 'selected' : ''}" data-room="${val}">
            <div class="option-card-icon">${icon}</div>
            <div class="option-card-label">${label}</div>
            <div class="option-card-desc">${desc}</div>
        </div>`;
    }
    function sizeOption(val, icon, label, desc) {
        return `<div class="option-card ${prefs.roomSize === val ? 'selected' : ''}" data-size="${val}">
            <div class="option-card-icon">${icon}</div>
            <div class="option-card-label">${label}</div>
            <div class="option-card-desc">${desc}</div>
        </div>`;
    }
    function styleOption(val, icon, label, desc) {
        return `<div class="option-card ${prefs.style === val ? 'selected' : ''}" data-style="${val}">
            <div class="option-card-icon">${icon}</div>
            <div class="option-card-label">${label}</div>
            <div class="option-card-desc">${desc}</div>
        </div>`;
    }
    function rentalOption(val, icon, label, desc) {
        return `<div class="option-card ${prefs.rentalMode === val ? 'selected' : ''}" data-rental="${val}">
            <div class="option-card-icon">${icon}</div>
            <div class="option-card-label">${label}</div>
            <div class="option-card-desc">${desc}</div>
        </div>`;
    }

    function attachStepListeners(s) {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const finishBtn = document.getElementById('finishBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => { step--; render(); });

        switch (s) {
            case 1:
                document.querySelectorAll('[data-room]').forEach(el => {
                    el.addEventListener('click', () => {
                        prefs.roomType = el.dataset.room;
                        document.querySelectorAll('[data-room]').forEach(c => c.classList.remove('selected'));
                        el.classList.add('selected');
                        if (nextBtn) nextBtn.disabled = false;
                    });
                });
                if (nextBtn) nextBtn.addEventListener('click', () => { step++; render(); });
                break;
            case 2:
                document.querySelectorAll('[data-size]').forEach(el => {
                    el.addEventListener('click', () => {
                        prefs.roomSize = el.dataset.size;
                        document.querySelectorAll('[data-size]').forEach(c => c.classList.remove('selected'));
                        el.classList.add('selected');
                        if (nextBtn) nextBtn.disabled = false;
                    });
                });
                if (nextBtn) nextBtn.addEventListener('click', () => { step++; render(); });
                break;
            case 3:
                const slider = document.getElementById('budgetSlider');
                const display = document.getElementById('budgetValue');
                if (slider) {
                    slider.addEventListener('input', (e) => {
                        prefs.budget = parseInt(e.target.value);
                        display.textContent = `₹${prefs.budget.toLocaleString('en-IN')}`;
                    });
                }
                if (nextBtn) nextBtn.addEventListener('click', () => { step++; render(); });
                break;
            case 4:
                document.querySelectorAll('[data-style]').forEach(el => {
                    el.addEventListener('click', () => {
                        prefs.style = el.dataset.style;
                        document.querySelectorAll('[data-style]').forEach(c => c.classList.remove('selected'));
                        el.classList.add('selected');
                        if (nextBtn) nextBtn.disabled = false;
                    });
                });
                if (nextBtn) nextBtn.addEventListener('click', () => { step++; render(); });
                break;
            case 5:
                document.querySelectorAll('[data-rental]').forEach(el => {
                    el.addEventListener('click', () => {
                        prefs.rentalMode = el.dataset.rental === 'true';
                        document.querySelectorAll('[data-rental]').forEach(c => c.classList.remove('selected'));
                        el.classList.add('selected');
                    });
                });
                if (finishBtn) finishBtn.addEventListener('click', () => {
                    Store.setPreferences(prefs);
                    showToast('Preferences saved! Generating your design... 🎨', 'success');
                    Router.navigate('/dashboard');
                });
                break;
        }
    }

    render();
}
