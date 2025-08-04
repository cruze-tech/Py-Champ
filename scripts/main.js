const gameManager = (() => {
    let levelStartTime = 0;
    let hintsUsed = 0;
    let currentLevel;

    let playerProgress = {
        unlockedLevels: [1],
        levelsCompleted: {},
        totalPlayTime: 0,
        hintsUsed: 0,
    };

    // Debounce function to prevent rapid clicks
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function saveProgress() {
        try {
            localStorage.setItem('pychamp_progress', JSON.stringify(playerProgress));
        } catch (e) {
            console.warn('Failed to save progress:', e);
        }
    }

    function loadProgress() {
        try {
            const saved = localStorage.getItem('pychamp_progress');
            console.log('📊 Loading progress from localStorage:', saved);
            
            if (saved) {
                const parsed = JSON.parse(saved);
                playerProgress = { ...playerProgress, ...parsed };
                console.log('✅ Progress loaded successfully:', playerProgress);
            } else {
                console.log('ℹ️ No saved progress found, starting fresh');
                // Ensure Level 1 is always unlocked
                playerProgress.unlockedLevels = [1];
                saveProgress();
            }
        } catch (e) {
            console.error('❌ Failed to load progress:', e);
            // Reset to default safe state
            playerProgress = {
                unlockedLevels: [1],
                levelsCompleted: {},
                totalPlayTime: 0,
                hintsUsed: 0,
            };
            saveProgress();
        }
        
        // Debug log final state
        console.log('🎯 Final progress state:', {
            unlockedLevels: playerProgress.unlockedLevels,
            completedLevels: Object.keys(playerProgress.levelsCompleted),
            totalCompleted: Object.keys(playerProgress.levelsCompleted).length
        });
    }

    function resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
            localStorage.removeItem('pychamp_progress');
            playerProgress = {
                unlockedLevels: [1],
                levelsCompleted: {},
                totalPlayTime: 0,
                hintsUsed: 0,
            };
            saveProgress();
            ui.updateOverallProgress();
            showLevelMap();
        }
    }

    const showLevelMap = debounce(() => {
        ui.renderLevelMap(playerProgress);
        ui.showView('level-map-container');
    }, 100);

    const startLevel = debounce((levelId) => {
        const level = gameLevels.find((l) => l.id === levelId);
        if (!level) {
            console.error(`❌ Level ${levelId} not found`);
            return;
        }
        
        // 🔧 FIX: More permissive level access check
        const isCompleted = !!playerProgress.levelsCompleted[levelId];
        const isUnlocked = playerProgress.unlockedLevels.includes(levelId);
        const isAccessible = isUnlocked || isCompleted;
        
        console.log(`🎮 Starting Level ${levelId}: unlocked=${isUnlocked}, completed=${isCompleted}, accessible=${isAccessible}`);
        
        if (!isAccessible) {
            console.warn(`⚠️ Level ${levelId} is not accessible yet`);
            alert(`Level ${levelId} is locked!\nComplete the previous levels first.`);
            return;
        }
        
        currentLevel = level;
        hintsUsed = 0;
        levelStartTime = Date.now();
        
        console.log(`✅ Successfully starting Level ${levelId}: ${level.title}`);
        
        // Use immediate transition for better responsiveness
        ui.loadLevelUI(currentLevel);
        ui.showView('gameplay-container');
    }, 100); // Reduced debounce time for better responsiveness

    function handleLevelSuccess() {
        console.log("🎉 Level success triggered for Level", currentLevel.id);
        const completionTime = Date.now() - levelStartTime;
        const timeMinutes = Math.round((completionTime / 60000) * 10) / 10;
        let stars = 3;

        // Calculate stars based on performance
        if (hintsUsed > 2) stars = 1;
        else if (hintsUsed > 0) stars = 2;
        else if (timeMinutes > 15) stars = 2;
        else if (timeMinutes > 10) stars = Math.max(2, stars);

        // Store completion data
        playerProgress.levelsCompleted[currentLevel.id] = {
            stars,
            completedAt: Date.now(),
            timeMinutes,
            hintsUsed,
        };

        playerProgress.totalPlayTime += completionTime;

        // 🔧 FIX: Always unlock next level
        const nextLevelId = currentLevel.id + 1;
        const nextLevelExists = gameLevels.some((l) => l.id === nextLevelId);

        if (nextLevelExists && !playerProgress.unlockedLevels.includes(nextLevelId)) {
            playerProgress.unlockedLevels.push(nextLevelId);
            console.log(`🔓 Level ${nextLevelId} unlocked!`);
        }

        // 🔧 FIX: Debug logging
        console.log('📊 Updated progress:', {
            completed: Object.keys(playerProgress.levelsCompleted),
            unlocked: playerProgress.unlockedLevels,
            nextLevelExists,
            nextLevelId
        });

        saveProgress();
        
        // Show victory modal
        setTimeout(() => {
            ui.showVictoryModal(
                stars, 
                currentLevel, 
                nextLevelExists ? () => startLevel(nextLevelId) : showLevelMap
            );
        }, 500);
    }

    function incrementHints() {
        hintsUsed++;
        playerProgress.hintsUsed++;
        saveProgress();
    }

    function attachEventListeners() {
        console.log("Attaching game manager event listeners");
        
        // Use immediate binding with better error handling
        const attachButtonListener = (buttonId, callback, description) => {
            const button = document.getElementById(buttonId);
            if (button) {
                console.log(`Found ${description} button`);
                // Remove any existing listeners
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`${description} button clicked`);
                    
                    // Add visual feedback
                    newButton.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        newButton.style.transform = '';
                    }, 150);
                    
                    callback();
                });
            } else {
                console.warn(`${description} button not found!`);
            }
        };
        
        // Attach listeners with retry mechanism
        const tryAttachListeners = () => {
            attachButtonListener('start-game-btn', showLevelMap, 'Start game');
            attachButtonListener('how-to-play-btn', () => ui.showView('how-to-play'), 'How to play');
            attachButtonListener('back-to-map-btn', showLevelMap, 'Back to map');
            attachButtonListener('reset-progress-btn', resetProgress, 'Reset progress');
        };
        
        // Try immediately and with delay
        tryAttachListeners();
        setTimeout(tryAttachListeners, 200);
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const visibleModal = document.querySelector('.modal-overlay.visible');
                if (visibleModal) {
                    const modalId = visibleModal.id;
                    ui.hideModal(modalId);
                }
            }
            
            // Ctrl+Enter shortcut for running code
            if (e.key === 'Enter' && e.ctrlKey) {
                const runBtn = document.getElementById('run-btn');
                if (runBtn && !runBtn.disabled) {
                    runBtn.click();
                }
            }
        });
    }

    function init() {
        console.log("Initializing game manager");
        
        // Load progress first
        loadProgress();
        
        // Show initial view immediately
        ui.showView('splash-screen');
        
        // Update progress display
        ui.updateOverallProgress();
        
        // Attach event listeners after a short delay to ensure DOM is ready
        setTimeout(attachEventListeners, 50);
        
        console.log("Game manager initialized");
    }

    return {
        init,
        startLevel,
        showLevelMap,
        handleLevelSuccess,
        incrementHints,
        resetProgress,  // Add this line - it was missing!
        playerProgress,
        get currentLevel() { return currentLevel; }
    };
})();

// Initialize immediately
console.log("Setting up game manager");
window.gameManager = gameManager;

// Wait for DOM to be ready, then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', gameManager.init);
} else {
    // DOM is already ready
    setTimeout(gameManager.init, 0);
}