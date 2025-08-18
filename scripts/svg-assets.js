const SVGAssets = {
  world_map: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#mapGradient)"/>
      <circle cx="150" cy="100" r="30" fill="#fbbf24" opacity="0.8"/>
      <circle cx="350" cy="150" r="25" fill="#10b981" opacity="0.8"/>
      <circle cx="550" cy="120" r="35" fill="#ef4444" opacity="0.8"/>
      <circle cx="650" cy="250" r="28" fill="#8b5cf6" opacity="0.8"/>
      <text x="400" y="50" fill="white" font-family="Arial" font-size="28" text-anchor="middle" font-weight="bold">🗺️ Python Adventure Map</text>
      <text x="400" y="350" fill="white" font-family="Arial" font-size="16" text-anchor="middle">Choose your coding adventure!</text>
    </svg>
  `,
  
  scene_level_1: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="welcomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#welcomeGrad)"/>
      <text x="400" y="150" fill="white" font-family="Arial" font-size="32" text-anchor="middle" font-weight="bold">🎉 Welcome to Python! 🎉</text>
      <text x="400" y="200" fill="#fbbf24" font-family="Arial" font-size="24" text-anchor="middle">Your coding journey starts here!</text>
      <circle cx="100" cy="100" r="15" fill="#fbbf24" opacity="0.7">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="700" cy="300" r="20" fill="#10b981" opacity="0.7">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `,
  
  scene_math: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <rect width="800" height="400" fill="#1e293b"/>
      <text x="400" y="100" fill="#fbbf24" font-family="Arial" font-size="36" text-anchor="middle">🧮 Math Magic!</text>
      <text x="400" y="180" fill="white" font-family="monospace" font-size="28" text-anchor="middle">15 + 25 × 2 = ?</text>
      <text x="200" y="250" fill="#10b981" font-family="Arial" font-size="20">+</text>
      <text x="400" y="250" fill="#ef4444" font-family="Arial" font-size="20">×</text>
      <text x="600" y="250" fill="#8b5cf6" font-family="Arial" font-size="20">=</text>
      <text x="400" y="320" fill="#06b6d4" font-family="Arial" font-size="18" text-anchor="middle">Remember PEMDAS!</text>
    </svg>
  `,
  
  scene_variables: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <rect width="800" height="400" fill="#0f172a"/>
      <rect x="300" y="150" width="200" height="100" rx="10" fill="#374151" stroke="#fbbf24" stroke-width="3"/>
      <text x="400" y="130" fill="#fbbf24" font-family="Arial" font-size="24" text-anchor="middle" font-weight="bold">📦 Variables</text>
      <text x="400" y="190" fill="white" font-family="monospace" font-size="18" text-anchor="middle">age = 16</text>
      <text x="400" y="220" fill="#10b981" font-family="Arial" font-size="16" text-anchor="middle">Stored in memory!</text>
      <text x="400" y="320" fill="#06b6d4" font-family="Arial" font-size="18" text-anchor="middle">Variables are like labeled boxes 📦</text>
    </svg>
  `,
  
  scene_strings: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <rect width="800" height="400" fill="#581c87"/>
      <text x="400" y="80" fill="#fbbf24" font-family="Arial" font-size="32" text-anchor="middle">✨ String Magic ✨</text>
      <rect x="150" y="150" width="120" height="50" rx="5" fill="#8b5cf6" opacity="0.8"/>
      <text x="210" y="180" fill="white" font-family="Arial" font-size="16" text-anchor="middle">"Hello"</text>
      <text x="320" y="180" fill="#fbbf24" font-family="Arial" font-size="24">+</text>
      <rect x="380" y="150" width="120" height="50" rx="5" fill="#10b981" opacity="0.8"/>
      <text x="440" y="180" fill="white" font-family="Arial" font-size="16" text-anchor="middle">"Alex"</text>
      <text x="550" y="180" fill="#fbbf24" font-family="Arial" font-size="24">=</text>
      <rect x="590" y="150" width="150" height="50" rx="5" fill="#ef4444" opacity="0.8"/>
      <text x="665" y="180" fill="white" font-family="Arial" font-size="16" text-anchor="middle">"Hello Alex"</text>
    </svg>
  `,
  
  scene_input: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <rect width="800" height="400" fill="#065f46"/>
      <text x="400" y="80" fill="#fbbf24" font-family="Arial" font-size="28" text-anchor="middle">🎯 Interactive Python!</text>
      <rect x="250" y="150" width="300" height="80" rx="10" fill="#374151" stroke="#10b981" stroke-width="2"/>
      <text x="400" y="175" fill="#10b981" font-family="Arial" font-size="16" text-anchor="middle">input("What's your name?")</text>
      <text x="400" y="200" fill="white" font-family="monospace" font-size="14" text-anchor="middle">User types here... ✍️</text>
      <text x="400" y="280" fill="#06b6d4" font-family="Arial" font-size="18" text-anchor="middle">Make your programs interactive!</text>
      <circle cx="150" cy="200" r="8" fill="#fbbf24">
        <animate attributeName="r" values="5;12;5" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `,
  
  scene_decisions: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <rect width="800" height="400" fill="#7c2d12"/>
      <text x="400" y="60" fill="#fbbf24" font-family="Arial" font-size="28" text-anchor="middle">🤔 Decision Time!</text>
      <polygon points="400,120 350,180 450,180" fill="#8b5cf6"/>
      <text x="400" y="155" fill="white" font-family="Arial" font-size="12" text-anchor="middle">if score > 80</text>
      <rect x="280" y="200" width="100" height="40" rx="5" fill="#10b981"/>
      <text x="330" y="225" fill="white" font-family="Arial" font-size="12" text-anchor="middle">Great job!</text>
      <rect x="420" y="200" width="100" height="40" rx="5" fill="#ef4444"/>
      <text x="470" y="225" fill="white" font-family="Arial" font-size="12" text-anchor="middle">Keep trying!</text>
      <text x="400" y="300" fill="#06b6d4" font-family="Arial" font-size="16" text-anchor="middle">Python makes smart decisions! 🧠</text>
    </svg>
  `,
  
  scene_default: `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <rect width="800" height="400" fill="#475569"/>
      <text x="400" y="200" fill="white" font-family="Arial" font-size="24" text-anchor="middle">🐍 Python Challenge</text>
    </svg>
  `,
};

window.SVGAssets = SVGAssets;
console.log("Enhanced SVG Assets loaded");
