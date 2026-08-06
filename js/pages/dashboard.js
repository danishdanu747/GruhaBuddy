/* =========================================
   GruhaBuddy – Dashboard Page
   ========================================= */

function renderDashboardLayout(container, activeNav, pageContent) {
    const state = Store.getState();
    const user = state.user || { name: 'Guest', email: 'guest@gruhabuddy.app', avatar: 'G' };

    container.innerHTML = `
    <div class="dashboard-layout">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </div>
                <span class="sidebar-brand">GruhaBuddy</span>
            </div>
            <nav class="sidebar-nav">
                <div class="sidebar-section-label">Main</div>
                <div class="sidebar-nav-item ${activeNav === 'dashboard' ? 'active' : ''}" data-nav="dashboard">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Dashboard
                </div>
                <div class="sidebar-nav-item ${activeNav === 'chat' ? 'active' : ''}" data-nav="chat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    AI Designer
                </div>
                <div class="sidebar-nav-item ${activeNav === 'upload' ? 'active' : ''}" data-nav="upload">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Upload Room
                </div>
                <div class="sidebar-nav-item ${activeNav === 'camera' ? 'active' : ''}" data-nav="camera">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    Live Camera
                </div>
                <div class="sidebar-section-label">Library</div>
                <div class="sidebar-nav-item ${activeNav === 'saved' ? 'active' : ''}" data-nav="saved">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    Saved Designs
                </div>
                <div class="sidebar-nav-item ${activeNav === 'ar' ? 'active' : ''}" data-nav="ar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"></path><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                    AR Preview
                </div>
                <div class="sidebar-section-label">Account</div>
                <div class="sidebar-nav-item ${activeNav === 'profile' ? 'active' : ''}" data-nav="profile">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Profile
                </div>
            </nav>
            <div class="sidebar-footer">
                <div class="sidebar-user" id="sidebarUser">
                    <div class="avatar">${user.avatar}</div>
                    <div class="sidebar-user-info">
                        <div class="sidebar-user-name">${user.name}</div>
                        <div class="sidebar-user-email">${user.email}</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </div>
            </div>
        </aside>

        <!-- Main -->
        <main class="main-content">
            <div id="mainPageContent" class="page-enter">
                ${pageContent}
            </div>
        </main>
    </div>

    <!-- Mobile overlay -->
    <div id="sidebarOverlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:299;"></div>
    `;

    // Sidebar navigation
    document.querySelectorAll('[data-nav]').forEach(item => {
        item.addEventListener('click', () => {
            const route = item.dataset.nav;
            Router.navigate('/' + route);
        });
    });

    // Logout
    document.getElementById('sidebarUser').addEventListener('click', () => {
        if (confirm('Sign out of GruhaBuddy?')) {
            Store.logout();
            showToast('Signed out successfully', 'info');
            Router.navigate('/login');
        }
    });

    // Mobile menu
    const hamburger = document.querySelector('.mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.style.display = 'none';
        });
    }
}

function renderDashboardPage(container) {
    const state = Store.getState();
    const user = state.user || { name: 'Guest' };
    const designCount = state.savedDesigns.length;
    const prefs = state.preferences;

    let recentDesignsHTML = '';
    if (designCount > 0) {
        const recent = state.savedDesigns.slice(-3).reverse();
        recentDesignsHTML = `
            <div class="section-header">
                <div>
                    <h2>Recent Designs</h2>
                    <p>Your latest room transformations</p>
                </div>
                <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/saved')">View All →</button>
            </div>
            <div class="dashboard-grid stagger-children">
                ${recent.map(d => `
                    <div class="design-card glass-card">
                        <div class="design-card-image" style="background: linear-gradient(135deg, ${d.colorTheme?.hex?.primary || '#1e293b'} 0%, ${d.colorTheme?.hex?.accent || '#14b8a6'} 100%);">
                            <span class="badge">${d.style || 'Modern'}</span>
                        </div>
                        <div class="design-card-body">
                            <h3>${d.roomType || 'Room Design'}</h3>
                            <p>${d.style || 'Custom'} style • Budget: ${d.budget || 'N/A'}</p>
                            <div class="design-card-meta">
                                <span>📅 ${new Date(d.savedAt).toLocaleDateString()}</span>
                                <span>🎨 ${d.style || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>`;
    } else {
        recentDesignsHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <h3>No designs yet</h3>
                <p>Start a conversation with our AI designer to create your first room design!</p>
                <button class="btn btn-primary" onclick="Router.navigate('/chat')">🎨 Start Designing</button>
            </div>`;
    }

    const pageContent = `
        <header class="main-header">
            <div class="main-header-title">
                <h1>Welcome, ${user.name}! 👋</h1>
                <p>Ready to transform your space?</p>
            </div>
            <div class="main-header-actions">
                <button class="mobile-menu-btn" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <button class="btn btn-primary" onclick="Router.navigate('/chat')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Design
                </button>
            </div>
        </header>
        <div class="page-content">
            <!-- Stats -->
            <div class="stats-row stagger-children">
                <div class="stat-card glass-card">
                    <div class="stat-card-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <h3>${designCount}</h3>
                    <p>Saved Designs</p>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-card-icon accent">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <h3>${state.chatHistory.length}</h3>
                    <p>Chat Messages</p>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-card-icon info">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <h3>${prefs.style ? '✓' : '—'}</h3>
                    <p>Style: ${prefs.style || 'Not set'}</p>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-card-icon success">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <h3>₹${(prefs.budget || 0).toLocaleString('en-IN')}</h3>
                    <p>Budget Set</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="section-header">
                <div>
                    <h2>Quick Actions</h2>
                    <p>Jump right into designing</p>
                </div>
            </div>
            <div class="quick-actions stagger-children">
                <div class="quick-action-card glass-card" onclick="Router.navigate('/chat')">
                    <div class="quick-action-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <div>
                        <h3>Start New Design</h3>
                        <p>Chat with AI to design a new room</p>
                    </div>
                </div>
                <div class="quick-action-card glass-card" onclick="Router.navigate('/saved')">
                    <div class="quick-action-icon accent">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <div>
                        <h3>Resume Saved Design</h3>
                        <p>Continue from where you left off</p>
                    </div>
                </div>
                <div class="quick-action-card glass-card" onclick="Router.navigate('/upload')">
                    <div class="quick-action-icon" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                    <div>
                        <h3>Upload Room Photo</h3>
                        <p>Get AI-generated design options</p>
                    </div>
                </div>
                <div class="quick-action-card glass-card" onclick="Router.navigate('/camera')">
                    <div class="quick-action-icon" style="background: linear-gradient(135deg, #f59e0b, #f97316);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    </div>
                    <div>
                        <h3>Live AR Camera</h3>
                        <p>See furniture in your room live</p>
                    </div>
                </div>
            </div>

            <!-- Recent Designs -->
            ${recentDesignsHTML}
        </div>`;

    renderDashboardLayout(container, 'dashboard', pageContent);
}
