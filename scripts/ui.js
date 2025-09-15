const ui = (() => {
  console.log("UI Manager initializing");
  
  /**
   * Utility Functions
   */
  function getEl(id) {
    return document.getElementById(id);
  }

  function log(message) {
    console.log(`🔵 UI: ${message}`);
  }
  
  /**
   * Button Management - Reliable event handling
   */
  function attachButtonListener(element, handler) {
    if (typeof element === 'string') {
      element = getEl(element);
    }
    if (!element || !handler) return;

    // Remove previous listeners (if any)
    element.onclick = null;
    element.removeEventListener('click', handler);

    // Use passive event for touch devices
    element.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      log(`Button clicked: ${element.id || element.className}`);
      try {
        handler(e);
      } catch (error) {
        console.error("Button handler error:", error);
      }
    }, { passive: true });

    // Enable button immediately
    element.disabled = false;
    element.style.pointerEvents = 'auto';

    return element;
  }
  
  /**
   * View Management - Control which screen is visible
   */
  function showView(viewName) {
    console.log(`UI: Showing view - ${viewName}`);
  
    const views = ['splash-screen', 'level-map', 'gameplay', 'how-to-play'];
  
    views.forEach(view => {
      const element = document.getElementById(view);
      if (element) {
        if (view === viewName) {
          element.classList.remove('hidden');
          element.style.display = 'block';
        } else {
          element.classList.add('hidden');
          element.style.display = 'none';
        }
      }
    });
  
    if (viewName === 'level-map') {
      setTimeout(updateLevelMap, 50);
    } else if (viewName === 'splash-screen') {
      setTimeout(updateProgressDisplay, 50);
    }
  }
  
  /**
   * Level Map - Render all available levels
   */
  function updateLevelMap() {
    console.log('UI: Updating level map');
  
    const levelMapGrid = document.getElementById('level-map-grid');
    if (!levelMapGrid) {
      console.error('UI: Level map grid element not found!');
      return;
    }
  
    if (!window.gameLevels || !window.gameManager) {
      console.error('UI: Game levels or manager not available!');
      levelMapGrid.innerHTML = '<p style="text-align: center; color: #ef4444;">Error: Game not ready. Please refresh.</p>';
      return;
    }
  
    // Clear existing content
    levelMapGrid.innerHTML = '';
  
    // Create level cards using gameManager methods
    window.gameLevels.forEach(level => {
      const isUnlocked = window.gameManager.isLevelUnlocked(level.id);
      const isCompleted = window.gameManager.isLevelCompleted(level.id);
      const stars = window.gameManager.getLevelStars(level.id);
      const stats = window.gameManager.getLevelStats(level.id);
      
      // Create card element
      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
      
      // Add card content with stats
      card.innerHTML = `
        <h4>Level ${level.id}: ${level.title}</h4>
        <div class="meta">
          <div>Concepts: ${level.concepts}</div>
          ${stats.attempts > 0 ? `<small style="opacity: 0.7;">Attempts: ${stats.attempts}</small>` : ''}
        </div>
        <div class="stars-display">
          ${Array.from({length: 3}, (_, i) => 
            `<span>${i < stars ? '⭐' : '☆'}</span>`
          ).join('')}
        </div>
        <div class="actions">
          ${isUnlocked
            ? `<button class="btn btn-primary play-level-btn" data-level-id="${level.id}">
                ${isCompleted ? '🔄 Replay' : '▶️ Play'}
              </button>`
            : `<span style="color: #94a3b8; font-style: italic; text-align: center; padding: 8px;">🔒 Complete previous levels to unlock</span>`
          }
        </div>
      `;
      
      levelMapGrid.appendChild(card);
      
      // Add event listener to play button if unlocked
      if (isUnlocked) {
        const playBtn = card.querySelector('.play-level-btn');
        if (playBtn) {
          playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const levelId = parseInt(this.dataset.levelId);
            console.log(`UI: Starting level ${levelId}`);
            
            if (window.gameManager.startLevel(levelId)) {
              console.log(`Level ${levelId} started successfully`);
            } else {
              console.error(`Failed to start level ${levelId}`);
            }
          });
        }
      }
    });
  
    document.querySelectorAll('.play-level-btn').forEach(btn => {
      btn.disabled = false;
      btn.style.pointerEvents = 'auto';
    });
  
    console.log(`UI: Created ${window.gameLevels.length} level cards`);
  
    // Update progress display
    updateProgressDisplay();
  }
  
  /**
   * Load Level UI - Setup gameplay screen for specific level
   */
  function loadLevelUI(level) {
    if (!level) {
      console.error('UI: No level data provided to loadLevelUI');
      return;
    }
    
    console.log(`UI: Loading Level ${level.id}: ${level.title}`);
  
    // Update title
    const titleElement = document.querySelector('.level-title');
    if (titleElement) {
      titleElement.textContent = `Level ${level.id}: ${level.title}`;
    }
  
    // Update dialogue
    const dialogue = document.getElementById('npc-dialogue');
    if (dialogue) {
      dialogue.innerHTML = `<p>${level.dialogue}</p>`;
    }
  
    // Update instructions
    const instructions = document.getElementById('instructions');
    if (instructions) {
      instructions.innerHTML = `<p><strong>Task:</strong> ${level.instructions}</p>`;
    }
  
    // Update scene
    const scene = document.getElementById('scene-container');
    if (scene) {
      if (window.SVGAssets && level.scene && window.SVGAssets[level.scene]) {
        scene.innerHTML = window.SVGAssets[level.scene];
        // Force SVG to resize on mobile
        const svg = scene.querySelector('svg');
        if (svg) {
          svg.style.width = '100%';
          svg.style.height = 'auto';
          svg.style.display = 'block';
        }
      } else {
        scene.innerHTML = `
          <div style="text-align: center; color: #94a3b8;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎭</div>
            <h3>Level ${level.id}</h3>
            <p>${level.title}</p>
          </div>
        `;
      }
    }
  
    // Initialize editor
    if (window.editorManager) {
      const startingCode = level.startingCode || '# Write your Python code here\nprint("Hello, Python!")';
      window.editorManager.init('editor-container', startingCode);
    }
  
    // Clear console
    const consoleOutput = document.getElementById('console-output');
    if (consoleOutput) {
      consoleOutput.innerHTML = `Welcome to Level ${level.id}: ${level.title}\nWrite your code and click Run to test it!`;
    }
  
    // Setup level buttons
    setupLevelButtons(level);
  
    console.log(`UI: Level ${level.id} UI loaded successfully`);
  }
  
  function setupLevelButtons(level) {
    console.log("Setting up level buttons for level", level.id);
  
    // Setup Run Button
    const runBtn = document.getElementById('run-btn');
    if (runBtn) {
      // Remove existing listeners by cloning the button
      const newRunBtn = runBtn.cloneNode(true);
      runBtn.parentNode.replaceChild(newRunBtn, runBtn);
      
      newRunBtn.addEventListener('click', async function() {
        console.log("Run button clicked for level", level.id);
        
        newRunBtn.disabled = true;
        newRunBtn.textContent = "Running...";
        
        try {
          if (!window.editorManager || !window.pyodideRunner) {
            throw new Error("Required modules not available");
          }
          
          const code = window.editorManager.getCode();
          const consoleOutput = document.getElementById('console-output');
          
          if (consoleOutput) {
            consoleOutput.innerHTML = `<span class="log-info">Running your code...</span>\n`;
          }
          
          // Run the code
          const result = await window.pyodideRunner.run(code, level);
          console.log("Code execution result:", result);
          
          if (consoleOutput) {
            // Show output first
            if (result.output) {
              consoleOutput.innerHTML += `<span class="log-output">${result.output}</span>\n`;
            }
            
            // Check for errors
            if (result.error) {
              consoleOutput.innerHTML += `<span class="log-error">❌ Error: ${result.error}</span>\n`;
              consoleOutput.innerHTML += `<span class="log-info">💡 Need help? Click the Hint button!</span>\n`;
            } else {
              // No error - check if level is completed
              const isLevelCompleted = checkLevelCompletion(result, level);
              console.log("Level completion check:", isLevelCompleted);
              
              if (isLevelCompleted) {
                consoleOutput.innerHTML += `<span class="log-success">✅ Perfect! Level completed!</span>\n`;
                
                // Trigger level success after a short delay
                setTimeout(() => {
                  console.log("Triggering level success for level", level.id);
                  if (window.gameManager && window.gameManager.handleLevelSuccess) {
                    window.gameManager.handleLevelSuccess();
                  } else {
                    console.error("GameManager.handleLevelSuccess not available!");
                  }
                }, 1000);
              } else {
                // Level not completed - show what went wrong
                const expectedOutput = level.expectedOutput ? level.expectedOutput.trim() : '';
                const userOutput = result.output ? result.output.trim() : '';
                 
                consoleOutput.innerHTML += `<span class="log-error">🤔 Not quite right...</span>\n`;
                if (expectedOutput) {
                  consoleOutput.innerHTML += `<span class="log-error">Expected: "${expectedOutput}"</span>\n`;
                  consoleOutput.innerHTML += `<span class="log-error">Got: "${userOutput}"</span>\n`;
                }
                consoleOutput.innerHTML += `<span class="log-info">💡 Try again! Need help? Click the Hint button!</span>\n`;
              }
            }
            
            // Auto-scroll console
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
          }
          
        } catch (error) {
          console.error("Error running code:", error);
          const consoleOutput = document.getElementById('console-output');
          if (consoleOutput) {
            consoleOutput.innerHTML = `<span class="log-error">❌ System Error: ${error.message}</span>\n`;
          }
        } finally {
          newRunBtn.disabled = false;
          newRunBtn.textContent = "▶️ Run";
        }
      });
    }
    
    // Setup Hint Button
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn && level.hints && level.hints.length > 0) {
      const newHintBtn = hintBtn.cloneNode(true);
      hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);
      
      newHintBtn.disabled = false;
      const hintsUsed = window.gameManager?.hintsUsed || 0;
      
      if (hintsUsed >= 5) {
        newHintBtn.textContent = "💡 Show Solution";
      } else {
        newHintBtn.textContent = hintsUsed === 0 ? "💡 Hint" : `💡 Hint (${hintsUsed}/5)`;
      }
      
      newHintBtn.addEventListener('click', function() {
        console.log("Hint button clicked");
        
        if (window.gameManager) {
          window.gameManager.incrementHints();
        }
        
        const currentHints = window.gameManager?.hintsUsed || 1;
        let hintMessage = "";
        
        if (currentHints > 5) {
          hintMessage = getSolutionForLevel(level);
        } else {
          const hintIndex = Math.min(currentHints - 1, level.hints.length - 1);
          hintMessage = level.hints[hintIndex];
        }
        
        showHintModal(hintMessage, currentHints > 5);
           
        // Update hint button text
        this.textContent = currentHints >= 5 ? "💡 Show Solution" : `💡 Hint (${currentHints}/5)`;
      });
    } else if (hintBtn) {
      hintBtn.disabled = true;
      hintBtn.textContent = "💡 No Hints";
    }
  }

  // Add this new function to check level completion
  function checkLevelCompletion(result, level) {
    console.log("Checking level completion:", { result, level });
    
    // If there's an error, level is not completed
    if (result.error) {
      return false;
    }
    
    // If no expected output defined, assume any successful execution completes the level
    if (!level.expectedOutput) {
      return !result.error;
    }
    
    const userOutput = (result.output || '').trim();
    const expectedOutput = level.expectedOutput.trim();
    
    console.log("Comparing outputs:", { userOutput, expectedOutput });
    
    // For levels with user input, be more flexible
    if (level.hasUserInput) {
      return userOutput.includes(expectedOutput) || 
             expectedOutput.includes(userOutput) ||
             userOutput === expectedOutput;
    }
    
    // For exact match levels
    return userOutput === expectedOutput;
  }

  /***
   * Hint Modal - Display hints and solutions
   */
  function showHintModal(content, isSolution = false) {
    log(`Showing ${isSolution ? 'solution' : 'hint'}`);
    
    let modal = getEl('hint-modal');
    
    // Create modal if it doesn't exist
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hint-modal';
      modal.className = 'modal';
      
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${isSolution ? '🎯 Solution' : '💡 Hint'}</h2>
          </div>
          <div class="modal-body">
            <div class="${isSolution ? 'solution-container' : 'hint-content'}"></div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary close-hint">Got it!</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
    }
    
    // Update modal content
    const headerTitle = modal.querySelector('.modal-header h2');
    if (headerTitle) {
      headerTitle.textContent = isSolution ? '🎯 Solution' : '💡 Hint';
    }
    
    const contentDiv = modal.querySelector('.modal-body > div');
    if (contentDiv) {
      contentDiv.className = isSolution ? 'solution-container' : 'hint-content';
      
      if (isSolution) {
        contentDiv.innerHTML = `
          <p class="mb-2">Here's the solution:</p>
          <pre class="solution-code">${content}</pre>
          <p class="mb-0">Try to understand how it works before using it!</p>
        `;
      } else {
        contentDiv.textContent = content;
      }
    }
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Setup close button
    const closeBtn = modal.querySelector('.close-hint');
    if (closeBtn) {
      attachButtonListener(closeBtn, () => {
        modal.classList.add('hidden');
      });
    }
     
    // Close when clicking outside modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
  
  /**
   * Get Solution - Return solution code for a level
   */
  function getSolutionForLevel(level) {
    if (!level) return "No solution available.";
    
    const solutions = {
      1: 'print("Hello, Python World!")',
      2: 'print(15 + 25 * 2)',
      3: 'age = 16\nprint(age)',
      4: 'name = "Alex"\ngreeting = "Hello"\nprint(greeting + " " + name)',
      5: 'name = input("What is your name? ")\nprint("Welcome, " + name + "!")',
      6: 'score = 85\nif score > 80:\n    print("Great job!")'
    };
    
    return solutions[level.id] || "Solution not available for this level.";
  }
  
  /***
   * Victory Modal - Show completion feedback
   */
  function showVictoryModal(stars, level, nextAction, completionData) {
    console.log(`Showing victory modal: ${stars} stars for level ${level.id}`);
    
    let modal = document.getElementById('victory-modal');
    
    // Create modal if it doesn't exist
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'victory-modal';
      modal.className = 'modal';
      document.body.appendChild(modal);
    }
    
    // Create modal content
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🎉 Level ${level.id} Complete!</h2>
        </div>
        <div class="modal-body text-center">
          <div class="stars-display" style="justify-content: center; font-size: 2rem; margin-bottom: 16px;">
            ${Array.from({length: 3}, (_, i) => 
              `<span>${i < stars ? '⭐' : '☆'}</span>`
            ).join('')}
          </div>
          <p><strong>${level.title}</strong></p>
          <p style="color: #94a3b8; margin: 8px 0;">
            ${completionData?.hintsUsed || 0} hints used • 
            ${Math.round((completionData?.completionTime || 0) / 1000)}s
          </p>
          ${completionData?.isFirstCompletion ? '<p style="color: #10b981;">🎊 First time completed!</p>' : ''}
          ${completionData?.isNewRecord ? '<p style="color: #f59e0b;">⚡ New best time!</p>' : ''}
        </div>
        <div class="modal-actions">
          <button id="victory-repeat" class="btn btn-secondary">🔄 Retry Level</button>
          <button id="victory-continue" class="btn btn-primary">
            ${level.id < (window.gameLevels?.length || 6) ? '➡️ Next Level' : '🏆 Finish'}
          </button>
          <button id="victory-menu" class="btn btn-secondary">🗺️ Level Map</button>
        </div>
      </div>
    `;
    
    // Setup button handlers
    const repeatBtn = modal.querySelector('#victory-repeat');
    const continueBtn = modal.querySelector('#victory-continue');
    const menuBtn = modal.querySelector('#victory-menu');
    
    if (repeatBtn) {
      repeatBtn.onclick = () => {
        console.log("Repeat button clicked");
        modal.classList.add('hidden');
        if (window.gameManager && window.gameManager.startLevel) {
          window.gameManager.startLevel(level.id);
        }
      };
    }
    
    if (continueBtn) {
      continueBtn.onclick = () => {
        console.log("Continue button clicked");
        modal.classList.add('hidden');
        
        const nextLevelId = level.id + 1;
        const maxLevels = window.gameLevels?.length || 6;
        
        if (nextLevelId <= maxLevels) {
          if (window.gameManager && window.gameManager.startLevel) {
            window.gameManager.startLevel(nextLevelId);
          }
        } else {
          // All levels completed
          alert('🎉 Congratulations! You\'ve completed all levels!\n\nYou are now a Python Champion! 🏆');
          if (window.ui) window.ui.showView('level-map');
        }
      };
    }
    
    if (menuBtn) {
      menuBtn.onclick = () => {
        console.log("Menu button clicked");
        modal.classList.add('hidden');
        if (window.ui) window.ui.showView('level-map');
      };
    }
    
    // Show modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    // Close when clicking outside modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        if (window.ui) window.ui.showView('level-map');
      }
    });
  }
  
  /**
   * Progress Display - Update UI with completion stats
   */
  function updateProgressDisplay() {
    if (!window.gameManager) return;
    
    const progress = window.gameManager.calculateProgress();
    const stats = window.gameManager.getDetailedStats();
    
    // Update main progress text
    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.innerHTML = `
        ${progress.completed}/${progress.total} levels completed (${progress.percentage}%)<br>
        <small style="opacity: 0.7;">⭐ ${progress.totalStars}/${progress.maxPossibleStars} stars earned</small>
      `;
    }
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress.percentage}%`;
    }
    
    // Log detailed stats for debugging
    console.log('Progress Stats:', {
      completed: progress.completed,
      total: progress.total,
      percentage: progress.percentage,
      totalStars: progress.totalStars,
      gamesPlayed: progress.gamesPlayed,
      totalPlayTime: Math.round(stats.averagePlayTime / 1000) + 's'
    });
  }
  
  /**
   * Initialize UI System
   */
  function initializeUI() {
    log("Initializing UI system");
    
    // Initialize navigation buttons
    const navigationButtons = [
      { id: 'start-game-btn', action: () => showView('level-map') },
      { id: 'how-to-play-btn', action: () => showView('how-to-play') },
      { id: 'back-to-menu-btn', action: () => showView('splash-screen') },
      { id: 'level-map-to-menu-btn', action: () => showView('splash-screen') }
    ];
    
    navigationButtons.forEach(button => {
      const el = getEl(button.id);
      if (el) attachButtonListener(el, button.action);
    });
    
    // Initialize reset progress button
    const resetBtn = getEl('reset-progress-btn');
    if (resetBtn && window.gameManager) {
      attachButtonListener(resetBtn, () => window.gameManager.resetProgress());
    }
    
    log("UI system initialized");
  }
  
  /**
   * Main UI initialization
   */
  function init() {
    console.log("UI: Initializing");
    
    // Show splash screen initially
    showView('splash-screen');
    
    console.log("UI: Initialization complete");
  }
  
  // Public API
  return {
    init,
    getEl,
    showView,
    loadLevelUI,
    updateLevelMap,
    showVictoryModal,
    showHintModal,
    updateProgressDisplay,
    attachButtonListener
  };
})();

// Expose to global scope
window.ui = ui;