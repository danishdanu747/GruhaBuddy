/* =========================================
   GruhaBuddy – AR Preview Page
   ========================================= */

function renderARPage(container) {
    const state = Store.getState();
    const prefs = state.preferences;

    // Get AR items if preferences exist
    let arItemsHTML = '';
    if (prefs.roomType) {
        const design = AIEngine.generateDesignResponse(prefs);
        arItemsHTML = `
            <div class="section-header" style="margin-top: var(--space-8);">
                <div>
                    <h2>Your AR-Ready Items</h2>
                    <p>Based on your ${prefs.style || 'current'} ${AIEngine._formatRoomType(prefs.roomType)} design</p>
                </div>
            </div>
            <div class="furniture-grid stagger-children" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-4);">
                ${design.arItems.map(item => `
                    <div class="glass-card" style="padding: var(--space-5); text-align: center; cursor:pointer; transition: all var(--transition-base);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-glow)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                        <div style="font-size: 2.5rem; margin-bottom: var(--space-3);">${item.icon}</div>
                        <div style="font-weight: 600; font-size: var(--text-sm); margin-bottom: var(--space-1);">${item.name}</div>
                        <div style="font-size: var(--text-xs); color: var(--color-primary-light);">Fits: ${item.sizeFit}</div>
                        <button class="btn btn-primary btn-sm" style="margin-top: var(--space-3); width:100%;">
                            📱 View in AR
                        </button>
                    </div>
                `).join('')}
            </div>`;
    }

    const pageContent = `
        <header class="main-header">
            <div class="main-header-title">
                <h1>AR Visualization</h1>
                <p>Preview furniture in your actual room</p>
            </div>
            <div class="main-header-actions">
                <button class="mobile-menu-btn" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>
        </header>
        <div class="page-content ar-view-page">
            <div class="ar-hero glass-card">
                <h2>📱 Augmented Reality Preview</h2>
                <p>See how furniture looks in your room before buying. Use your phone camera to place items in real-time and compare styles side by side.</p>
                <button class="btn btn-accent btn-lg" onclick="showToast('AR Camera launching... Point at your room!', 'info')">
                    🎥 Launch AR Camera
                </button>
            </div>

            <div class="ar-features stagger-children">
                <div class="ar-feature-card glass-card">
                    <div class="ar-feature-icon">📐</div>
                    <h3>Size-Accurate</h3>
                    <p>All items are scaled to real-world dimensions so you can see exact fit in your room.</p>
                </div>
                <div class="ar-feature-card glass-card">
                    <div class="ar-feature-icon">🔄</div>
                    <h3>Compare Styles</h3>
                    <p>Switch between modern, minimalist, boho, and more to see what fits your vibe.</p>
                </div>
                <div class="ar-feature-card glass-card">
                    <div class="ar-feature-icon">📸</div>
                    <h3>Capture & Share</h3>
                    <p>Take snapshots of your AR-placed furniture and share with friends for second opinions.</p>
                </div>
                <div class="ar-feature-card glass-card">
                    <div class="ar-feature-icon">🎨</div>
                    <h3>Color Match</h3>
                    <p>See how different color themes look on your actual walls using AR paint preview.</p>
                </div>
            </div>

            ${arItemsHTML}
        </div>`;

    renderDashboardLayout(container, 'ar', pageContent);
}
