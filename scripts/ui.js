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
    // Handle both element objects and ID strings
    if (typeof element === 'string') {
      element = getEl(element);
    }
    
    if (!element || !handler) return;
    
    // Clone to remove existing listeners
    const newElement = element.cloneNode(true);
    if (element.parentNode) {
      element.parentNode.replaceChild(newElement, element);
    }
    
    // Attach new listener with error handling
    newElement.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      log(`Button clicked: ${newElement.id || newElement.className}`);
      
      try {
        handler(e);
      } catch (error) {
        console.error("Button handler error:", error);
      }
    });
    
    return newElement;
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
    console.log("Setting up level buttons");
  
    // Setup Run Button
    const runBtn = document.getElementById('run-btn');
    if (runBtn) {
      const newRunBtn = runBtn.cloneNode(true);
      runBtn.parentNode.replaceChild(newRunBtn, runBtn);
  
      newRunBtn.addEventListener('click', async function() {
        console.log("Run button clicked");
        
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
  
          const result = await window.pyodideRunner.run(code, level);
          
          if (consoleOutput) {
            if (result.output) {
              consoleOutput.innerHTML += `<span class="log-output">${result.output}</span>\n`;
            }
  
            if (result.error) {
              consoleOutput.innerHTML += `<span class="log-error">❌ Error: ${result.error}</span>\n`;
              consoleOutput.innerHTML += `<span class="log-info">Need help? Click the 💡 Hint button!</span>\n`;
            } else if (level.expectedOutput) {
              const userOutput = result.output.trim();
              const expectedOutput = level.expectedOutput.trim();
              
              if (userOutput === expectedOutput || (level.hasUserInput && userOutput.includes(expectedOutput))) {
                consoleOutput.innerHTML += `<span class="log-success">✅ Perfect! Level completed!</span>\n`;
                
                setTimeout(() => {
                  if (window.gameManager) {
                    window.gameManager.handleLevelSuccess();
                  }
                }, 1000);
              } else {
                consoleOutput.innerHTML += `<span class="log-error">🤔 Expected: "${expectedOutput}"</span>\n`;
                consoleOutput.innerHTML += `<span class="log-error">📝 Got: "${userOutput}"</span>\n`;
                consoleOutput.innerHTML += `<span class="log-info">Try again! Need help? Click the 💡 Hint button!</span>\n`;
              }
            }
            
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
      });
    } else if (hintBtn) {
      hintBtn.disabled = true;
      hintBtn.textContent = "💡 No Hints";
    }
  
    console.log("Level buttons setup complete");
  }
  
  /**
   * Run Button - Execute user's code
   */
  function setupRunButton(level) {
    log("Setting up run button");
    
    const runBtn = getEl('run-btn');
    if (!runBtn) return;
    
    attachButtonListener(runBtn, async () => {
      log("Run button clicked");
      
      runBtn.disabled = true;
      runBtn.innerHTML = '<span class="btn-icon">⏳</span> Running...';
      
      try {
        if (!window.editorManager || !window.pyodideRunner) {
          throw new Error("Code execution system not ready");
        }
        
        const code = window.editorManager.getCode();
        const consoleOutput = getEl('console-output');
        
        // Clear console
        if (consoleOutput) {
          consoleOutput.innerHTML = '<span class="log-info">Running your code...</span>';
        }
        
        // Run code
        const result = await window.pyodideRunner.run(code, level);
        
        // Handle result
        if (consoleOutput) {
          // Add output
          if (result.output) {
            consoleOutput.innerHTML += `<span class="log-output">${result.output}</span>`;
          }
          
          // Handle errors
          if (result.error) {
            consoleOutput.innerHTML += `<span class="log-error">Error: ${result.error}</span>`;
            consoleOutput.innerHTML += `<span class="log-info">Need help? Click the 💡 Hint button!</span>`;
          }
          // Check success
          else if (level.expectedOutput) {
            const userOutput = result.output.trim();
            const expectedOutput = level.expectedOutput.trim();
            
            if (userOutput === expectedOutput || 
                (level.hasUserInput && userOutput.includes(expectedOutput))) {
              
              consoleOutput.innerHTML += `<span class="log-success">✅ Success! Level completed!</span>`;
              
              setTimeout(() => {
                if (window.gameManager) {
                  window.gameManager.handleLevelSuccess();
                }
              }, 1000);
            } else {
              consoleOutput.innerHTML += `
                <span class="log-error">Expected: "${expectedOutput}"</span>
                <span class="log-error">Got: "${userOutput}"</span>
              `;
            }
          }
          
          // Scroll to bottom
          consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
      } catch (error) {
        log(`Error running code: ${error.message}`);
        
        const consoleOutput = getEl('console-output');
        if (consoleOutput) {
          consoleOutput.innerHTML = `<span class="log-error">System Error: ${error.message}</span>`;
        }
      } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="btn-icon">▶️</span> Run';
      }
    });
  }
  
  /**
   * Hint Button - Show progressive hints
   */
  function setupHintButton(level) {
    log("Setting up hint button");
    
    const hintBtn = getEl('hint-btn');
    if (!hintBtn) return;
    
    // Disable if no hints available
    if (!level || !level.hints || level.hints.length === 0) {
      hintBtn.disabled = true;
      return;
    }
    
    // Update hint button appearance
    const hintsUsed = window.gameManager?.hintsUsed || 0;
    hintBtn.innerHTML = hintsUsed >= 5 
      ? '<span class="btn-icon">💡</span> Show Solution' 
      : `<span class="btn-icon">💡</span> Hint${hintsUsed > 0 ? ` (${hintsUsed}/5)` : ''}`;
    
    attachButtonListener(hintBtn, () => {
      if (window.gameManager) {
        window.gameManager.incrementHints();
      }
      
      const currentHints = window.gameManager?.hintsUsed || 0;
      let hintText = '';
      let isSolution = false;
      
      if (currentHints > 5) {
        hintText = getSolutionForLevel(level);
        isSolution = true;
      } else {
        const hintIndex = Math.min(currentHints - 1, level.hints.length - 1);
        hintText = level.hints[hintIndex];
      }
      
      showHintModal(hintText, isSolution);
      
      // Update button text
      hintBtn.innerHTML = currentHints >= 5 
        ? '<span class="btn-icon">💡</span> Show Solution' 
        : `<span class="btn-icon">💡</span> Hint (${currentHints}/5)`;
    });
  }
  
  /**
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
  
  /**
   * Victory Modal - Show completion feedback
   */
  function showVictoryModal(stars, level, nextAction) {
    log(`Showing victory modal with ${stars} stars`);
    
    let modal = getEl('victory-modal');
    
    // Create modal if it doesn't exist
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'victory-modal';
      modal.className = 'modal';
      
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>🎉 Level Complete!</h2>
          </div>
          <div class="modal-body text-center">
            <div class="stars-display" id="victory-stars" style="justify-content: center; font-size: 2rem;"></div>
            <p class="mb-0">Great job! You completed Level ${level.id}!</p>
          </div>
          <div class="modal-actions">
            <button id="victory-prev" class="btn btn-secondary">⬅️ Previous</button>
            <button id="victory-repeat" class="btn btn-secondary">🔄 Repeat</button>
            <button id="victory-next" class="btn btn-primary">➡️ Next</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
    }
    
    // Update stars
    const starsContainer = modal.querySelector('#victory-stars');
    if (starsContainer) {
      starsContainer.innerHTML = Array.from({length: 3}, (_, i) => 
        `<span>${i < stars ? '⭐' : '☆'}</span>`
      ).join('');
    }
    
    // Setup button functionality
    const prevBtn = modal.querySelector('#victory-prev');
    const repeatBtn = modal.querySelector('#victory-repeat');
    const nextBtn = modal.querySelector('#victory-next');
    
    // Previous level button
    if (prevBtn) {
      const prevId = level.id - 1;
      const hasPrev = prevId > 0 && window.gameManager?.playerProgress?.unlockedLevels?.includes(prevId);
      
      prevBtn.disabled = !hasPrev;
      
      attachButtonListener(prevBtn, () => {
        modal.classList.add('hidden');
        if (hasPrev && window.gameManager) {
          window.gameManager.startLevel(prevId);
        }
      });
    }
    
    // Repeat level button
    if (repeatBtn) {
      attachButtonListener(repeatBtn, () => {
        modal.classList.add('hidden');
        if (window.gameManager) {
          window.gameManager.startLevel(level.id);
        }
      });
    }
    
    // Next level button
    if (nextBtn) {
      const nextId = level.id + 1;
      const hasNext = nextId <= window.gameLevels?.length;
      
      nextBtn.disabled = !hasNext;
      
      attachButtonListener(nextBtn, () => {
        modal.classList.add('hidden');
        if (hasNext && window.gameManager) {
          window.gameManager.startLevel(nextId);
        } else if (nextAction) {
          nextAction();
        }
      });
    }
    
    // Show modal
    modal.classList.remove('hidden');
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