/* =========================================
   GruhaBuddy – Chat / AI Assistant Page
   ========================================= */

function renderChatPage(container) {
    const state = Store.getState();
    const user = state.user || { name: 'Guest', avatar: 'G' };

    const pageContent = `
        <header class="main-header">
            <div class="main-header-title">
                <h1>AI Design Assistant</h1>
                <p>Ask me anything about interior design</p>
            </div>
            <div class="main-header-actions">
                <button class="mobile-menu-btn" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <button class="btn btn-outline btn-sm" id="clearChatBtn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    Clear
                </button>
            </div>
        </header>
        <div class="chat-page">
            <div class="chat-messages" id="chatMessages">
                ${renderChatMessages(state.chatHistory, user)}
            </div>
            <div class="chat-input-area">
                <div class="chat-suggestions" id="chatSuggestions">
                    <button class="chat-suggestion" data-msg="Design my bedroom">🛏️ Design my bedroom</button>
                    <button class="chat-suggestion" data-msg="Suggest color palettes">🎨 Color palettes</button>
                    <button class="chat-suggestion" data-msg="Budget-friendly ideas">💰 Budget tips</button>
                    <button class="chat-suggestion" data-msg="Modern minimalist style">✨ Modern minimalist</button>
                    <button class="chat-suggestion" data-msg="Show AR preview options">📱 AR Preview</button>
                    <button class="chat-suggestion" data-msg="Eco-friendly suggestions">🌿 Eco-friendly</button>
                </div>
                <div class="chat-input-wrapper">
                    <textarea class="chat-input-field" id="chatInput" placeholder="Ask me about your room design..." rows="1"></textarea>
                    <button class="chat-send-btn" id="chatSendBtn" aria-label="Send">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        </div>`;

    renderDashboardLayout(container, 'chat', pageContent);

    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    // If no messages, show welcome
    if (state.chatHistory.length === 0) {
        const welcomeMsg = AIEngine.processMessage('hello');
        Store.addMessage({ role: 'assistant', content: welcomeMsg.text, type: 'text' });
        appendAssistantMessage(chatMessages, welcomeMsg.text, user);
    }

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    // Send on Enter
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    chatSendBtn.addEventListener('click', sendMessage);

    // Quick suggestions
    document.querySelectorAll('.chat-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.dataset.msg;
            sendMessage();
        });
    });

    // Clear chat
    document.getElementById('clearChatBtn').addEventListener('click', () => {
        if (confirm('Clear all chat messages?')) {
            Store.clearChat();
            chatMessages.innerHTML = '';
            const welcomeMsg = AIEngine.processMessage('hello');
            Store.addMessage({ role: 'assistant', content: welcomeMsg.text, type: 'text' });
            appendAssistantMessage(chatMessages, welcomeMsg.text, user);
        }
    });

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User message
        Store.addMessage({ role: 'user', content: text, type: 'text' });
        appendUserMessage(chatMessages, text, user);
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Hide suggestions after first message
        const suggestionsEl = document.getElementById('chatSuggestions');
        if (suggestionsEl) suggestionsEl.style.display = 'none';

        // Show typing indicator
        const typingEl = document.createElement('div');
        typingEl.className = 'chat-message assistant';
        typingEl.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="chat-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>`;
        chatMessages.appendChild(typingEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        getAssistantResponse(text).then(response => {
            typingEl.remove();

            if (response.type === 'design' && response.data) {
                const designHTML = renderDesignRecommendation(response.data);
                Store.addMessage({ role: 'assistant', content: designHTML, type: 'design', designData: response.data });
                appendAssistantDesign(chatMessages, designHTML, response.data, user);
            } else {
                Store.addMessage({ role: 'assistant', content: response.text, type: 'text' });
                appendAssistantMessage(chatMessages, response.text, user);
            }
        });
    }

    // Decides whether to build a structured design card locally, or ask
    // the Gemini-powered backend for a free-form conversational reply.
    async function getAssistantResponse(text) {
        const currentState = Store.getState();
        const lower = text.toLowerCase();
        const isDesignIntent = /(design|create|generate|make|suggest|recommend|plan|help me)/.test(lower)
            && currentState.onboardingComplete;

        // Structured design cards stay deterministic/local — always reliable.
        if (isDesignIntent) {
            const design = AIEngine.generateDesignResponse(currentState.preferences);
            // Small delay so it still feels like "thinking"
            await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
            return { type: 'design', data: design };
        }

        // Everything else goes to Gemini via the backend, with a local fallback.
        const recentHistory = currentState.chatHistory
            .filter(m => m.type === 'text')
            .slice(-8)
            .map(m => ({ role: m.role, content: m.content }));

        try {
            const apiResponse = await API.chat(text, currentState.preferences, recentHistory);
            if (apiResponse && apiResponse.text) {
                return { type: 'text', text: apiResponse.text };
            }
            throw new Error('Empty response from backend');
        } catch (err) {
            // Backend/Gemini unreachable — fall back to built-in assistant logic
            // so the app keeps working even offline or before a key is set.
            return AIEngine.processMessage(text);
        }
    }

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderChatMessages(messages, user) {
    if (messages.length === 0) return '';
    return messages.map(msg => {
        if (msg.role === 'user') {
            return `<div class="chat-message user">
                <div class="avatar">${user.avatar}</div>
                <div>
                    <div class="chat-bubble">${formatChatText(msg.content)}</div>
                    <div class="chat-timestamp">${formatTime(msg.timestamp)}</div>
                </div>
            </div>`;
        } else {
            if (msg.type === 'design' && msg.designData) {
                return `<div class="chat-message assistant">
                    <div class="avatar">🤖</div>
                    <div>
                        <div class="chat-bubble">
                            <p>Here's your personalized design! ✨</p>
                            ${renderDesignRecommendation(msg.designData)}
                            <div class="chat-cta-row">
                                <button class="btn btn-primary btn-sm save-design-btn">💾 Save Design</button>
                                <button class="btn btn-outline btn-sm" onclick="Router.navigate('/ar')">📱 AR Preview</button>
                                <button class="btn btn-ghost btn-sm" data-msg="Show me another style">🎨 Another Style</button>
                            </div>
                        </div>
                        <div class="chat-timestamp">${formatTime(msg.timestamp)}</div>
                    </div>
                </div>`;
            }
            return `<div class="chat-message assistant">
                <div class="avatar">🤖</div>
                <div>
                    <div class="chat-bubble">${formatChatText(msg.content)}</div>
                    <div class="chat-timestamp">${formatTime(msg.timestamp)}</div>
                </div>
            </div>`;
        }
    }).join('');
}

function appendUserMessage(container, text, user) {
    const div = document.createElement('div');
    div.className = 'chat-message user';
    div.innerHTML = `
        <div class="avatar">${user.avatar}</div>
        <div>
            <div class="chat-bubble">${escapeHTML(text)}</div>
            <div class="chat-timestamp">${formatTime(new Date().toISOString())}</div>
        </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function appendAssistantMessage(container, text, user) {
    const div = document.createElement('div');
    div.className = 'chat-message assistant';
    div.innerHTML = `
        <div class="avatar">🤖</div>
        <div>
            <div class="chat-bubble">${formatChatText(text)}</div>
            <div class="chat-timestamp">${formatTime(new Date().toISOString())}</div>
        </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function appendAssistantDesign(container, designHTML, designData, user) {
    const div = document.createElement('div');
    div.className = 'chat-message assistant';
    div.innerHTML = `
        <div class="avatar">🤖</div>
        <div>
            <div class="chat-bubble">
                <p>Here's your personalized design! ✨</p>
                ${designHTML}
                <div class="chat-cta-row">
                    <button class="btn btn-primary btn-sm save-design-btn">💾 Save Design</button>
                    <button class="btn btn-outline btn-sm" onclick="Router.navigate('/ar')">📱 AR Preview</button>
                    <button class="btn btn-ghost btn-sm another-style-btn">🎨 Another Style</button>
                </div>
            </div>
            <div class="chat-timestamp">${formatTime(new Date().toISOString())}</div>
        </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    // Attach save listener
    div.querySelector('.save-design-btn')?.addEventListener('click', () => {
        Store.saveDesign({
            roomType: designData.summary.roomType,
            roomSize: designData.summary.roomSize,
            budget: designData.summary.budget,
            style: designData.summary.style,
            colorTheme: designData.colorTheme,
            furniture: designData.furniture,
            rentalMode: designData.summary.rentalMode
        });
        showToast('Design saved! 💾 View it in Saved Designs.', 'success');
    });

    div.querySelector('.another-style-btn')?.addEventListener('click', () => {
        const input = document.getElementById('chatInput');
        if (input) {
            input.value = 'Show me another style';
            input.dispatchEvent(new Event('input'));
        }
    });
}

function renderDesignRecommendation(data) {
    const d = data;
    return `
    <div class="design-recommendation">
        <div class="design-rec-header">
            <span>✨</span>
            <h4>${d.summary.roomType} Design — ${d.summary.style} Style</h4>
        </div>
        <div class="design-rec-body">
            <!-- Room Summary -->
            <div class="design-rec-section">
                <h5>📋 Room Summary</h5>
                <ul>
                    <li><strong>Type:</strong> ${d.summary.roomType}</li>
                    <li><strong>Size:</strong> ${d.summary.roomSize}</li>
                    <li><strong>Budget:</strong> ${d.summary.budget}</li>
                    <li><strong>Style:</strong> ${d.summary.style}</li>
                    ${d.summary.rentalMode ? '<li><strong>Mode:</strong> 🎓 Rental/Student</li>' : ''}
                </ul>
            </div>

            <!-- Color Theme -->
            <div class="design-rec-section">
                <h5>🎨 Color Theme — ${d.colorTheme.mood}</h5>
                <div class="color-palette">
                    <div>
                        <div class="color-swatch" style="background:${d.colorTheme.hex.primary}"></div>
                        <div class="color-swatch-label">${d.colorTheme.primary}</div>
                    </div>
                    <div>
                        <div class="color-swatch" style="background:${d.colorTheme.hex.secondary}"></div>
                        <div class="color-swatch-label">${d.colorTheme.secondary}</div>
                    </div>
                    <div>
                        <div class="color-swatch" style="background:${d.colorTheme.hex.accent}"></div>
                        <div class="color-swatch-label">${d.colorTheme.accent}</div>
                    </div>
                </div>
            </div>

            <!-- Furniture -->
            <div class="design-rec-section">
                <h5>🪑 Furniture & Decor</h5>
                <div class="furniture-grid">
                    ${d.furniture.map(f => `
                        <div class="furniture-item">
                            <div class="furniture-item-icon">${f.icon}</div>
                            <div class="furniture-item-name">${f.name}</div>
                            <div class="furniture-item-price">₹${f.price.toLocaleString('en-IN')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Budget Split -->
            <div class="design-rec-section">
                <h5>💰 Smart Budget Split</h5>
                <div class="budget-bar">
                    ${Object.values(d.budgetSplit).map(b => `
                        <div class="budget-bar-segment" style="width:${b.percent}%; background:${b.color}"></div>
                    `).join('')}
                </div>
                <div class="budget-legend">
                    ${Object.values(d.budgetSplit).map(b => `
                        <div class="budget-legend-item">
                            <div class="budget-legend-dot" style="background:${b.color}"></div>
                            ${b.label}: ₹${b.amount.toLocaleString('en-IN')} (${b.percent}%)
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Layout Tips -->
            <div class="design-rec-section">
                <h5>📐 Layout & Space Tips</h5>
                <ul>
                    ${d.layoutTips.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>

            <!-- Before/After -->
            <div class="design-rec-section">
                <h5>✅ Before vs After</h5>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                    <div>
                        <p style="font-weight:600; color: var(--color-error); margin-bottom: var(--space-2);">❌ Before</p>
                        <ul>${d.beforeAfter.before.map(b => `<li>${b}</li>`).join('')}</ul>
                    </div>
                    <div>
                        <p style="font-weight:600; color: var(--color-success); margin-bottom: var(--space-2);">✅ After</p>
                        <ul>${d.beforeAfter.after.map(a => `<li>${a}</li>`).join('')}</ul>
                    </div>
                </div>
            </div>

            <!-- Sustainability -->
            <div class="design-rec-section">
                <h5>🌱 Sustainability Tips</h5>
                <ul>
                    ${d.sustainability.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>

            <!-- AR Items -->
            <div class="design-rec-section">
                <h5>📱 AR-Ready Items</h5>
                <div class="furniture-grid">
                    ${d.arItems.map(a => `
                        <div class="furniture-item">
                            <div class="furniture-item-icon">${a.icon}</div>
                            <div class="furniture-item-name">${a.name}</div>
                            <div class="furniture-item-price" style="color: var(--color-info);">${a.sizeFit}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

// ---- Utilities ----
function formatChatText(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/• /g, '&bull; ');
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
