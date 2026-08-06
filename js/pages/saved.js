/* =========================================
   GruhaBuddy – Saved Designs Page
   ========================================= */

function renderSavedPage(container) {
    const state = Store.getState();
    const designs = state.savedDesigns || [];

    const roomEmojis = {
        'Bedroom': '🛏️', 'Living Room': '🛋️', 'Study Room': '📚',
        'Kitchen': '🍳', 'Hostel / PG Room': '🏨', 'Home Office': '💼',
        'Bathroom': '🚿', 'Dining Room': '🍽️'
    };

    let contentHTML = '';
    if (designs.length > 0) {
        contentHTML = `
            <div class="saved-designs-grid stagger-children">
                ${designs.map((d, i) => {
            const roomEmoji = roomEmojis[d.roomType] || '🏠';
            const primary = d.colorTheme?.hex?.primary || '#1e293b';
            const accent = d.colorTheme?.hex?.accent || '#14b8a6';
            return `
                    <div class="saved-card glass-card" data-design-id="${d.id}">
                        <div class="saved-card-preview" style="background: linear-gradient(135deg, ${primary}, ${accent});">
                            <span class="room-emoji">${roomEmoji}</span>
                            <div class="saved-card-style">
                                <span class="badge">${d.style || 'Custom'}</span>
                            </div>
                        </div>
                        <div class="saved-card-body">
                            <h3>${d.roomType || 'Room Design'}</h3>
                            <div class="saved-card-details">
                                <span class="saved-card-detail">📐 ${d.roomSize || 'N/A'}</span>
                                <span class="saved-card-detail">💰 ${d.budget || 'N/A'}</span>
                                <span class="saved-card-detail">📅 ${new Date(d.savedAt).toLocaleDateString()}</span>
                            </div>
                            <div class="saved-card-colors">
                                ${d.colorTheme ? `
                                    <div class="saved-card-color" style="background:${d.colorTheme.hex.primary}" title="${d.colorTheme.primary}"></div>
                                    <div class="saved-card-color" style="background:${d.colorTheme.hex.secondary}" title="${d.colorTheme.secondary}"></div>
                                    <div class="saved-card-color" style="background:${d.colorTheme.hex.accent}" title="${d.colorTheme.accent}"></div>
                                ` : ''}
                            </div>
                            <div class="saved-card-actions">
                                <button class="btn btn-primary btn-sm redesign-btn" data-idx="${i}">🎨 Redesign</button>
                                <button class="btn btn-outline btn-sm" onclick="Router.navigate('/ar')">📱 AR View</button>
                                <button class="btn btn-ghost btn-sm delete-btn" data-id="${d.id}">🗑️</button>
                            </div>
                        </div>
                    </div>`;
        }).join('')}
            </div>`;
    } else {
        contentHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                <h3>No saved designs yet</h3>
                <p>Designs you save from the AI chat will appear here. Start a conversation to create your first design!</p>
                <button class="btn btn-primary" onclick="Router.navigate('/chat')">🎨 Start Designing</button>
            </div>`;
    }

    const pageContent = `
        <header class="main-header">
            <div class="main-header-title">
                <h1>Saved Designs</h1>
                <p>${designs.length} design${designs.length !== 1 ? 's' : ''} saved</p>
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
            ${contentHTML}
        </div>`;

    renderDashboardLayout(container, 'saved', pageContent);

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Delete this design?')) {
                Store.deleteDesign(btn.dataset.id);
                showToast('Design deleted', 'info');
                renderSavedPage(document.getElementById('app'));
            }
        });
    });

    // Redesign buttons
    document.querySelectorAll('.redesign-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            Router.navigate('/chat');
        });
    });
}
