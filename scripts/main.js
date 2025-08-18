const gameManager = (() => {
  console.log("🚀 Game Manager initializing");
  
  let levelStartTime = 0;
  let hintsUsed = 0;
  let currentLevel = null;

  let playerProgress = {
    unlockedLevels: [1],
    levelsCompleted: {},
    totalPlayTime: 0,
    hintsUsed: 0,
  };

  function saveProgress() {
    try {
      localStorage.setItem('pychamp_progress', JSON.stringify(playerProgress));
      console.log("✅ Progress saved");
    } catch(e) {
      console.warn("⚠️ Failed to save progress:", e);
    }
  }

  function loadProgress() {
    try {
      const saved = localStorage.getItem('pychamp_progress');
      if (saved) {
        playerProgress = JSON.parse(saved);
        console.log("✅ Progress loaded");
      }
    } catch(e) {
      console.warn("⚠️ Failed to load progress:", e);
    }
  }

  function resetProgress() {
    if (!confirm('Are you sure you want to reset all progress?')) return;
    
    playerProgress = {
      unlockedLevels: [1],
      levelsCompleted: {},
      totalPlayTime: 0,
      hintsUsed: 0,
    };
    
    saveProgress();
    ui.renderLevelMap(playerProgress);
    ui.updateOverallProgress();
    
    alert("Progress has been reset");
  }

  const showLevelMap = function() {
    console.log("🗺️ Showing level map");
    ui.renderLevelMap(playerProgress);
    ui.updateOverallProgress();
    ui.showView('level-map-container');
  };

  const startLevel = function(levelId) {
    console.log(`🎮 Starting level ${levelId}`);
    
    const level = window.gameLevels.find(l => l.id === levelId);
    if (!level) {
      console.error(`❌ Level ${levelId} not found`);
      return;
    }
    
    currentLevel = level;
    levelStartTime = Date.now();
    hintsUsed = 0;
    
    ui.loadLevelUI(level);
    ui.showView('gameplay-container');
  };

  function handleLevelSuccess() {
    console.log(`🏆 Level ${currentLevel.id} completed!`);
    
    const timeElapsed = Date.now() - levelStartTime;
    const minutes = Math.round(timeElapsed / 60000 * 10) / 10;
    
    // Calculate stars (3 for best, 1 for minimum)
    let stars = 3;
    if (hintsUsed > 2) stars = 1;
    else if (hintsUsed > 0) stars = 2;
    else if (minutes > 10) stars = Math.max(2, stars);
    else if (minutes > 5) stars = Math.max(2, stars);
    
    // Store completion data
    playerProgress.levelsCompleted[currentLevel.id] = {
      stars: stars,
      completedAt: Date.now(),
      timeMinutes: minutes,
      hintsUsed: hintsUsed
    };
    
    // Unlock next level
    const nextLevelId = currentLevel.id + 1;
    const nextLevelExists = window.gameLevels.some(l => l.id === nextLevelId);
    
    if (nextLevelExists && !playerProgress.unlockedLevels.includes(nextLevelId)) {
      playerProgress.unlockedLevels.push(nextLevelId);
      console.log(`🔓 Level ${nextLevelId} unlocked`);
    }
    
    // Update total stats
    playerProgress.totalPlayTime += timeElapsed;
    
    // Save progress
    saveProgress();
    
    // Show victory modal with encouragement
    setTimeout(() => {
      ui.showVictoryModal(stars, currentLevel, () => {
        if (nextLevelExists) {
          startLevel(nextLevelId);
        } else {
          // All levels completed!
          alert("🎉 Congratulations! You've completed all levels! You're now a Python champion! 🏆");
          showLevelMap();
        }
      });
    }, 500);
  }

  function incrementHints() {
    hintsUsed++;
    playerProgress.hintsUsed++;
    console.log(`💡 Hint used (total: ${hintsUsed} for this level, ${playerProgress.hintsUsed} overall)`);
    
    // Update hint button text to show usage
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      if (hintsUsed === 1) {
        hintBtn.textContent = `💡 Hint (${hintsUsed} used)`;
      } else {
        hintBtn.textContent = `💡 Hints (${hintsUsed} used)`;
      }
    }
    
    saveProgress();
  }

  function attachEventListeners() {
    console.log("🔄 Attaching event listeners");
    
    // Splash screen buttons
    ui.attachButtonListener(document.getElementById('start-game-btn'), showLevelMap);
    ui.attachButtonListener(document.getElementById('how-to-play-btn'), () => ui.showView('how-to-play'));
    ui.attachButtonListener(document.getElementById('reset-progress-btn'), resetProgress);
    
    // Back to menu buttons
    ui.attachButtonListener(document.getElementById('back-to-menu-btn'), () => ui.showView('splash-screen'));
    ui.attachButtonListener(document.getElementById('level-map-to-menu-btn'), () => ui.showView('splash-screen'));
    
    // Handle all back-to-menu class buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-to-menu')) {
        console.log("Back to menu clicked (generic handler)");
        ui.showView('splash-screen');
      }
    });
    
    // Handle escape key to close modals
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

  function init() {
    console.log("🔄 Initializing Game Manager");
    
    // Hide loading screen
    const loading = document.getElementById('initial-loading');
    if (loading) {
      loading.style.display = 'none';
    }
    
    // Load saved progress
    loadProgress();
    
    // Setup event handlers
    attachEventListeners();
    
    // Show the splash screen initially
    ui.showView('splash-screen');
    
    console.log("✅ Game Manager initialized");
  }

  return {
    init,
    startLevel,
    showLevelMap,
    handleLevelSuccess,
    incrementHints,
    resetProgress,
    playerProgress
  };
})();

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