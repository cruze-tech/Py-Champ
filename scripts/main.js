const gameManager = (() => {
  console.log("GameManager initializing");

  let currentLevel = null;
  let playerProgress = {
    unlockedLevels: [1], // Start with level 1 unlocked
    completedLevels: [],
    levelScores: {}, // Store stars for each level
    hintsUsed: 0,
    totalPlayTime: 0
  };
  let levelStartTime = null;
  let hintsUsed = 0; // Hints used for current level

  // Load progress from localStorage
  function loadProgress() {
    try {
      const saved = localStorage.getItem('pychamp_progress');
      if (saved) {
        const loadedProgress = JSON.parse(saved);
        playerProgress = {
          ...playerProgress,
          ...loadedProgress
        };
        
        // Ensure at least level 1 is unlocked
        if (!playerProgress.unlockedLevels || playerProgress.unlockedLevels.length === 0) {
          playerProgress.unlockedLevels = [1];
        }
        
        console.log("✅ Progress loaded:", playerProgress);
      } else {
        console.log("No saved progress found, using defaults");
      }
    } catch (error) {
      console.error("❌ Error loading progress:", error);
      playerProgress = {
        unlockedLevels: [1],
        completedLevels: [],
        levelScores: {},
        hintsUsed: 0,
        totalPlayTime: 0
      };
    }
  }

  // Save progress to localStorage
  function saveProgress() {
    try {
      localStorage.setItem('pychamp_progress', JSON.stringify(playerProgress));
      console.log("✅ Progress saved:", playerProgress);
    } catch (error) {
      console.error("❌ Error saving progress:", error);
    }
  }

  // Get level by ID
  function getLevelById(id) {
    return window.gameLevels?.find(level => level.id === parseInt(id));
  }

  // Start a level
  function startLevel(levelId) {
    console.log(`🎮 Starting level: ${levelId}`);
    
    const levelData = getLevelById(levelId);
    if (!levelData) {
      console.error(`❌ Level ${levelId} not found!`);
      return;
    }

    // Check if level is unlocked
    if (!playerProgress.unlockedLevels.includes(levelId)) {
      console.warn(`🔒 Level ${levelId} is locked!`);
      alert(`Level ${levelId} is locked! Complete previous levels first.`);
      return;
    }

    // Reset level-specific data
    hintsUsed = 0;
    currentLevel = levelData;
    levelStartTime = Date.now();

    // Show gameplay view and load level UI
    if (window.ui) {
      window.ui.showView('gameplay');
      window.ui.loadLevelUI(levelData);
    }

    console.log(`✅ Level ${levelId} loaded successfully`);
  }

  // Handle level completion
  function handleLevelSuccess() {
    if (!currentLevel) {
      console.error("❌ No current level to complete!");
      return;
    }

    const levelId = currentLevel.id;
    const completionTime = Date.now() - levelStartTime;
    
    console.log(`🎉 Level ${levelId} completed in ${completionTime}ms with ${hintsUsed} hints`);

    // Calculate stars (3 = no hints, 2 = 1-2 hints, 1 = 3+ hints)
    let stars = 3;
    if (hintsUsed >= 3) {
      stars = 1;
    } else if (hintsUsed >= 1) {
      stars = 2;
    }

    // Update progress
    if (!playerProgress.completedLevels.includes(levelId)) {
      playerProgress.completedLevels.push(levelId);
    }

    // Update or set level score (keep best score)
    const currentScore = playerProgress.levelScores[levelId] || 0;
    if (stars > currentScore) {
      playerProgress.levelScores[levelId] = stars;
    }

    // Unlock next level
    const nextLevelId = levelId + 1;
    if (nextLevelId <= window.gameLevels?.length && !playerProgress.unlockedLevels.includes(nextLevelId)) {
      playerProgress.unlockedLevels.push(nextLevelId);
      console.log(`🔓 Unlocked level ${nextLevelId}`);
    }

    // Update total play time
    playerProgress.totalPlayTime += completionTime;

    // Save progress
    saveProgress();

    // Show victory modal
    if (window.ui) {
      setTimeout(() => {
        window.ui.showVictoryModal(stars, currentLevel, () => {
          // After victory modal, show level map
          showLevelMap();
        });
      }, 500);
    }

    console.log("✅ Progress updated:", playerProgress);
  }

  // Show level map
  function showLevelMap() {
    console.log("🗺️ Showing level map");
    
    if (window.ui) {
      window.ui.showView('level-map');
    }
  }

  // Increment hints used
  function incrementHints() {
    hintsUsed++;
    playerProgress.hintsUsed++;
    console.log(`💡 Hint used (level: ${hintsUsed}, total: ${playerProgress.hintsUsed})`);
    
    // Update hint button appearance
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      if (hintsUsed >= 5) {
        hintBtn.textContent = "💡 Show Solution";
        hintBtn.title = "Click to see the solution";
      } else {
        hintBtn.textContent = `💡 Hint (${hintsUsed}/5 used)`;
        hintBtn.title = `Click for another hint (${hintsUsed}/5)`;
      }
    }
    
    saveProgress();
  }

  // Reset all progress
  function resetProgress() {
    console.log("🔄 Resetting all progress");
    
    if (confirm("Are you sure you want to reset all progress? This cannot be undone!")) {
      localStorage.removeItem('pychamp_progress');
      playerProgress = {
        unlockedLevels: [1],
        completedLevels: [],
        levelScores: {},
        hintsUsed: 0,
        totalPlayTime: 0
      };
      
      currentLevel = null;
      hintsUsed = 0;
      
      console.log("✅ Progress reset complete");
      
      // Update UI
      if (window.ui) {
        window.ui.showView('splash-screen');
        window.ui.updateProgressDisplay();
      }
    }
  }

  // Calculate overall progress
  function calculateProgress() {
    const totalLevels = window.gameLevels?.length || 6;
    const completedCount = playerProgress.completedLevels.length;
    const percentage = Math.round((completedCount / totalLevels) * 100);
    
    return {
      completed: completedCount,
      total: totalLevels,
      percentage: percentage
    };
  }

  // Initialize the game manager
  function init() {
    console.log("🚀 Initializing GameManager");
    loadProgress();
    console.log("✅ GameManager ready");
  }

  // Attach event listeners
  function attachEventListeners() {
    console.log("🔄 Attaching event listeners");
    
    // Use UI utility for button listeners
    if (window.ui && window.ui.attachButtonListener) {
      // Splash screen buttons
      const startGameBtn = document.getElementById('start-game-btn');
      if (startGameBtn) {
        window.ui.attachButtonListener(startGameBtn, showLevelMap);
      }
      
      const howToPlayBtn = document.getElementById('how-to-play-btn');
      if (howToPlayBtn) {
        window.ui.attachButtonListener(howToPlayBtn, () => window.ui.showView('how-to-play'));
      }
      
      const resetProgressBtn = document.getElementById('reset-progress-btn');
      if (resetProgressBtn) {
        window.ui.attachButtonListener(resetProgressBtn, resetProgress);
      }
      
      // Back to menu buttons
      const backToMenuBtn = document.getElementById('back-to-menu-btn');
      if (backToMenuBtn) {
        window.ui.attachButtonListener(backToMenuBtn, () => window.ui.showView('splash-screen'));
      }
      
      const levelMapToMenuBtn = document.getElementById('level-map-to-menu-btn');
      if (levelMapToMenuBtn) {
        window.ui.attachButtonListener(levelMapToMenuBtn, () => window.ui.showView('splash-screen'));
      }
    }
    
    // Handle generic back-to-menu class buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-to-menu')) {
        console.log("🏠 Back to menu clicked");
        if (window.ui) {
          window.ui.showView('splash-screen');
        }
      }
    });
    
    // Handle ESC key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        modals.forEach(modal => {
          modal.classList.add('hidden');
          modal.style.display = 'none';
        });
      }
    });
    
    console.log("✅ Event listeners attached");
  }

  // Public API
  return {
    init,
    startLevel,
    handleLevelSuccess,
    showLevelMap,
    incrementHints,
    resetProgress,
    calculateProgress,
    getLevelById,
    get currentLevel() { return currentLevel; },
    get playerProgress() { return playerProgress; },
    get hintsUsed() { return hintsUsed; }
  };
})();

// Expose to global scope
window.gameManager = gameManager;

// Initialize the game manager when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', gameManager.init);
} else {
  gameManager.init();
}

// Force initialize after a short delay as fallback
setTimeout(() => {
  const loading = document.getElementById('initial-loading');
  if (loading && loading.style.display !== 'none') {
    console.log("⚠️ Forcing initialization after timeout");
    gameManager.init();
  }
}, 2000);

// Initialize everything properly
document.addEventListener('DOMContentLoaded', function() {
  console.log("🌟 PyChamp initializing...");
  
  // Initialize in correct order
  const initSequence = async () => {
    // Wait for all scripts to load
    await new Promise(resolve => {
      const checkReady = () => {
        if (window.gameManager && window.ui && window.gameLevels && window.editorManager) {
          resolve();
        } else {
          setTimeout(checkReady, 50);
        }
      };
      checkReady();
    });
    
    // Initialize game manager first
    window.gameManager.init();
    
    // Then initialize UI
    window.ui.init();
    
    console.log("🎉 PyChamp ready to play!");
  };
  
  initSequence().catch(console.error);
});

// Add this debugging script at the end

// Immediate DOM check
document.addEventListener('DOMContentLoaded', function() {
  console.log("🔍 DOM Content Loaded - Starting immediate checks");
  
  // Check for critical elements
  const criticalElements = [
    'splash-screen',
    'level-map', 
    'level-map-grid',
    'start-game-btn',
    'gameplay'
  ];
  
  console.log("=== DOM ELEMENT CHECK ===");
  criticalElements.forEach(id => {
    const element = document.getElementById(id);
    console.log(`${id}:`, element ? '✅ Found' : '❌ Missing', element);
  });
  
  // Check for game data
  console.log("=== GAME DATA CHECK ===");
  console.log("window.gameLevels:", window.gameLevels ? `✅ ${window.gameLevels.length} levels` : '❌ Missing');
  console.log("window.gameManager:", window.gameManager ? '✅ Found' : '❌ Missing');
  console.log("window.ui:", window.ui ? '✅ Found' : '❌ Missing');
  
  // Initialize with error handling
  const initSequence = async () => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    while (attempts < maxAttempts) {
      console.log(`Initialization attempt ${attempts + 1}/${maxAttempts}`);
      
      if (window.gameManager && window.ui && window.gameLevels) {
        console.log("✅ All required modules loaded");
        
        // Initialize game manager
        window.gameManager.init();
        
        // Initialize UI
        window.ui.init();
        
        console.log("🎉 PyChamp initialization complete!");
        return;
      }
      
      console.log("⏳ Waiting for modules...", {
        gameManager: !!window.gameManager,
        ui: !!window.ui,
        gameLevels: !!window.gameLevels
      });
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.error("❌ Initialization failed - modules not ready after 5 seconds");
    alert("Game failed to initialize. Please refresh the page.");
  };
  
  initSequence().catch(console.error);
});