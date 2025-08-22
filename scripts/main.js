const gameManager = (() => {
  let currentLevel = null;
  let playerProgress = {
    unlockedLevels: [1],
    completedLevels: [],
    levelScores: {}, // stores best star rating per level
    levelStats: {}, // stores detailed stats per level
    totalPlayTime: 0,
    gamesPlayed: 0
  };
  let levelStartTime = null;
  let currentLevelHints = 0; // Hints for current session only

  const STORAGE_KEY = 'pychamp_progress';

  function log(message) {
    console.log(`GameManager: ${message}`);
  }

  function loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedData = JSON.parse(saved);
        // Merge with default structure to handle version upgrades
        playerProgress = {
          unlockedLevels: [1],
          completedLevels: [],
          levelScores: {},
          levelStats: {},
          totalPlayTime: 0,
          gamesPlayed: 0,
          ...savedData
        };
        log(`Progress loaded: ${playerProgress.completedLevels.length} levels completed`);
      } else {
        log('No saved progress found, starting fresh');
      }
    } catch (error) {
      console.error("Error loading progress:", error);
      // Reset to defaults on error
      playerProgress = {
        unlockedLevels: [1],
        completedLevels: [],
        levelScores: {},
        levelStats: {},
        totalPlayTime: 0,
        gamesPlayed: 0
      };
    }
  }

  function saveProgress() {
    try {
      const saveData = {
        ...playerProgress,
        lastSaved: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      log('Progress saved successfully');
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }

  function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      playerProgress = {
        unlockedLevels: [1],
        completedLevels: [],
        levelScores: {},
        levelStats: {},
        totalPlayTime: 0,
        gamesPlayed: 0
      };
      currentLevel = null;
      currentLevelHints = 0;
      levelStartTime = null; // BUG FIX: Reset level start time
      
      log('Progress reset completed');
      saveProgress();
      
      if (window.ui && window.ui.updateProgressDisplay) {
        window.ui.updateProgressDisplay();
        // BUG FIX: Also update level map after reset
        if (window.ui.updateLevelMap) {
          window.ui.updateLevelMap();
        }
      }
      return true;
    }
    return false;
  }

  function getLevelById(id) {
    return window.gameLevels?.find(level => level.id === parseInt(id));
  }

  function isLevelUnlocked(levelId) {
    return playerProgress.unlockedLevels.includes(parseInt(levelId));
  }

  function isLevelCompleted(levelId) {
    return playerProgress.completedLevels.includes(parseInt(levelId));
  }

  function getLevelStars(levelId) {
    return playerProgress.levelScores[parseInt(levelId)] || 0;
  }

  function getLevelStats(levelId) {
    return playerProgress.levelStats[parseInt(levelId)] || {
      attempts: 0,
      bestTime: null,
      totalHints: 0,
      firstCompleted: null
    };
  }

  function startLevel(levelId) {
    log(`Starting level ${levelId}`);
    
    levelId = parseInt(levelId);
    const levelData = getLevelById(levelId);
    
    if (!levelData) {
      console.error(`Level ${levelId} not found!`);
      return false;
    }

    if (!isLevelUnlocked(levelId)) {
      console.warn(`Level ${levelId} is locked!`);
      alert('This level is locked! Complete the previous levels first.');
      return false;
    }

    // Reset level-specific counters
    currentLevelHints = 0;
    currentLevel = levelData;
    levelStartTime = Date.now();
    
    // BUG FIX: Initialize level stats if they don't exist
    if (!playerProgress.levelStats[levelId]) {
      playerProgress.levelStats[levelId] = {
        attempts: 0,
        bestTime: null,
        totalHints: 0,
        firstCompleted: null
      };
    }
    playerProgress.levelStats[levelId].attempts++;
    playerProgress.gamesPlayed++;

    // BUG FIX: Save progress after updating stats
    saveProgress();

    log(`Level ${levelId} started - Attempt #${playerProgress.levelStats[levelId].attempts}`);

    // Show gameplay UI
    if (window.ui && window.ui.showView) {
      window.ui.showView('gameplay');
      setTimeout(() => {
        if (window.ui.loadLevelUI) {
          window.ui.loadLevelUI(levelData);
        }
      }, 100);
      return true;
    } else {
      console.error('UI module not available!');
      return false;
    }
  }

  function incrementHints() {
    currentLevelHints++;
    
    if (currentLevel) {
      const levelId = currentLevel.id;
      // BUG FIX: Ensure level stats exist before updating
      if (!playerProgress.levelStats[levelId]) {
        playerProgress.levelStats[levelId] = {
          attempts: 0,
          bestTime: null,
          totalHints: 0,
          firstCompleted: null
        };
      }
      playerProgress.levelStats[levelId].totalHints++;
    }
    
    log(`Hints used in current session: ${currentLevelHints}`);
    saveProgress();
    return currentLevelHints;
  }

  function handleLevelSuccess() {
    if (!currentLevel || !levelStartTime) {
      log('No current level for success handler');
      return false;
    }

    const levelId = currentLevel.id;
    const completionTime = Date.now() - levelStartTime;
    const hintsUsed = currentLevelHints;

    // Calculate stars based on hints used
    let stars = 3; // Perfect
    if (hintsUsed >= 1 && hintsUsed < 3) stars = 2; // Good
    if (hintsUsed >= 3) stars = 1; // Okay

    log(`Level ${levelId} completed: ${stars} stars, ${hintsUsed} hints, ${Math.round(completionTime/1000)}s`);

    // Update completion status
    if (!playerProgress.completedLevels.includes(levelId)) {
      playerProgress.completedLevels.push(levelId);
    }

    // Update best score (keep highest star count)
    const currentBest = playerProgress.levelScores[levelId] || 0;
    playerProgress.levelScores[levelId] = Math.max(stars, currentBest);

    // BUG FIX: Ensure stats object exists before accessing
    if (!playerProgress.levelStats[levelId]) {
      playerProgress.levelStats[levelId] = {
        attempts: 0,
        bestTime: null,
        totalHints: 0,
        firstCompleted: null
      };
    }

    // Update level stats
    const stats = playerProgress.levelStats[levelId];
    if (!stats.firstCompleted) {
      stats.firstCompleted = Date.now();
    }
    // BUG FIX: Only update best time if it's better or first completion
    if (!stats.bestTime || completionTime < stats.bestTime) {
      stats.bestTime = completionTime;
    }

    // Unlock next level
    const nextLevelId = levelId + 1;
    const maxLevels = window.gameLevels?.length || 6;
    
    if (nextLevelId <= maxLevels && !playerProgress.unlockedLevels.includes(nextLevelId)) {
      playerProgress.unlockedLevels.push(nextLevelId);
      log(`Unlocked level ${nextLevelId}`);
    }

    // Add completion time to total
    playerProgress.totalPlayTime += completionTime;

    // Save progress
    saveProgress();

    // Show victory modal
    if (window.ui && window.ui.showVictoryModal) {
      const nextAction = () => {
        if (nextLevelId <= maxLevels) {
          // BUG FIX: Better UX - show option dialog instead of confirm
          const userChoice = confirm('Ready for the next level?\n\nClick OK to continue to the next level\nClick Cancel to return to level map');
          if (userChoice) {
            startLevel(nextLevelId);
          } else {
            window.ui.showView('level-map');
          }
        } else {
          // All levels completed!
          alert('🎉 Congratulations! You\'ve completed all levels!\n\nYou are now a Python Champion!');
          window.ui.showView('level-map');
        }
      };

      // BUG FIX: Pass correct completion data
      const completionData = {
        hintsUsed,
        completionTime,
        isNewRecord: !stats.bestTime || completionTime <= stats.bestTime,
        isFirstCompletion: stats.attempts === 1, // BUG FIX: Check if this is first attempt
        levelId,
        stars
      };

      setTimeout(() => {
        window.ui.showVictoryModal(stars, currentLevel, nextAction, completionData);
      }, 500);
    }

    // BUG FIX: Reset current level data after completion
    currentLevel = null;
    levelStartTime = null;
    currentLevelHints = 0;

    return true;
  }

  function calculateProgress() {
    const totalLevels = window.gameLevels?.length || 6;
    const completedCount = playerProgress.completedLevels.length;
    const unlockedCount = playerProgress.unlockedLevels.length;
    const percentage = Math.round((completedCount / totalLevels) * 100);
    
    // Calculate total stars earned
    const totalStars = Object.values(playerProgress.levelScores).reduce((sum, stars) => sum + stars, 0);
    const maxPossibleStars = totalLevels * 3;

    return {
      completed: completedCount,
      total: totalLevels,
      unlocked: unlockedCount,
      percentage: percentage,
      totalStars,
      maxPossibleStars,
      totalPlayTime: Math.round(playerProgress.totalPlayTime / 1000), // in seconds
      gamesPlayed: playerProgress.gamesPlayed
    };
  }

  function getDetailedStats() {
    const progress = calculateProgress();
    
    return {
      ...progress,
      levelStats: { ...playerProgress.levelStats }, // BUG FIX: Return copy to prevent mutation
      averageStars: progress.completed > 0 ? (progress.totalStars / progress.completed).toFixed(2) : 0,
      averagePlayTime: playerProgress.gamesPlayed > 0 ? Math.round(playerProgress.totalPlayTime / playerProgress.gamesPlayed) : 0,
      completionRate: progress.unlocked > 0 ? Math.round((progress.completed / progress.unlocked) * 100) : 0
    };
  }

  // BUG FIX: Add method to get current session info
  function getCurrentSessionInfo() {
    return {
      currentLevel: currentLevel ? { ...currentLevel } : null,
      hintsUsed: currentLevelHints,
      sessionStartTime: levelStartTime,
      sessionDuration: levelStartTime ? Date.now() - levelStartTime : 0
    };
  }

  function init() {
    log('Initializing Game Manager');
    loadProgress();
    
    // BUG FIX: Validate loaded data
    if (!Array.isArray(playerProgress.unlockedLevels) || playerProgress.unlockedLevels.length === 0) {
      playerProgress.unlockedLevels = [1];
    }
    if (!Array.isArray(playerProgress.completedLevels)) {
      playerProgress.completedLevels = [];
    }
    if (typeof playerProgress.levelScores !== 'object') {
      playerProgress.levelScores = {};
    }
    if (typeof playerProgress.levelStats !== 'object') {
      playerProgress.levelStats = {};
    }
    
    log(`Game Manager initialized - ${playerProgress.completedLevels.length} levels completed`);
    return true;
  }

  // Public API
  return {
    init,
    startLevel,
    handleLevelSuccess,
    incrementHints,
    resetProgress,
    calculateProgress,
    getDetailedStats,
    getCurrentSessionInfo, // BUG FIX: Added session info method
    getLevelById,
    isLevelUnlocked,
    isLevelCompleted,
    getLevelStars,
    getLevelStats,
    get currentLevel() { return currentLevel ? { ...currentLevel } : null; }, // BUG FIX: Return copy
    get playerProgress() { return { ...playerProgress }; }, // Return copy to prevent external modification
    get hintsUsed() { return currentLevelHints; },
    get levelStartTime() { return levelStartTime; }
  };
})();

window.gameManager = gameManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 PyChamp - DOM Content Loaded');
  
  const initializeGame = async () => {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      if (window.gameManager && window.ui && window.gameLevels) {
        console.log('✅ All modules loaded, initializing...');
        
        // Initialize game manager first
        if (window.gameManager.init()) {
          // Then initialize UI
          if (window.ui.init) {
            window.ui.init();
          }
          
          // Setup main navigation buttons
          setupMainNavigation();
          
          console.log('🎉 PyChamp initialized successfully!');
          return;
        }
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.error('❌ Failed to initialize PyChamp - modules not ready');
  };
  
  function setupMainNavigation() {
    // Start game button
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
      startGameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.ui) window.ui.showView('level-map');
      });
    }
    
    // How to play button
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    if (howToPlayBtn) {
      howToPlayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.ui) window.ui.showView('how-to-play');
      });
    }
    
    // Reset progress button
    const resetBtn = document.getElementById('reset-progress-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.gameManager) {
          window.gameManager.resetProgress();
        }
      });
    }
    
    // Back to menu buttons
    document.querySelectorAll('[id$="-to-menu-btn"], [id$="-back-btn"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.id === 'back-to-menu-btn') {
          if (window.ui) window.ui.showView('level-map');
        } else {
          if (window.ui) window.ui.showView('splash-screen');
        }
      });
    });
  }
  
  initializeGame();
});