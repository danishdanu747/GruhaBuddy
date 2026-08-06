/* =========================================
   GruhaBuddy – Live Camera / AR Page
   ========================================= */

function renderCameraPage(container) {
    const state = Store.getState();
    const prefs = state.preferences;
    let stream = null;
    let isCapturing = false;
    let selectedStyle = prefs.style || 'modern';
    let selectedFurniture = 'sofa';

    const pageContent = `
        <header class="main-header">
            <div class="main-header-title">
                <h1>📱 Live AR Camera</h1>
                <p>See furniture in your room in real-time</p>
            </div>
            <div class="main-header-actions">
                <button class="mobile-menu-btn" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>
        </header>
        <div class="page-content">
            <!-- Camera Section -->
            <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-3);">
                    <h2>🎥 Camera Feed</h2>
                    <div style="display: flex; gap: var(--space-2);">
                        <button class="btn btn-primary" id="startCameraBtn">
                            📷 Start Camera
                        </button>
                        <button class="btn btn-outline" id="stopCameraBtn" style="display:none;">
                            ⏹ Stop
                        </button>
                        <button class="btn btn-outline" id="switchCameraBtn" style="display:none;" title="Switch camera">
                            🔄
                        </button>
                    </div>
                </div>

                <!-- Camera View -->
                <div id="cameraView" style="display:none;">
                    <div class="camera-container">
                        <video id="cameraVideo" autoplay playsinline muted></video>
                        <canvas id="cameraCanvas"></canvas>
                        <div class="camera-overlay">
                            <button class="camera-capture-btn" id="captureBtn" title="Capture frame"></button>
                        </div>
                    </div>

                    <!-- Controls -->
                    <div class="camera-controls">
                        <div>
                            <label style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-1); display:block;">Style</label>
                            <select id="cameraStyle">
                                <option value="modern" ${selectedStyle === 'modern' ? 'selected' : ''}>🏢 Modern</option>
                                <option value="minimalist" ${selectedStyle === 'minimalist' ? 'selected' : ''}>🌿 Minimalist</option>
                                <option value="boho" ${selectedStyle === 'boho' ? 'selected' : ''}>🎨 Boho</option>
                                <option value="aesthetic" ${selectedStyle === 'aesthetic' ? 'selected' : ''}>✨ Aesthetic</option>
                                <option value="luxury" ${selectedStyle === 'luxury' ? 'selected' : ''}>💎 Luxury</option>
                                <option value="traditional" ${selectedStyle === 'traditional' ? 'selected' : ''}>🏛️ Traditional</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-1); display:block;">Furniture</label>
                            <select id="cameraFurniture">
                                <option value="sofa">🛋️ Sofa</option>
                                <option value="table">☕ Table</option>
                                <option value="lamp">💡 Lamp</option>
                                <option value="plant">🪴 Plant</option>
                            </select>
                        </div>
                        <button class="btn btn-accent btn-sm" id="autoProcessBtn">
                            ⚡ Auto-Process
                        </button>
                    </div>
                </div>

                <!-- Permission denied state -->
                <div id="cameraPermission" style="display:none;">
                    <div class="camera-permission">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                        <h3>Camera Access Required</h3>
                        <p style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-4);">
                            Please allow camera access to use the AR preview feature. Make sure you're running through <code>localhost</code> (not file://).
                        </p>
                        <button class="btn btn-primary" id="retryCamera">🔄 Try Again</button>
                    </div>
                </div>

                <!-- Initial state -->
                <div id="cameraInitial">
                    <div class="camera-permission">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:48px;height:48px;color:var(--color-text-muted);margin-bottom:var(--space-4)">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                        <h3>Ready to Preview</h3>
                        <p style="color: var(--color-text-secondary); font-size: var(--text-sm); max-width: 400px; margin: 0 auto var(--space-4);">
                            Click "Start Camera" to open your camera feed. Point at your room and capture frames to see AI-styled furniture overlays.
                        </p>
                        <div style="display: flex; gap: var(--space-2); justify-content:center; flex-wrap:wrap;">
                            <span class="badge">📷 Camera capture</span>
                            <span class="badge badge-accent">🎨 Style overlay</span>
                            <span class="badge">🛋️ Furniture preview</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Captured Results -->
            <div class="glass-card" style="padding: var(--space-6);" id="captureResults" style="display:none;">
                <h2 style="margin-bottom: var(--space-4);">📸 Captured Frames</h2>
                <p style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-6);">
                    Your AI-processed camera captures will appear here. Click to enlarge.
                </p>
                <div class="designs-grid" id="capturedGrid"></div>
                <div class="empty-state" id="noCapturesMsg">
                    <p style="color: var(--color-text-muted);">No captures yet. Start the camera and click the capture button!</p>
                </div>
            </div>
        </div>`;

    renderDashboardLayout(container, 'camera', pageContent);

    let facingMode = 'environment'; // rear camera
    let autoProcessInterval = null;
    const captures = [];

    // ---- Camera Logic ----
    const startBtn = document.getElementById('startCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    const switchBtn = document.getElementById('switchCameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');

    startBtn.addEventListener('click', startCamera);
    stopBtn.addEventListener('click', stopCamera);
    document.getElementById('retryCamera')?.addEventListener('click', startCamera);

    switchBtn.addEventListener('click', () => {
        facingMode = facingMode === 'environment' ? 'user' : 'environment';
        stopCamera();
        setTimeout(startCamera, 300);
    });

    captureBtn.addEventListener('click', captureFrame);

    document.getElementById('cameraStyle').addEventListener('change', (e) => {
        selectedStyle = e.target.value;
    });
    document.getElementById('cameraFurniture').addEventListener('change', (e) => {
        selectedFurniture = e.target.value;
    });

    // Auto-process toggle
    let autoProcessing = false;
    document.getElementById('autoProcessBtn').addEventListener('click', () => {
        autoProcessing = !autoProcessing;
        const btn = document.getElementById('autoProcessBtn');
        if (autoProcessing) {
            btn.textContent = '⏸ Stop Auto';
            btn.classList.remove('btn-accent');
            btn.classList.add('btn-outline');
            autoProcessInterval = setInterval(captureFrame, 3000); // every 3s
        } else {
            btn.textContent = '⚡ Auto-Process';
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-accent');
            if (autoProcessInterval) clearInterval(autoProcessInterval);
        }
    });

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            video.srcObject = stream;
            document.getElementById('cameraView').style.display = 'block';
            document.getElementById('cameraInitial').style.display = 'none';
            document.getElementById('cameraPermission').style.display = 'none';
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
            switchBtn.style.display = 'inline-flex';

            showToast('Camera started! 📷 Point at your room.', 'success');
        } catch (err) {
            console.error('Camera error:', err);
            document.getElementById('cameraInitial').style.display = 'none';
            document.getElementById('cameraPermission').style.display = 'block';
            showToast('Camera access denied or unavailable', 'error');
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        video.srcObject = null;
        document.getElementById('cameraView').style.display = 'none';
        document.getElementById('cameraInitial').style.display = 'block';
        startBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'none';
        switchBtn.style.display = 'none';

        if (autoProcessInterval) {
            clearInterval(autoProcessInterval);
            autoProcessing = false;
            const btn = document.getElementById('autoProcessBtn');
            btn.textContent = '⚡ Auto-Process';
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-accent');
        }
    }

    async function captureFrame() {
        if (!stream || isCapturing) return;
        isCapturing = true;

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            try {
                const resultBlob = await API.processCameraFrame(blob, selectedStyle, selectedFurniture);
                const url = URL.createObjectURL(resultBlob);

                captures.push({
                    url,
                    style: selectedStyle,
                    furniture: selectedFurniture,
                    timestamp: new Date().toLocaleTimeString()
                });

                renderCaptures();
                showToast(`Frame processed! ${selectedStyle} + ${selectedFurniture}`, 'success');
            } catch (err) {
                // Fallback: just show the raw captured frame
                const rawUrl = canvas.toDataURL('image/jpeg', 0.85);
                captures.push({
                    url: rawUrl,
                    style: selectedStyle,
                    furniture: selectedFurniture,
                    timestamp: new Date().toLocaleTimeString(),
                    raw: true
                });
                renderCaptures();
                showToast('Captured! (Server offline — showing raw frame)', 'info');
            }
            isCapturing = false;
        }, 'image/jpeg', 0.85);
    }

    function renderCaptures() {
        const grid = document.getElementById('capturedGrid');
        const noMsg = document.getElementById('noCapturesMsg');

        if (captures.length === 0) {
            noMsg.style.display = 'flex';
            grid.innerHTML = '';
            return;
        }

        noMsg.style.display = 'none';
        grid.innerHTML = captures.map((c, i) => `
            <div class="design-gen-card" style="cursor:pointer;" onclick="showLightbox('${c.url}')">
                <img src="${c.url}" alt="Capture ${i + 1}" style="height:180px; object-fit:cover;">
                <div class="design-gen-card-body">
                    <h4>${c.raw ? '📷' : '🎨'} ${c.style} + ${c.furniture}</h4>
                    <span class="badge">${c.timestamp}</span>
                </div>
            </div>
        `).join('');
    }

    // Cleanup on page leave
    window._cleanupCamera = stopCamera;
}
