/* =========================================
   GruhaBuddy – AI Engine (Mock AI Logic)
   ========================================= */

const AIEngine = {
    // Generate structured design response based on preferences
    generateDesignResponse(preferences) {
        const { roomType, roomSize, budget, style, rentalMode } = preferences;

        const styleData = this._getStyleData(style);
        const furnitureList = this._getFurniture(roomType, roomSize, budget, rentalMode);
        const budgetSplit = this._getBudgetSplit(budget);
        const layoutTips = this._getLayoutTips(roomType, roomSize);
        const sustainabilityTips = this._getSustainabilityTips();
        const arItems = this._getARItems(furnitureList);

        return {
            type: 'design',
            summary: {
                roomType: this._formatRoomType(roomType),
                roomSize: roomSize,
                budget: `₹${budget.toLocaleString('en-IN')}`,
                style: style,
                rentalMode: rentalMode
            },
            colorTheme: {
                primary: styleData.primary,
                secondary: styleData.secondary,
                accent: styleData.accent,
                mood: styleData.mood,
                hex: styleData.hex
            },
            furniture: furnitureList,
            layoutTips: layoutTips,
            budgetSplit: budgetSplit,
            arItems: arItems,
            beforeAfter: {
                before: [
                    'Cluttered floor space with poor layout',
                    'Inadequate lighting causing dull atmosphere',
                    'No cohesive color theme'
                ],
                after: [
                    `Clean ${style} look with optimized space`,
                    'Layered lighting for warm, inviting ambiance',
                    `Harmonious ${styleData.mood.toLowerCase()} color palette`
                ]
            },
            sustainability: sustainabilityTips
        };
    },

    // Process user chat message
    processMessage(userMessage) {
        const lower = userMessage.toLowerCase();
        const state = Store.getState();

        // Greeting / small talk
        if (lower.match(/^(hi|hello|hey|hii+|namaste|good\s*(morning|evening|afternoon))/)) {
            const name = state.user?.name || 'there';
            return {
                type: 'text',
                text: `Hello ${name}! 👋 Welcome to GruhaBuddy.\n\nI'm your AI interior design assistant. I can help you design any room — from cozy bedrooms to productive study spaces.\n\nTo get started, could you tell me:\n1. **What room** would you like to design?\n2. **What's your budget** range?\n3. **Any style preference** (modern, minimalist, boho, etc.)?`
            };
        }

        // Budget questions
        if (lower.match(/(budget|cheap|affordable|low.?cost|expensive|price)/)) {
            return {
                type: 'text',
                text: `Great question about budgeting! 💰\n\nHere's how I'd recommend splitting your budget:\n\n• **40%** – Core furniture (bed/sofa, desk)\n• **25%** – Storage solutions\n• **20%** – Lighting fixtures\n• **15%** – Paint, decor & accessories\n\nWould you like me to create a design within a specific budget? Just tell me the amount!`
            };
        }

        // Style questions
        if (lower.match(/(style|modern|minimalist|boho|aesthetic|luxury|traditional|contemporary)/)) {
            const matchedStyle = lower.match(/(modern|minimalist|boho|aesthetic|luxury|traditional|contemporary)/);
            if (matchedStyle) {
                const sd = this._getStyleData(matchedStyle[1]);
                return {
                    type: 'text',
                    text: `Love the **${matchedStyle[1]}** style choice! ✨\n\nHere's what that means for your room:\n• **Color Palette**: ${sd.mood}\n• **Primary**: ${sd.primary}\n• **Key Elements**: ${sd.elements}\n\nWant me to generate a complete design with this style?`
                };
            }
            return {
                type: 'text',
                text: `I can design in many styles! Here are the popular ones:\n\n🏢 **Modern** – Clean lines, neutral tones\n🌿 **Minimalist** – Less is more, functional beauty\n🎨 **Boho** – Eclectic, colorful, textured\n💎 **Luxury** – Premium materials, rich colors\n🏛️ **Traditional** – Classic, warm, timeless\n✨ **Aesthetic** – Trendy, Instagram-worthy\n\nWhich one speaks to you?`
            };
        }

        // Room type
        if (lower.match(/(bedroom|living\s*room|kitchen|study|hostel|pg|bathroom|dining|office)/)) {
            const roomMatch = lower.match(/(bedroom|living\s*room|kitchen|study|hostel|pg|bathroom|dining|office)/);
            return {
                type: 'text',
                text: `A **${roomMatch[1]}** — great choice! 🏠\n\nTo give you the best design, I need a few more details:\n\n1. **Size**: Small (< 120 sq ft), Medium (120-200 sq ft), or Large (200+ sq ft)?\n2. **Budget**: What's your comfortable range?\n3. **Style preference**: Modern, minimalist, boho, or any other?\n4. **Rental/Student setup?** (no-drill, temporary solutions)\n\nTell me and I'll craft the perfect design!`
            };
        }

        // Generate design intent
        if (lower.match(/(design|create|generate|make|suggest|recommend|plan|help me)/)) {
            if (state.onboardingComplete) {
                const design = this.generateDesignResponse(state.preferences);
                return { type: 'design', data: design };
            }
            return {
                type: 'text',
                text: `I'd love to create a design for you! 🎨\n\nLet me understand your needs first:\n\n1. 🏠 **Room type?** (bedroom, living room, kitchen, study, hostel/PG)\n2. 📐 **Room size?** (small / medium / large)\n3. 💰 **Budget range?**\n4. 🎨 **Style preference?** (modern, minimalist, boho, aesthetic, luxury)\n5. 🔧 **Rental mode?** (temporary setup, no drilling)\n\nShare these and I'll create a detailed plan!`
            };
        }

        // AR
        if (lower.match(/(ar|augmented|visuali[sz]e|preview|3d|view)/)) {
            return {
                type: 'text',
                text: `Great idea! 📱 **AR Visualization** lets you see furniture in your actual room before buying.\n\nHere's what you can preview:\n• 🛏️ Beds & Sofas\n• 🪑 Chairs & Desks\n• 💡 Lamps & Lighting\n• 🪴 Plants & Decor\n\nWould you like me to suggest items for AR preview? Or navigate to the AR View section?`
            };
        }

        // Save design
        if (lower.match(/(save|bookmark|keep|store)/)) {
            return {
                type: 'text',
                text: `Absolutely! 💾 I can save your current design to your profile.\n\nYou can access saved designs anytime from the **Saved Designs** section in the sidebar.\n\nWant me to save the latest design?`
            };
        }

        // Sustainability
        if (lower.match(/(eco|green|sustain|environment|nature|plant|energy)/)) {
            return {
                type: 'text',
                text: `Love the eco-conscious thinking! 🌱\n\n**Sustainability Tips for Your Room:**\n\n🌞 **Natural Light** – Position desk near windows\n💡 **LED Lighting** – 75% less energy usage\n🪴 **Indoor Plants** – Snake plant, pothos for air purification\n♻️ **Reclaimed Wood** – For shelves and decor\n🧹 **Minimal Waste** – Multi-purpose furniture reduces need for extras\n\nI always include eco-friendly options in my designs!`
            };
        }

        // Thank you / ending
        if (lower.match(/(thanks|thank you|great|awesome|perfect|nice|cool)/)) {
            return {
                type: 'text',
                text: `You're welcome! 😊 Happy to help make your space beautiful.\n\n**Would you like to:**\n• 💾 Save this design\n• 📱 View items in AR\n• 🎨 Explore another style or room\n• 🏠 Go back to Dashboard\n\nI'm here whenever you need design help!`
            };
        }

        // Default response
        return {
            type: 'text',
            text: `That's an interesting thought! 🤔\n\nI specialize in interior design, so I can help you with:\n\n• 🏠 **Room Design** – Full layout & furniture suggestions\n• 🎨 **Color Palettes** – Perfect theme for your space\n• 💰 **Budget Planning** – Smart spending for max impact\n• 📱 **AR Preview** – Visualize before buying\n• 🌿 **Eco-Friendly** – Sustainable design options\n\nTry telling me about the room you want to design!`
        };
    },

    // ---- Helper Functions ----
    _formatRoomType(type) {
        const map = {
            bedroom: 'Bedroom', livingroom: 'Living Room', kitchen: 'Kitchen',
            study: 'Study Room', hostel: 'Hostel / PG Room', bathroom: 'Bathroom',
            dining: 'Dining Room', office: 'Home Office'
        };
        return map[type] || type;
    },

    _getStyleData(style) {
        const styles = {
            modern: {
                primary: 'Slate Gray', secondary: 'Cloud White', accent: 'Electric Blue',
                mood: 'Sleek & Sophisticated', elements: 'Clean lines, metal accents, geometric shapes',
                hex: { primary: '#475569', secondary: '#f1f5f9', accent: '#3b82f6' }
            },
            minimalist: {
                primary: 'Warm White', secondary: 'Soft Beige', accent: 'Muted Sage',
                mood: 'Calm & Serene', elements: 'Essential pieces only, hidden storage, neutral tones',
                hex: { primary: '#fafaf9', secondary: '#e7e5e4', accent: '#84cc16' }
            },
            boho: {
                primary: 'Terracotta', secondary: 'Cream', accent: 'Mustard Gold',
                mood: 'Warm & Eclectic', elements: 'Woven textures, patterns, layered rugs',
                hex: { primary: '#c2410c', secondary: '#fef3c7', accent: '#d97706' }
            },
            aesthetic: {
                primary: 'Blush Pink', secondary: 'Cloud Gray', accent: 'Rose Gold',
                mood: 'Dreamy & Trending', elements: 'LED lights, mirrors, minimal clutter',
                hex: { primary: '#fda4af', secondary: '#e2e8f0', accent: '#f59e0b' }
            },
            luxury: {
                primary: 'Deep Navy', secondary: 'Champagne Gold', accent: 'Emerald Green',
                mood: 'Opulent & Grand', elements: 'Velvet, marble, metallic accents',
                hex: { primary: '#1e293b', secondary: '#fbbf24', accent: '#059669' }
            },
            traditional: {
                primary: 'Walnut Brown', secondary: 'Ivory', accent: 'Burgundy',
                mood: 'Warm & Timeless', elements: 'Wood carvings, classic patterns, warm tones',
                hex: { primary: '#78350f', secondary: '#fffbeb', accent: '#991b1b' }
            },
            contemporary: {
                primary: 'Charcoal', secondary: 'Light Gray', accent: 'Teal',
                mood: 'Fresh & Current', elements: 'Mixed materials, open spaces, bold art',
                hex: { primary: '#374151', secondary: '#f3f4f6', accent: '#14b8a6' }
            }
        };
        return styles[style] || styles.modern;
    },

    _getFurniture(roomType, roomSize, budget, rentalMode) {
        const isSmall = roomSize === 'small';
        const isBudget = budget < 15000;
        const items = [];

        const furnitureDB = {
            bedroom: [
                { icon: '🛏️', name: isSmall ? 'Foldable Sofa-cum-Bed' : 'Queen-Size Bed', price: isBudget ? 5000 : 12000, arReady: true, size: 'fits ' + roomSize + ' rooms' },
                { icon: '🪟', name: 'Bedside Table', price: isBudget ? 800 : 2500, arReady: true, size: 'compact' },
                { icon: '🗄️', name: isSmall ? 'Under-Bed Storage Box' : 'Wardrobe', price: isBudget ? 1500 : 8000, arReady: true, size: roomSize },
                { icon: '💡', name: 'Warm Bedside Lamp', price: isBudget ? 400 : 1500, arReady: true, size: 'compact' },
                { icon: '🪞', name: 'Wall Mirror (space enhancing)', price: 1200, arReady: true, size: 'medium' },
                { icon: '🪴', name: 'Indoor Plant (Snake Plant)', price: 400, arReady: false, size: 'small' },
                { icon: '🖼️', name: 'Wall Art (2-piece set)', price: isBudget ? 500 : 2000, arReady: false, size: 'small' },
                { icon: '🔲', name: 'Area Rug', price: isBudget ? 800 : 3000, arReady: true, size: roomSize }
            ],
            livingroom: [
                { icon: '🛋️', name: isSmall ? 'Compact 2-Seater Sofa' : 'L-Shaped Sofa', price: isBudget ? 8000 : 20000, arReady: true, size: roomSize },
                { icon: '☕', name: 'Coffee Table', price: isBudget ? 1500 : 5000, arReady: true, size: roomSize },
                { icon: '📺', name: 'TV Unit / Entertainment Center', price: isBudget ? 3000 : 10000, arReady: true, size: roomSize },
                { icon: '💡', name: 'LED Ceiling Light', price: 2000, arReady: false, size: 'ceiling mount' },
                { icon: '🪴', name: 'Tall Indoor Plant', price: 600, arReady: true, size: 'medium' },
                { icon: '🪞', name: 'Decorative Wall Mirror', price: 1500, arReady: true, size: 'large' },
                { icon: '🖼️', name: 'Gallery Wall Art Set', price: 2500, arReady: false, size: 'medium' },
                { icon: '🔲', name: 'Statement Rug', price: isBudget ? 1500 : 5000, arReady: true, size: roomSize }
            ],
            study: [
                { icon: '🪑', name: rentalMode ? 'Foldable Study Chair' : 'Ergonomic Office Chair', price: isBudget ? 2000 : 8000, arReady: true, size: 'compact' },
                { icon: '📚', name: isSmall ? 'Wall-Mounted Desk' : 'L-Shaped Study Desk', price: isBudget ? 2500 : 7000, arReady: true, size: roomSize },
                { icon: '📖', name: 'Bookshelf / Wall Shelves', price: isBudget ? 1200 : 4000, arReady: true, size: roomSize },
                { icon: '💡', name: 'LED Desk Lamp', price: 800, arReady: true, size: 'compact' },
                { icon: '🖥️', name: 'Monitor Stand', price: 600, arReady: true, size: 'compact' },
                { icon: '🪴', name: 'Desk Plant (Pothos)', price: 250, arReady: false, size: 'small' }
            ],
            kitchen: [
                { icon: '🗄️', name: 'Modular Shelf Unit', price: isBudget ? 3000 : 8000, arReady: true, size: roomSize },
                { icon: '🪑', name: 'Kitchen Stools (set of 2)', price: 2500, arReady: true, size: 'compact' },
                { icon: '💡', name: 'Under-Cabinet LED Strip', price: 800, arReady: false, size: 'adjustable' },
                { icon: '🫕', name: 'Wall-Mounted Pot Rack', price: 1200, arReady: false, size: 'medium' },
                { icon: '🪴', name: 'Herb Planter', price: 400, arReady: false, size: 'small' }
            ],
            hostel: [
                { icon: '🛏️', name: 'Single Bed with Storage', price: 4000, arReady: true, size: 'small' },
                { icon: '📚', name: 'Compact Wall Shelf (no drill)', price: 800, arReady: true, size: 'small' },
                { icon: '💡', name: 'Clip-On LED Light', price: 350, arReady: true, size: 'portable' },
                { icon: '🗄️', name: 'Foldable Storage Ottoman', price: 1200, arReady: true, size: 'compact' },
                { icon: '🪞', name: 'Adhesive Door Mirror', price: 600, arReady: false, size: 'door-mount' },
                { icon: '🔲', name: 'Small Comfort Rug', price: 500, arReady: true, size: 'small' }
            ]
        };

        return furnitureDB[roomType] || furnitureDB.bedroom;
    },

    _getBudgetSplit(budget) {
        return {
            furniture: { label: 'Furniture', percent: 40, amount: Math.round(budget * 0.4), color: '#14b8a6' },
            storage: { label: 'Storage', percent: 25, amount: Math.round(budget * 0.25), color: '#3b82f6' },
            lighting: { label: 'Lighting', percent: 20, amount: Math.round(budget * 0.2), color: '#f59e0b' },
            decor: { label: 'Paint & Decor', percent: 15, amount: Math.round(budget * 0.15), color: '#ec4899' }
        };
    },

    _getLayoutTips(roomType, roomSize) {
        const tips = [
            '💡 Place mirrors opposite windows to maximize natural light',
            '📐 Leave at least 2-3 feet of walking space between furniture',
            '🧱 Utilize vertical wall space with floating shelves',
            '🪟 Don\'t block windows — keep the area within 1 foot clear'
        ];
        if (roomSize === 'small') {
            tips.push('🔲 Use multi-purpose furniture to save floor space');
            tips.push('🎨 Light colors on walls make the room appear larger');
        }
        if (roomType === 'study') {
            tips.push('💻 Position desk facing the door or window for better focus');
        }
        return tips;
    },

    _getSustainabilityTips() {
        return [
            '🌞 Maximize natural light — position workspaces near windows',
            '💡 Use LED bulbs — saves 75% energy vs incandescent',
            '🪴 Add indoor plants — they purify air naturally',
            '♻️ Choose reclaimed wood or bamboo for furniture',
            '🌡️ Use thick curtains for insulation — reduces AC usage'
        ];
    },

    _getARItems(furnitureList) {
        return furnitureList
            .filter(item => item.arReady)
            .map(item => ({
                icon: item.icon,
                name: item.name,
                sizeFit: item.size,
                note: 'Preview in your room before buying'
            }));
    }
};
