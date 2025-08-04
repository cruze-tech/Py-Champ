const SVGAssets = {
    world_map: `
        <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#98FB98;stop-opacity:1" />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
            </defs>

            <!-- Background -->
            <rect width="800" height="400" fill="url(#bgGradient)"/>
            
            <!-- Decorative clouds -->
            <circle cx="150" cy="60" r="25" fill="#ffffff" opacity="0.3"/>
            <circle cx="650" cy="80" r="30" fill="#ffffff" opacity="0.25"/>
            <circle cx="400" cy="50" r="20" fill="#ffffff" opacity="0.35"/>
            
            <!-- Path connections -->
            <path d="M 150 200 Q 200 150 250 120" stroke="#2980b9" stroke-width="6" fill="none" opacity="0.7" stroke-linecap="round"/>
            <path d="M 280 120 Q 350 150 400 200" stroke="#2980b9" stroke-width="6" fill="none" opacity="0.7" stroke-linecap="round"/>
            <path d="M 430 200 Q 500 150 550 120" stroke="#2980b9" stroke-width="6" fill="none" opacity="0.7" stroke-linecap="round"/>
            <path d="M 580 120 Q 650 150 700 200" stroke="#2980b9" stroke-width="6" fill="none" opacity="0.7" stroke-linecap="round"/>
            
            <!-- Level nodes with proper spacing -->
            <g id="map-node-1" class="level-node" transform="translate(150,200)" data-level="1">
                <circle r="35" fill="#3498db" stroke="#2980b9" stroke-width="4" filter="url(#shadow)"/>
                <text x="0" y="8" text-anchor="middle" font-size="20" font-weight="bold" fill="#ffffff">1</text>
                <text x="0" y="65" text-anchor="middle" font-size="12" font-weight="bold" fill="#2c3e50">Hello Python</text>
            </g>
            
            <g id="map-node-2" class="level-node" transform="translate(250,120)" data-level="2">
                <circle r="35" fill="#95a5a6" stroke="#7f8c8d" stroke-width="4" filter="url(#shadow)"/>
                <text x="0" y="8" text-anchor="middle" font-size="20" font-weight="bold" fill="#ffffff">2</text>
                <text x="0" y="65" text-anchor="middle" font-size="12" font-weight="bold" fill="#2c3e50">Variables</text>
            </g>
            
            <g id="map-node-3" class="level-node" transform="translate(400,200)" data-level="3">
                <circle r="35" fill="#95a5a6" stroke="#7f8c8d" stroke-width="4" filter="url(#shadow)"/>
                <text x="0" y="8" text-anchor="middle" font-size="20" font-weight="bold" fill="#ffffff">3</text>
                <text x="0" y="65" text-anchor="middle" font-size="12" font-weight="bold" fill="#2c3e50">User Input</text>
            </g>
            
            <g id="map-node-4" class="level-node" transform="translate(550,120)" data-level="4">
                <circle r="35" fill="#95a5a6" stroke="#7f8c8d" stroke-width="4" filter="url(#shadow)"/>
                <text x="0" y="8" text-anchor="middle" font-size="20" font-weight="bold" fill="#ffffff">4</text>
                <text x="0" y="65" text-anchor="middle" font-size="12" font-weight="bold" fill="#2c3e50">Conditions</text>
            </g>
            
            <g id="map-node-5" class="level-node" transform="translate(700,200)" data-level="5">
                <circle r="35" fill="#95a5a6" stroke="#7f8c8d" stroke-width="4" filter="url(#shadow)"/>
                <text x="0" y="8" text-anchor="middle" font-size="20" font-weight="bold" fill="#ffffff">5</text>
                <text x="0" y="65" text-anchor="middle" font-size="12" font-weight="bold" fill="#2c3e50">Loops</text>
            </g>
        </svg>
    `,
    
    scene_level_1: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="skyGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
                </linearGradient>
                <filter id="textShadow1">
                    <feDropShadow dx="2" dy="2" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
            </defs>
            <rect width="400" height="300" fill="url(#skyGrad1)"/>
            <circle cx="350" cy="50" r="30" fill="#FFD700" opacity="0.8">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
            </circle>
            <rect x="0" y="250" width="400" height="50" fill="#228B22"/>
            
            <!-- Python mascot -->
            <g transform="translate(50, 120)">
                <ellipse cx="0" cy="20" rx="25" ry="30" fill="#3776ab"/>
                <ellipse cx="0" cy="20" rx="15" ry="20" fill="#ffd43b"/>
                <circle cx="-8" cy="12" r="3" fill="#3776ab"/>
                <circle cx="8" cy="28" r="3" fill="#ffd43b"/>
            </g>
            
            <text x="200" y="160" text-anchor="middle" font-size="20" font-weight="bold" fill="#2c3e50" filter="url(#textShadow1)">
                Hello Python World!
            </text>
            <text x="200" y="185" text-anchor="middle" font-size="14" fill="#34495e">
                Your first Python program
            </text>
        </svg>
    `,

    scene_level_2: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="skyGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#4ECDC4;stop-opacity:0.3" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#skyGrad2)"/>
            <rect x="0" y="250" width="400" height="50" fill="#2ECC71"/>
            
            <!-- Math symbols floating -->
            <text x="80" y="80" font-size="30" fill="#E74C3C" opacity="0.7">+</text>
            <text x="320" y="120" font-size="30" fill="#3498DB" opacity="0.7">-</text>
            <text x="150" y="200" font-size="30" fill="#F39C12" opacity="0.7">×</text>
            <text x="280" y="180" font-size="30" fill="#9B59B6" opacity="0.7">÷</text>
            
            <!-- Variables boxes -->
            <rect x="50" y="140" width="60" height="40" fill="#3498DB" rx="5"/>
            <text x="80" y="165" text-anchor="middle" font-size="16" fill="white" font-weight="bold">a = 5</text>
            
            <rect x="290" y="140" width="60" height="40" fill="#E74C3C" rx="5"/>
            <text x="320" y="165" text-anchor="middle" font-size="16" fill="white" font-weight="bold">b = 3</text>
            
            <text x="200" y="220" text-anchor="middle" font-size="18" font-weight="bold" fill="#2c3e50">
                Variables & Math Operations
            </text>
        </svg>
    `,

    scene_level_3: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="skyGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.4" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.4" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#skyGrad3)"/>
            <rect x="0" y="250" width="400" height="50" fill="#8E44AD"/>
            
            <!-- Computer/keyboard -->
            <rect x="100" y="120" width="200" height="100" fill="#34495E" rx="10"/>
            <rect x="110" y="130" width="180" height="60" fill="#2C3E50" rx="5"/>
            
            <!-- Input prompt -->
            <text x="200" y="155" text-anchor="middle" font-size="12" fill="#1ABC9C">What is your name?</text>
            <rect x="120" y="165" width="160" height="20" fill="#ECF0F1" rx="3"/>
            <text x="130" y="178" font-size="12" fill="#2C3E50">Type here...</text>
            
            <!-- Blinking cursor -->
            <rect x="210" y="168" width="2" height="14" fill="#E74C3C">
                <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
            </rect>
            
            <text x="200" y="240" text-anchor="middle" font-size="18" font-weight="bold" fill="#2c3e50">
                User Input & Interaction
            </text>
        </svg>
    `,

    scene_level_4: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="skyGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#f093fb;stop-opacity:0.4" />
                    <stop offset="100%" style="stop-color:#f5576c;stop-opacity:0.4" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#skyGrad4)"/>
            <rect x="0" y="250" width="400" height="50" fill="#E67E22"/>
            
            <!-- Decision tree -->
            <circle cx="200" cy="80" r="30" fill="#3498DB"/>
            <text x="200" y="88" text-anchor="middle" font-size="14" fill="white" font-weight="bold">IF</text>
            
            <!-- Arrows -->
            <path d="M 170 110 L 120 150" stroke="#2ECC71" stroke-width="4" marker-end="url(#arrow)"/>
            <path d="M 230 110 L 280 150" stroke="#E74C3C" stroke-width="4" marker-end="url(#arrow)"/>
            
            <!-- True/False boxes -->
            <rect x="80" y="150" width="80" height="40" fill="#2ECC71" rx="5"/>
            <text x="120" y="175" text-anchor="middle" font-size="12" fill="white" font-weight="bold">TRUE</text>
            
            <rect x="240" y="150" width="80" height="40" fill="#E74C3C" rx="5"/>
            <text x="280" y="175" text-anchor="middle" font-size="12" fill="white" font-weight="bold">FALSE</text>
            
            <text x="200" y="230" text-anchor="middle" font-size="18" font-weight="bold" fill="#2c3e50">
                Conditional Logic
            </text>
        </svg>
    `,

    scene_level_5: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="skyGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#4facfe;stop-opacity:0.4" />
                    <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:0.4" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#skyGrad5)"/>
            <rect x="0" y="250" width="400" height="50" fill="#16A085"/>
            
            <!-- Loop visualization -->
            <circle cx="200" cy="120" r="50" fill="none" stroke="#E74C3C" stroke-width="4" stroke-dasharray="10,5">
                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 200 120" to="360 200 120" dur="3s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Numbers in circle -->
            <text x="180" y="100" font-size="20" fill="#3498DB" font-weight="bold">1</text>
            <text x="220" y="115" font-size="20" fill="#3498DB" font-weight="bold">2</text>
            <text x="215" y="145" font-size="20" fill="#3498DB" font-weight="bold">3</text>
            <text x="185" y="140" font-size="20" fill="#3498DB" font-weight="bold">4</text>
            <text x="200" y="125" font-size="20" fill="#E74C3C" font-weight="bold">5</text>
            
            <!-- Loop arrow -->
            <path d="M 250 120 Q 280 90 280 120 Q 280 150 250 120" fill="none" stroke="#F39C12" stroke-width="3" marker-end="url(#arrow)"/>
            
            <text x="200" y="220" text-anchor="middle" font-size="18" font-weight="bold" fill="#2c3e50">
                Loops & Repetition
            </text>
        </svg>
    `
};
