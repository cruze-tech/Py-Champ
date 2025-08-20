const ui = (() => {
  console.log("UI Manager initializing");

  // Utility function to get elements
  function getEl(id) {
    return document.getElementById(id);
  }

  // Utility function to log messages
  function log(message) {
    console.log(`🔵 UI: ${message}`);
  }

  // Fixed attachButtonListener function
  function attachButtonListener(selector, handler) {
    // Handle both element and selector string
    let elements = [];
    
    if (typeof selector === 'string') {
      if (selector.startsWith('#')) {
        const el = document.getElementById(selector.substring(1));
        if (el) elements = [el];
      } else if (selector.startsWith('.')) {
        elements = Array.from(document.querySelectorAll(selector));
      } else {
        const el = document.getElementById(selector);
        if (el) elements = [el];
      }
    } else if (selector && selector.nodeType) {
      elements = [selector];
    }

    elements.forEach(element => {
      if (!element) return;

      // Remove existing event listeners by cloning
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);

      // Add new event listener
      newElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        log(`Button clicked: ${newElement.id || newElement.className}`);
        
        try {
          handler(e, newElement);
        } catch (error) {
          console.error('Button handler error:', error);
        }
      });

      log(`Event listener attached to: ${newElement.id || newElement.className}`);
    });
  }

  // Initialize all button event listeners
  function initializeButtons() {
    log("Initializing all buttons");

    // Splash screen buttons with enhanced debugging
    attachButtonListener('start-game-btn', () => {
      log("Start game clicked - beginning debug");
      
      // Check if gameManager exists
      if (!window.gameManager) {
        console.error("❌ GameManager not found!");
        alert("Game system not ready. Please refresh the page.");
        return;
      }
      
      console.log("✅ GameManager found:", window.gameManager);
      
      // Check if gameLevels exist
      if (!window.gameLevels) {
        console.error("❌ Game levels not found!");
        alert("Game levels not loaded. Please refresh the page.");
        return;
      }
      
      console.log("✅ Game levels found:", window.gameLevels.length, "levels");
      
      // Check if level map elements exist
      const levelMapView = getEl('level-map');
      const levelMapGrid = getEl('level-map-grid');
      
      console.log("Level map view element:", levelMapView);
      console.log("Level map grid element:", levelMapGrid);
      
      if (!levelMapView) {
        console.error("❌ Level map view not found in DOM!");
        alert("Level map not found. Please check the HTML structure.");
        return;
      }
      
      if (!levelMapGrid) {
        console.error("❌ Level map grid not found in DOM!");
        alert("Level map grid not found. Please check the HTML structure.");
        return;
      }
      
      // Try to show the level map
      log("Attempting to show level map view");
      showView('level-map');
      
      // Force update the level map after a short delay
      setTimeout(() => {
        log("Force updating level map");
        updateLevelMap();
      }, 200);
    });

    attachButtonListener('how-to-play-btn', () => {
      log("How to play clicked");
      showView('how-to-play');
    });

    attachButtonListener('reset-progress-btn', () => {
      log("Reset progress clicked");
      if (window.gameManager) {
        window.gameManager.resetProgress();
      }
    });

    // Back to menu buttons
    attachButtonListener('back-to-menu-btn', () => {
      log("Back to menu clicked");
      showView('splash-screen');
    });

    attachButtonListener('level-map-to-menu-btn', () => {
      log("Level map to menu clicked");
      showView('splash-screen');
    });

    // Generic back-to-menu class buttons
    attachButtonListener('.back-to-menu', () => {
      log("Generic back to menu clicked");
      showView('splash-screen');
    });

    // Modal close buttons
    attachButtonListener('.close-hint', () => {
      log("Hint modal close clicked");
      const modal = getEl('hint-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    });

    attachButtonListener('.close-victory', () => {
      log("Victory modal close clicked");
      const modal = getEl('victory-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    });

    log("All buttons initialized");
  }

  // Enhanced showView function with debugging
  function showView(viewName) {
    log(`Showing view: ${viewName}`);
    
    const views = ['splash-screen', 'level-map', 'gameplay', 'how-to-play'];
    
    // Debug: Check if all view elements exist
    views.forEach(view => {
      const element = getEl(view);
      console.log(`View "${view}" element:`, element);
    });
    
    views.forEach(view => {
      const element = getEl(view);
      if (element) {
        if (view === viewName) {
          element.classList.remove('hidden');
          element.style.display = 'block';
          console.log(`✅ Showing view: ${view}`);
        } else {
          element.classList.add('hidden');
          element.style.display = 'none';
        }
      } else {
        console.error(`❌ View element not found: ${view}`);
      }
    });

    // Special handling for specific views
    if (viewName === 'level-map') {
      log("Level map view requested - scheduling update");
      setTimeout(() => {
        log("Executing level map update");
        updateLevelMap();
      }, 100);
    } else if (viewName === 'splash-screen') {
      setTimeout(() => updateProgressDisplay(), 100);
    }
    
    console.log(`View switching complete. Current view should be: ${viewName}`);
  }

  // Enhanced updateLevelMap with extensive debugging
  function updateLevelMap() {
    log("=== UPDATE LEVEL MAP DEBUG START ===");
    
    const levelMapGrid = getEl('level-map-grid');
    console.log("Level map grid element:", levelMapGrid);
    
    if (!levelMapGrid) {
      console.error("❌ Level map grid not found!");
      return;
    }

    if (!window.gameLevels) {
      console.error("❌ Game levels not available!");
      levelMapGrid.innerHTML = '<p style="color: red; padding: 20px;">❌ Game levels not loaded!</p>';
      return;
    }

    console.log("✅ Game levels available:", window.gameLevels.length);

    // Clear existing content
    levelMapGrid.innerHTML = '';
    console.log("Level map grid cleared");

    // Get player progress
    const progress = window.gameManager?.playerProgress || { 
      unlockedLevels: [1], 
      completedLevels: [], 
      levelScores: {} 
    };
    
    console.log("Player progress:", progress);

    // Create level cards
    let cardsCreated = 0;
    window.gameLevels.forEach((level, index) => {
      console.log(`Creating card for level ${level.id}:`, level.title);
      
      const isUnlocked = progress.unlockedLevels.includes(level.id);
      const isCompleted = progress.completedLevels.includes(level.id);
      const stars = progress.levelScores[level.id] || 0;

      const levelCard = document.createElement('div');
      levelCard.className = `level-card ${isUnlocked ? '' : 'locked'}`;
      
      levelCard.innerHTML = `
        <h4>Level ${level.id}: ${level.title}</h4>
        <div class="meta">Concepts: ${level.concepts}</div>
        <div class="stars-display">
          ${Array.from({length: 3}, (_, i) => 
            `<span>${i < stars ? '⭐' : '☆'}</span>`
          ).join('')}
        </div>
        <div class="actions">
          ${isUnlocked ? 
            `<button class="btn btn-primary play-level-btn" data-level-id="${level.id}">
              ${isCompleted ? '🔄 Replay' : '▶️ Play'}
            </button>` : 
            '<span class="locked-text">🔒 Locked</span>'
          }
        </div>
      `;

      levelMapGrid.appendChild(levelCard);
      cardsCreated++;
      console.log(`✅ Level card ${level.id} added to grid`);
    });

    console.log(`Total cards created: ${cardsCreated}`);

    // Add event delegation for play buttons
    levelMapGrid.addEventListener('click', function(e) {
      if (e.target.classList.contains('play-level-btn')) {
        e.preventDefault();
        e.stopPropagation();
        
        const levelId = parseInt(e.target.dataset.levelId);
        console.log(`🎮 Play button clicked for level ${levelId}`);
        
        if (window.gameManager) {
          window.gameManager.startLevel(levelId);
        } else {
          console.error("❌ GameManager not available");
          alert("Game system not ready. Please refresh the page.");
        }
      }
    });

    console.log("Event delegation attached to level map grid");

    // Update progress display
    updateProgressDisplay();
    
    // Final verification
    const finalCardCount = levelMapGrid.children.length;
    console.log(`Final verification: ${finalCardCount} cards in level map grid`);
    
    if (finalCardCount === 0) {
      levelMapGrid.innerHTML = '<p style="color: red; padding: 20px;">❌ No level cards were created!</p>';
    }
    
    log("=== UPDATE LEVEL MAP DEBUG END ===");
  }

  // Load level UI
  function loadLevelUI(level) {
    log(`Loading UI for Level ${level.id}: ${level.title}`);
    
    // Set titles
    const titleElements = ['level-title-scene', 'level-title-dialogue'];
    titleElements.forEach(id => {
      const el = getEl(id);
      if (el) el.textContent = `Level ${level.id}: ${level.title}`;
    });
    
    // Set dialogue
    const dialogue = getEl('npc-dialogue');
    if (dialogue) {
      dialogue.innerHTML = `<p>${level.dialogue}</p>`;
    }
    
    // Set instructions
    const instructions = getEl('instructions');
    if (instructions) {
      instructions.innerHTML = `<p>${level.instructions}</p>`;
    }
    
    // Set scene
    const scene = getEl('scene-container');
    if (scene) {
      if (window.SVGAssets && level.scene && window.SVGAssets[level.scene]) {
        scene.innerHTML = window.SVGAssets[level.scene];
      } else {
        scene.innerHTML = `<div style="padding: 20px; text-align: center; color: #64748b;">
          <h3>Level ${level.id}</h3>
          <p>${level.title}</p>
        </div>`;
      }
    }
    
    // Initialize editor
    if (window.editorManager) {
      window.editorManager.init('editor-container', level.startingCode || '');
    }
    
    // Clear console
    const consoleOutput = getEl('console-output');
    if (consoleOutput) {
      consoleOutput.innerHTML = `<span class="log-info">Welcome to Level ${level.id}: ${level.title}</span>\n`;
      consoleOutput.innerHTML += `<span class="log-info">Click the Run button when you're ready!</span>\n`;
    }
    
    // Set up level-specific buttons
    setupLevelButtons(level);
    
    log(`Level ${level.id} UI loaded successfully`);
  }

  // Setup level-specific buttons (run, hint, navigation)
  function setupLevelButtons(level) {
    log("Setting up level buttons");

    // Setup Run Button
    const runBtn = getEl('run-btn');
    if (runBtn) {
      // Remove existing listeners
      const newRunBtn = runBtn.cloneNode(true);
      runBtn.parentNode.replaceChild(newRunBtn, runBtn);

      newRunBtn.addEventListener('click', async function() {
        log("Run button clicked");
        
        newRunBtn.disabled = true;
        newRunBtn.textContent = "Running...";
        
        try {
          if (!window.editorManager || !window.pyodideRunner) {
            throw new Error("Required modules not available");
          }

          const code = window.editorManager.getCode();
          const consoleOutput = getEl('console-output');
          
          // Clear console
          if (consoleOutput) {
            consoleOutput.innerHTML = `<span class="log-info">Running your code...</span>\n`;
          }

          const result = await window.pyodideRunner.run(code, level);
          
          if (consoleOutput) {
            // Add output
            if (result.output) {
              consoleOutput.innerHTML += `<span class="log-output">${result.output}</span>\n`;
            }

            // Handle errors
            if (result.error) {
              consoleOutput.innerHTML += `<span class="log-error">❌ Error: ${result.error}</span>\n`;
              
              // Add helpful tips for common errors
              if (result.error.includes("SyntaxError")) {
                consoleOutput.innerHTML += `<span class="log-info">💡 Tip: Check your syntax - make sure text is in quotes and parentheses match!</span>\n`;
              }
              consoleOutput.innerHTML += `<span class="log-info">Need help? Click the 💡 Hint button!</span>\n`;
            } else if (level.expectedOutput) {
              // Check if output matches expected
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
            
            // Scroll to bottom
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
          }
        } catch (error) {
          console.error("Error running code:", error);
          const consoleOutput = getEl('console-output');
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
    const hintBtn = getEl('hint-btn');
    if (hintBtn && level.hints && level.hints.length > 0) {
      // Remove existing listeners
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
        log("Hint button clicked");
        
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

    log("Level buttons setup complete");
  }

  // Show hint modal
  function showHintModal(hint, isSolution = false) {
    log(`Showing ${isSolution ? "solution" : "hint"}: "${hint}"`);
    
    let modal = getEl('hint-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hint-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${isSolution ? "🎯 Solution" : "💡 Hint"}</h2>
          </div>
          <div class="modal-body">
            <div class="hint-content"></div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary close-hint">Got it!</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add close functionality
      modal.querySelector('.close-hint').addEventListener('click', function() {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      });
      
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.style.display = 'none';
        }
      });
    }
    
    // Update content
    const content = modal.querySelector('.hint-content');
    if (isSolution) {
      content.innerHTML = `
        <div class="solution-container">
          <p class="solution-intro">Here's the solution:</p>
          <pre class="solution-code">${hint}</pre>
          <p class="solution-note">Try to understand how it works!</p>
        </div>
      `;
    } else {
      content.textContent = hint;
      content.className = 'hint-content';
    }
    
    // Show modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  // Get solution for level
  function getSolutionForLevel(level) {
    const solutions = {
      1: 'print("Hello, Python World!")',
      2: 'print(15 + 25 * 2)',
      3: 'age = 16\nprint(age)',
      4: 'name = "Alex"\ngreeting = "Hello"\nprint(greeting + " " + name)',
      5: 'name = input("What is your name? ")\nprint("Welcome, " + name + "!")',
      6: 'score = 85\nif score > 80:\n    print("Great job!")'
    };
    return solutions[level.id] || "No solution available.";
  }

  // Show victory modal
  function showVictoryModal(stars, level, nextAction) {
    log(`Showing victory modal with ${stars} stars`);

    let modal = getEl('victory-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'victory-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>🎉 Level Complete!</h2>
          </div>
          <div class="modal-body">
            <div class="stars-display" id="victory-stars"></div>
            <p>Great job! You completed Level ${level.id}!</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" id="victory-repeat">🔄 Repeat</button>
            <button class="btn btn-primary" id="victory-next">➡️ Continue</button>
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

    // Setup buttons
    const repeatBtn = modal.querySelector('#victory-repeat');
    const nextBtn = modal.querySelector('#victory-next');

    if (repeatBtn) {
      repeatBtn.onclick = () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        if (window.gameManager) {
          window.gameManager.startLevel(level.id);
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        const nextLevel = level.id + 1;
        if (nextLevel <= window.gameLevels?.length) {
          if (window.gameManager) {
            window.gameManager.startLevel(nextLevel);
          }
        } else {
          showView('level-map');
        }
      };
    }

    // Show modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  // Update progress display
  function updateProgressDisplay() {
    if (!window.gameManager) return;
    
    const progress = window.gameManager.calculateProgress();
    
    const progressText = getEl('progress-text');
    if (progressText) {
      progressText.textContent = `${progress.completed}/${progress.total} levels completed (${progress.percentage}%)`;
    }
    
    const progressFill = getEl('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress.percentage}%`;
    }
  }

  // Initialize UI
  function init() {
    log("Initializing UI");
    
    // Initialize buttons after a short delay to ensure DOM is ready
    setTimeout(() => {
      initializeButtons();
    }, 100);
    
    // Show initial view
    showView('splash-screen');
    
    log("UI initialization complete");
  }

  // Public API
  return {
    init,
    showView,
    loadLevelUI,
    updateLevelMap,
    showVictoryModal,
    updateProgressDisplay,
    attachButtonListener,
    showHintModal,
    getSolutionForLevel
  };
})();

window.ui = ui;