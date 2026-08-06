/* =========================================
   GruhaBuddy – Profile Page
   ========================================= */

function renderProfilePage(container) {
    const state = Store.getState();
    const user = state.user || { name: 'Guest', email: 'guest@gruhabuddy.app', avatar: 'G' };
    const prefs = state.preferences;

    const styleOptions = ['modern', 'minimalist', 'boho', 'aesthetic', 'luxury', 'traditional', 'contemporary'];

    const pageContent = `
        <header class="main-header">
            <div class="main-header-title">
                <h1>Profile Settings</h1>
                <p>Manage your account and preferences</p>
            </div>
            <div class="main-header-actions">
                <button class="mobile-menu-btn" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>
        </header>
        <div class="page-content">
            <div class="profile-page">
                <div class="profile-header">
                    <div class="avatar avatar-xl">${user.avatar}</div>
                    <div class="profile-info">
                        <h2>${user.name}</h2>
                        <p>${user.email}</p>
                        <span class="badge" style="margin-top: var(--space-2);">
                            ${user.isGuest ? '👤 Guest Account' : '✨ Member'}
                        </span>
                    </div>
                </div>

                <div class="profile-section glass-card">
                    <h3>Account Information</h3>
                    <div class="profile-form-grid">
                        <div class="input-group">
                            <label>Full Name</label>
                            <input type="text" class="input-field" id="profileName" value="${user.name}" ${user.isGuest ? 'disabled' : ''}>
                        </div>
                        <div class="input-group">
                            <label>Email</label>
                            <input type="email" class="input-field" id="profileEmail" value="${user.email}" disabled>
                        </div>
                        <div class="input-group">
                            <label>Joined</label>
                            <input type="text" class="input-field" value="${user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}" disabled>
                        </div>
                        <div class="input-group">
                            <label>Saved Designs</label>
                            <input type="text" class="input-field" value="${state.savedDesigns.length} designs" disabled>
                        </div>
                    </div>
                </div>

                <div class="profile-section glass-card">
                    <h3>Design Preferences</h3>
                    <div class="profile-form-grid">
                        <div class="input-group">
                            <label>Preferred Room Type</label>
                            <select class="input-field" id="prefRoomType">
                                <option value="">Select...</option>
                                <option value="bedroom" ${prefs.roomType === 'bedroom' ? 'selected' : ''}>Bedroom</option>
                                <option value="livingroom" ${prefs.roomType === 'livingroom' ? 'selected' : ''}>Living Room</option>
                                <option value="study" ${prefs.roomType === 'study' ? 'selected' : ''}>Study Room</option>
                                <option value="kitchen" ${prefs.roomType === 'kitchen' ? 'selected' : ''}>Kitchen</option>
                                <option value="hostel" ${prefs.roomType === 'hostel' ? 'selected' : ''}>Hostel / PG</option>
                                <option value="office" ${prefs.roomType === 'office' ? 'selected' : ''}>Home Office</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Room Size</label>
                            <select class="input-field" id="prefRoomSize">
                                <option value="">Select...</option>
                                <option value="small" ${prefs.roomSize === 'small' ? 'selected' : ''}>Small (< 120 sq ft)</option>
                                <option value="medium" ${prefs.roomSize === 'medium' ? 'selected' : ''}>Medium (120–200 sq ft)</option>
                                <option value="large" ${prefs.roomSize === 'large' ? 'selected' : ''}>Large (200+ sq ft)</option>
                            </select>
                        </div>
                        <div class="input-group full">
                            <label>Budget: ₹${prefs.budget.toLocaleString('en-IN')}</label>
                            <input type="range" class="budget-range" id="prefBudget" min="5000" max="200000" step="1000" value="${prefs.budget}">
                        </div>
                        <div class="input-group full">
                            <label>Preferred Style</label>
                            <div class="profile-preferences" id="styleChips">
                                ${styleOptions.map(s => `
                                    <span class="chip ${prefs.style === s ? 'active' : ''}" data-style="${s}">
                                        ${s.charAt(0).toUpperCase() + s.slice(1)}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Rental / Student Mode</label>
                            <select class="input-field" id="prefRental">
                                <option value="false" ${!prefs.rentalMode ? 'selected' : ''}>No — I can modify</option>
                                <option value="true" ${prefs.rentalMode ? 'selected' : ''}>Yes — Temporary setup</option>
                            </select>
                        </div>
                    </div>
                    <div style="margin-top: var(--space-6); display: flex; gap: var(--space-3);">
                        <button class="btn btn-primary" id="savePrefsBtn">Save Preferences</button>
                        <button class="btn btn-outline" onclick="Router.navigate('/onboarding')">Re-do Onboarding</button>
                    </div>
                </div>

                <div class="profile-section glass-card">
                    <h3>Danger Zone</h3>
                    <p style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-4);">
                        These actions are irreversible. Please proceed with caution.
                    </p>
                    <div style="display: flex; gap: var(--space-3);">
                        <button class="btn btn-outline" style="border-color: var(--color-error); color: var(--color-error);" id="clearDataBtn">
                            🗑️ Clear All Data
                        </button>
                        <button class="btn btn-outline" style="border-color: var(--color-error); color: var(--color-error);" id="logoutBtn">
                            🚪 Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    renderDashboardLayout(container, 'profile', pageContent);

    // Style chip selection
    let selectedStyle = prefs.style;
    document.querySelectorAll('#styleChips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#styleChips .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedStyle = chip.dataset.style;
        });
    });

    // Budget slider label update
    const budgetSlider = document.getElementById('prefBudget');
    if (budgetSlider) {
        budgetSlider.addEventListener('input', () => {
            budgetSlider.closest('.input-group').querySelector('label').textContent =
                `Budget: ₹${parseInt(budgetSlider.value).toLocaleString('en-IN')}`;
        });
    }

    // Save preferences
    document.getElementById('savePrefsBtn').addEventListener('click', () => {
        const newPrefs = {
            roomType: document.getElementById('prefRoomType').value,
            roomSize: document.getElementById('prefRoomSize').value,
            budget: parseInt(document.getElementById('prefBudget').value),
            style: selectedStyle,
            rentalMode: document.getElementById('prefRental').value === 'true'
        };
        Store.setPreferences(newPrefs);

        // Update name if changed
        const nameInput = document.getElementById('profileName');
        if (nameInput && nameInput.value !== user.name) {
            Store.setState({
                user: { ...Store.getState().user, name: nameInput.value, avatar: nameInput.value[0].toUpperCase() }
            });
        }

        showToast('Preferences saved! 🎉', 'success');
    });

    // Clear all data
    document.getElementById('clearDataBtn').addEventListener('click', () => {
        if (confirm('This will delete all your saved designs and chat history. Are you sure?')) {
            Store.setState({ savedDesigns: [], chatHistory: [] });
            showToast('All data cleared', 'info');
            renderProfilePage(document.getElementById('app'));
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Store.logout();
        showToast('Signed out', 'info');
        Router.navigate('/login');
    });
}
