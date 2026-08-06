/* =========================================
   GruhaBuddy – Image Upload & AI Design Page
   ========================================= */

function renderUploadPage(container) {
    const state = Store.getState();
    const prefs = state.preferences;
    const allStyles = ['modern', 'minimalist', 'boho', 'aesthetic', 'luxury', 'traditional', 'contemporary'];
    let selectedStyles = prefs.style ? [prefs.style] : ['modern', 'minimalist', 'boho'];
    let uploadedFile = null;
    let generatedDesigns = [];
    let selectedDesign = null;

    let selectedRoomType = prefs.roomType || 'livingroom';
    const roomTypes = [
        { id: 'livingroom', label: 'Living Room', icon: '🛋️' },
        { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
        { id: 'study', label: 'Study / Office', icon: '💻' },
        { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
        { id: 'dining', label: 'Dining Room', icon: '🍽️' },
        { id: 'hall', label: 'Hall / Lobby', icon: '🏠' }
    ];

    const pageContent = `
        <header class="main-header">
            <div class="main-header-title">
                <h1>🎨 AI Room Designer</h1>
                <p>Upload your empty room photo & AI will furnish it</p>
            </div>
            <div class="main-header-actions">
                <button class="mobile-menu-btn" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>
        </header>
        <div class="page-content">
            <!-- Upload Section -->
            <div class="glass-card" style="padding: var(--space-8); margin-bottom: var(--space-8);">
                <h2 style="margin-bottom: var(--space-2);">📸 Upload Your Empty Room</h2>
                <p style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-6);">
                    Take a photo of your empty room and our AI will place furniture (sofa, TV, table, lamps, etc.) based on room type & style.
                </p>

                <div class="upload-zone" id="uploadZone">
                    <input type="file" id="fileInput" accept="image/*" capture="environment">
                    <div class="upload-zone-icon">📷</div>
                    <h3>Drop your room photo here</h3>
                    <p>or click to browse • Supports JPG, PNG • Max 10MB</p>
                </div>
                <div id="uploadPreview" style="display:none; margin-top: var(--space-6); text-align:center;">
                    <div class="upload-preview">
                        <img id="previewImage" src="" alt="Room preview">
                        <div class="remove-btn" id="removeImage">✕</div>
                    </div>
                </div>

                <!-- Room Type Selection -->
                <div style="margin-top: var(--space-6);">
                    <h3 style="font-size: var(--text-base); margin-bottom: var(--space-3);">🏠 What room is this?</h3>
                    <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-3);">This determines which furniture gets placed (sofa+TV for living room, bed for bedroom, etc.)</p>
                    <div class="style-selector" id="roomTypeSelector">
                        ${roomTypes.map(r => `
                            <button class="style-chip ${selectedRoomType === r.id ? 'active' : ''}" data-room="${r.id}">
                                ${r.icon} ${r.label}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Style Selection -->
                <div style="margin-top: var(--space-6);">
                    <h3 style="font-size: var(--text-base); margin-bottom: var(--space-3);">🎨 Choose Design Styles</h3>
                    <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-3);">Select one or more styles to generate</p>
                    <div class="style-selector" id="styleSelector">
                        ${allStyles.map(s => `
                            <button class="style-chip ${selectedStyles.includes(s) ? 'active' : ''}" data-style="${s}">
                                ${getStyleEmoji(s)} ${s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Actions -->
                <div style="display: flex; gap: var(--space-3); margin-top: var(--space-6); flex-wrap: wrap;">
                    <button class="btn btn-primary btn-lg" id="generateFromUpload" disabled>
                        🪄 Generate Furnished Room
                    </button>
                    <button class="btn btn-accent btn-lg" id="generateFromScratch">
                        ✨ Generate from Scratch
                    </button>
                </div>
            </div>

            <!-- Results Section -->
            <div id="resultsSection" style="display:none;">
                <div id="processingState" style="display:none;">
                    <div class="processing-overlay glass-card">
                        <div class="processing-spinner"></div>
                        <div class="processing-text">AI is designing your room... ✨</div>
                        <p style="font-size: var(--text-xs); color: var(--color-text-muted);">This may take a few seconds</p>
                    </div>
                </div>

                <div id="resultsContent" style="display:none;">
                    <!-- Comparison View -->
                    <div id="comparisonView" style="display:none;">
                        <h2 style="margin-bottom: var(--space-4);">📋 Before → After</h2>
                        <div class="comparison-view">
                            <div>
                                <img id="originalImage" src="" alt="Original room">
                                <h4>📷 Original Photo</h4>
                            </div>
                            <div>
                                <img id="selectedDesignImage" src="" alt="AI design">
                                <h4 id="selectedDesignLabel">🎨 AI Design</h4>
                            </div>
                        </div>
                    </div>

                    <!-- Design Gallery -->
                    <div class="designs-gallery">
                        <h2>🎨 AI-Generated Designs <span class="badge" id="designCount">0</span></h2>
                        <p style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-6);">
                            Click on a design to select it. You can save your favorite to your profile.
                        </p>
                        <div class="designs-grid stagger-children" id="designsGrid"></div>
                    </div>

                    <!-- Save Actions -->
                    <div style="margin-top: var(--space-8); display: flex; gap: var(--space-3); flex-wrap: wrap;" id="saveActions" style="display:none;">
                        <button class="btn btn-primary" id="saveSelectedDesign" disabled>💾 Save Selected Design</button>
                        <button class="btn btn-outline" id="generateMore">🔄 Generate More Styles</button>
                        <button class="btn btn-ghost" onclick="Router.navigate('/chat')">💬 Discuss with AI</button>
                    </div>
                </div>
            </div>
        </div>`;

    renderDashboardLayout(container, 'upload', pageContent);

    // ---- Upload logic ----
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const previewDiv = document.getElementById('uploadPreview');
    const previewImg = document.getElementById('previewImage');
    const genFromUpload = document.getElementById('generateFromUpload');

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            uploadedFile = file;
            const reader = new FileReader();
            reader.onload = (ev) => {
                previewImg.src = ev.target.result;
                previewDiv.style.display = 'block';
                uploadZone.style.display = 'none';
                genFromUpload.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            uploadedFile = file;
            const reader = new FileReader();
            reader.onload = (ev) => {
                previewImg.src = ev.target.result;
                previewDiv.style.display = 'block';
                uploadZone.style.display = 'none';
                genFromUpload.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('removeImage').addEventListener('click', () => {
        uploadedFile = null;
        previewDiv.style.display = 'none';
        uploadZone.style.display = 'block';
        genFromUpload.disabled = true;
        fileInput.value = '';
    });

    // Room type chips (single select)
    document.querySelectorAll('#roomTypeSelector .style-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#roomTypeSelector .style-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedRoomType = chip.dataset.room;
        });
    });

    // Style chips
    document.querySelectorAll('#styleSelector .style-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const style = chip.dataset.style;
            if (selectedStyles.includes(style)) {
                selectedStyles = selectedStyles.filter(s => s !== style);
                chip.classList.remove('active');
            } else {
                selectedStyles.push(style);
                chip.classList.add('active');
            }
        });
    });

    // Generate from upload
    genFromUpload.addEventListener('click', async () => {
        if (!uploadedFile || selectedStyles.length === 0) {
            showToast('Please upload an image and select at least one style', 'warning');
            return;
        }
        await processDesigns(true);
    });

    // Generate from scratch
    document.getElementById('generateFromScratch').addEventListener('click', async () => {
        if (selectedStyles.length === 0) {
            showToast('Please select at least one style', 'warning');
            return;
        }
        await processDesigns(false);
    });

    async function processDesigns(fromUpload) {
        const resultsSection = document.getElementById('resultsSection');
        const processingState = document.getElementById('processingState');
        const resultsContent = document.getElementById('resultsContent');

        resultsSection.style.display = 'block';
        processingState.style.display = 'block';
        resultsContent.style.display = 'none';

        try {
            let result;
            if (fromUpload) {
                result = await API.uploadImage(uploadedFile, selectedStyles, selectedRoomType);
            } else {
                result = await API.generateRoom(selectedStyles, selectedRoomType);
            }

            generatedDesigns = result.designs || [];

            processingState.style.display = 'none';
            resultsContent.style.display = 'block';

            // Update design count
            document.getElementById('designCount').textContent = generatedDesigns.length;

            // Show comparison if from upload
            const compView = document.getElementById('comparisonView');
            if (fromUpload && result.originalUrl) {
                compView.style.display = 'block';
                document.getElementById('originalImage').src = API.imageUrl(result.originalUrl);
                if (generatedDesigns.length > 0) {
                    document.getElementById('selectedDesignImage').src = API.imageUrl(generatedDesigns[0].url);
                    document.getElementById('selectedDesignLabel').textContent = `🎨 ${generatedDesigns[0].label}`;
                }
            } else {
                compView.style.display = 'none';
            }

            // Render designs grid
            const grid = document.getElementById('designsGrid');
            grid.innerHTML = generatedDesigns.map((d, i) => `
                <div class="design-gen-card ${i === 0 ? 'selected' : ''}" data-idx="${i}" style="position:relative;">
                    <div class="design-gen-selected-check">✓</div>
                    <img src="${API.imageUrl(d.url)}" alt="${d.label}" loading="lazy">
                    <div class="design-gen-card-body">
                        <h4>${d.label}</h4>
                        <span class="badge">${d.style}</span>
                    </div>
                </div>
            `).join('');

            if (generatedDesigns.length > 0) selectedDesign = 0;
            document.getElementById('saveSelectedDesign').disabled = generatedDesigns.length === 0;

            // Card click to select
            grid.querySelectorAll('.design-gen-card').forEach(card => {
                card.addEventListener('click', () => {
                    grid.querySelectorAll('.design-gen-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    selectedDesign = parseInt(card.dataset.idx);

                    // Update comparison
                    if (compView.style.display !== 'none') {
                        const d = generatedDesigns[selectedDesign];
                        document.getElementById('selectedDesignImage').src = API.imageUrl(d.url);
                        document.getElementById('selectedDesignLabel').textContent = `🎨 ${d.label}`;
                    }
                });

                // Double click for lightbox
                card.addEventListener('dblclick', () => {
                    const idx = parseInt(card.dataset.idx);
                    showLightbox(API.imageUrl(generatedDesigns[idx].url));
                });
            });

            showToast(`${generatedDesigns.length} designs generated! 🎨`, 'success');

        } catch (err) {
            processingState.style.display = 'none';
            resultsContent.style.display = 'block';
            document.getElementById('designsGrid').innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <h3>⚠️ Could not connect to server</h3>
                    <p>Make sure the backend server is running: <code>python server.py</code></p>
                    <button class="btn btn-primary" onclick="processDesigns(false)">🔄 Retry</button>
                </div>`;
            showToast('Server connection failed. Is the backend running?', 'error');
        }
    }

    // Make processDesigns available to retry button
    window._processDesigns = processDesigns;

    // Save selected design
    document.getElementById('saveSelectedDesign').addEventListener('click', () => {
        if (selectedDesign === null || !generatedDesigns[selectedDesign]) return;
        const d = generatedDesigns[selectedDesign];
        Store.saveDesign({
            roomType: AIEngine._formatRoomType(prefs.roomType || 'bedroom'),
            roomSize: prefs.roomSize || 'medium',
            budget: `₹${(prefs.budget || 25000).toLocaleString('en-IN')}`,
            style: d.style,
            colorTheme: AIEngine._getStyleData(d.style),
            imageUrl: API.imageUrl(d.url),
            generatedId: d.id
        });
        showToast('Design saved! 💾 Check Saved Designs.', 'success');
    });

    // Generate more
    document.getElementById('generateMore').addEventListener('click', () => {
        processDesigns(!!uploadedFile);
    });
}

function getStyleEmoji(style) {
    const emojis = {
        modern: '🏢', minimalist: '🌿', boho: '🎨', aesthetic: '✨',
        luxury: '💎', traditional: '🏛️', contemporary: '🔲'
    };
    return emojis[style] || '🎨';
}

function showLightbox(imgUrl) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
        <div class="lightbox-close">✕</div>
        <img src="${imgUrl}" alt="Design preview">`;
    document.body.appendChild(lb);
    lb.querySelector('.lightbox-close').addEventListener('click', () => lb.remove());
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.remove(); });
}
