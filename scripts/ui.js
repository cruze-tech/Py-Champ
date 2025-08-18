const ui = (() => {
  // Debug helper
  function log(msg) {
    console.log(`🔵 UI: ${msg}`);
  }

  log("UI module initializing");

  const getEl = (id) => document.getElementById(id);

  const modals = {
    'hint-modal': getEl('hint-modal'),
    'victory-modal': getEl('victory-modal'),
  };

  function debounce(fn, wait = 250) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function attachButtonListener(el, cb, options = {}) {
    if (!el) {
      log(`Button not found: ${el}`);
      return;
    }

    const handler = () => {
      log(`Button clicked: ${el.id || el.className}`);
      cb();
    };

    el.addEventListener('click', handler);
    log(`Attached listener to button: ${el.id || el.className}`);
  }

  function showView(viewId) {
    log(`Showing view: ${viewId}`);

    // Hide all views first
    const views = ['splash-screen', 'how-to-play', 'level-map-container', 'gameplay-container'];
    views.forEach(id => {
      const el = getEl(id);
      if (el) {
        el.classList.add('hidden');
        el.style.display = 'none';
      }
    });

    // Show the requested view
    const view = getEl(viewId);
    if (view) {
      view.classList.remove('hidden');
      view.style.display = 'block';
      log(`View ${viewId} is now visible`);
    } else {
      log(`View not found: ${viewId}`);
    }
  }

  function renderLevelMap(progress) {
    log("Rendering level map");
    const map = getEl('level-map');
    if (!map) {
      log("Level map container not found");
      return;
    }

    map.innerHTML = '';

    // Add level cards
    for (const level of window.gameLevels || []) {
      const unlocked = progress.unlockedLevels.includes(level.id);
      const completed = progress.levelsCompleted[level.id];

      const card = document.createElement('div');
      card.className = `level-card ${unlocked ? '' : 'locked'}`;

      card.innerHTML = `
        <h4>Level ${level.id}: ${level.title}</h4>
        <div class="meta">${level.concepts}</div>
        <div class="actions">
          <button class="btn btn-primary play-btn" ${unlocked ? '' : 'disabled'}>Play</button>
        </div>
      `;

      const playBtn = card.querySelector('.play-btn');
      if (playBtn && unlocked) {
        playBtn.addEventListener('click', () => {
          log(`Starting level: ${level.id}`);
          if (window.gameManager) {
            window.gameManager.startLevel(level.id);
          }
        });
      }

      map.appendChild(card);
    }

    log("Level map rendered");
  }

  function loadLevelUI(level) {
    log(`Loading UI for Level ${level.id}: ${level.title}`);
    
    // Set titles
    const titleElements = ['level-title-scene', 'level-title-dialogue'];
    for (const id of titleElements) {
      const el = getEl(id);
      if (el) {
        el.textContent = `Level ${level.id}: ${level.title}`;
      }
    }
    
    // Set dialogue
    const dialogue = getEl('npc-dialogue');
    if (dialogue) {
      dialogue.innerHTML = `<p>${level.dialogue}</p>`;
    } else {
      log("Warning: npc-dialogue element not found");
    }
    
    // Set instructions
    const instructions = getEl('instructions');
    if (instructions) {
      instructions.innerHTML = `<p>${level.instructions}</p>`;
    } else {
      log("Warning: instructions element not found");
    }
    
    // Set scene
    const scene = getEl('scene-container');
    if (scene) {
      if (window.SVGAssets && level.scene && window.SVGAssets[level.scene]) {
        scene.innerHTML = window.SVGAssets[level.scene];
        log(`Loaded scene SVG: ${level.scene}`);
      } else {
        log(`Warning: scene SVG not found for ${level.scene}, using default`);
        scene.innerHTML = `<div>Level ${level.id}</div>`;
      }
    } else {
      log("Warning: scene-container element not found");
    }
    
    // Initialize editor
    if (window.editorManager) {
      window.editorManager.init('editor-container', level.startingCode || '');
      log("Editor initialized with starting code");
    } else {
      log("Warning: editorManager not found");
    }
    
    // Clear console
    const consoleOutput = getEl('console-output');
    if (consoleOutput) {
      consoleOutput.innerHTML = `<span class="log-info">Welcome to Level ${level.id}: ${level.title}</span>`;
    } else {
      log("Warning: console-output element not found");
    }
    
    // Debug hints
    log(`Level has ${level.hints ? level.hints.length : 0} hints available`);
    if (level.hints && level.hints.length > 0) {
      log(`First hint: "${level.hints[0]}"`);
    }
    
    // Set up navigation
    setupLevelNavigation(level);
    setupRunButton(level);
    setupHintButton(level); // Make sure hint button is set up
    
    log(`Level ${level.id} UI loaded successfully`);
  }

  function setupLevelNavigation(level) {
    log(`Setting up navigation for Level ${level.id}`);

    const prevBtn = getEl('prev-level-btn');
    const nextBtn = getEl('next-level-btn');

    const prevId = level.id - 1;
    const nextId = level.id + 1;

    if (prevBtn) {
      const hasPrev = prevId > 0 && window.gameManager?.playerProgress?.unlockedLevels?.includes(prevId);
      prevBtn.disabled = !hasPrev;

      if (hasPrev) {
        attachButtonListener(prevBtn, () => {
          log(`Navigating to previous level: ${prevId}`);
          window.gameManager.startLevel(prevId);
        });
      }
    }

    if (nextBtn) {
      const hasNext = window.gameManager?.playerProgress?.unlockedLevels?.includes(nextId);
      nextBtn.disabled = !hasNext;

      if (hasNext) {
        attachButtonListener(nextBtn, () => {
          log(`Navigating to next level: ${nextId}`);
          window.gameManager.startLevel(nextId);
        });
      }
    }
  }

  // Fixing the setupRunButton function which has issues

  function setupRunButton(level) {
    log("Setting up run button");

    const runBtn = getEl('run-btn');
    if (!runBtn) {
      log("Run button not found");
      return;
    }

    attachButtonListener(runBtn, async () => {
      log("Run button clicked");

      runBtn.disabled = true;
      runBtn.textContent = "Running...";

      try {
        if (!window.editorManager || !window.pyodideRunner) {
          throw new Error("Required modules not available");
        }

        const code = window.editorManager.getCode();
        const result = await window.pyodideRunner.run(code, level);

        const consoleOutput = getEl('console-output');
        if (consoleOutput) {
          // Clear previous output for fresh start
          consoleOutput.innerHTML = `<span class="log-info">Running your code...</span>\n`;
          
          // Add output
          if (result.output) {
            consoleOutput.innerHTML += `<span class="log-output">${result.output}</span>\n`;
          }

          // Enhanced error handling with beginner-friendly explanations
          if (result.error) {
            consoleOutput.innerHTML += `<span class="log-error">❌ Error: ${result.error}</span>\n`;
             
            // Add beginner-friendly explanations for common errors
            if (result.error.includes("SyntaxError")) {
              if (result.error.includes("Perhaps you forgot a comma?") || 
                  result.error.includes("invalid syntax")) {
                consoleOutput.innerHTML += `<span class="log-info">💡 Tip: In Python, text needs to be surrounded by quotes like this: 
  print("Hello, Python World!")</span>\n`;
              } else if (result.error.includes("EOL while scanning string literal")) {
                consoleOutput.innerHTML += `<span class="log-info">💡 Tip: You're missing a closing quote mark. Make sure your text starts and ends with quotes:
  print("Hello, Python World!")</span>\n`;
              } else if (result.error.includes("unexpected indent")) {
                consoleOutput.innerHTML += `<span class="log-info">💡 Tip: Python uses indentation for code blocks. Make sure you're not adding extra spaces at the beginning of your line.</span>\n`;
              }
            } else if (result.error.includes("NameError")) {
              consoleOutput.innerHTML += `<span class="log-info">💡 Tip: Python can't find a variable with this name. Did you define it? Remember, variable names are case sensitive and need to be defined before use.</span>\n`;
            } else if (result.error.includes("TypeError")) {
              consoleOutput.innerHTML += `<span class="log-info">💡 Tip: You're trying to combine different types that don't work together. For example, you might be adding a number to text without converting them.</span>\n`;
            }
            
            consoleOutput.innerHTML += `<span class="log-info">🤔 Check Level Instructions: Make sure you're following the instructions exactly.</span>\n`;
          }

          // Enhanced success checking
          if (!result.error && level.expectedOutput) {
            const userOutput = result.output.trim();
            const expectedOutput = level.expectedOutput.trim();
            
            // For input levels, check if output contains expected pattern
            if (level.hasUserInput) {
              if (userOutput.includes(expectedOutput)) {
                consoleOutput.innerHTML += `<span class="log-success">✅ Perfect! Your program works correctly!</span>\n`;
                consoleOutput.innerHTML += `<span class="log-info">🎉 Level completed! Well done!</span>\n`;
                
                setTimeout(() => {
                  if (window.gameManager) {
                    window.gameManager.handleLevelSuccess();
                  }
                }, 1000);
              } else {
                consoleOutput.innerHTML += `<span class="log-error">🤔 Close, but not quite right. Check the expected output format.</span>\n`;
                if (level.id === 1) {
                  consoleOutput.innerHTML += `<span class="log-info">💡 Tip: Make sure you're printing exactly: Hello, Python World!</span>\n`;
                }
              }
            } else {
              // Regular exact match for other levels
              if (userOutput === expectedOutput) {
                consoleOutput.innerHTML += `<span class="log-success">✅ Perfect! Output matches expected result!</span>\n`;
                consoleOutput.innerHTML += `<span class="log-info">🎉 Level completed! Moving to next challenge...</span>\n`;

                setTimeout(() => {
                  if (window.gameManager) {
                    window.gameManager.handleLevelSuccess();
                  }
                }, 1000);
              } else {
                consoleOutput.innerHTML += `<span class="log-error">🤔 Expected: "${expectedOutput}"</span>\n`;
                consoleOutput.innerHTML += `<span class="log-error">📝 Got: "${userOutput}"</span>\n`;
                
                // Level-specific hints
                if (level.id === 1) {
                  consoleOutput.innerHTML += `<span class="log-info">💡 Tip: Make sure you're typing exactly: print("Hello, Python World!")</span>\n`;
                } else if (level.id === 2) {
                  consoleOutput.innerHTML += `<span class="log-info">💡 Tip: Remember that Python calculates multiplication (*) before addition (+).</span>\n`;
                }
              }
            }
          } else if (!result.error && !level.expectedOutput) {
            // Free-form coding level
            consoleOutput.innerHTML += `<span class="log-success">✅ Code executed successfully!</span>\n`;
          }

          // Add hint suggestion after errors
          if (result.error || (level.expectedOutput && result.output.trim() !== level.expectedOutput.trim())) {
            consoleOutput.innerHTML += `<span class="log-info">Need help? Click the 💡 Hint button!</span>\n`;
          }

          // Scroll to bottom
          consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
      } catch (error) {
        log(`Error running code: ${error.message}`);
        const consoleOutput = getEl('console-output');
        if (consoleOutput) {
          consoleOutput.innerHTML += `<span class="log-error">❌ System Error: ${error.message}</span>\n`;
          consoleOutput.innerHTML += `<span class="log-info">Try refreshing the page if this persists.</span>\n`;
        }
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = "▶️ Run";
      }
    });
  }

  function setupHintButton(level) {
    log("Setting up hint button");
    
    const hintBtn = getEl('hint-btn');
    if (!hintBtn) {
      log("Hint button not found");
      return;
    }
        
    // Remove any existing event listeners by cloning the button
    const newHintBtn = hintBtn.cloneNode(true);
    hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);
    
    const btn = getEl('hint-btn'); // Get the new button
    
    if (!level.hints || level.hints.length === 0) {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.title = "No hints available for this level";
      log("No hints available for this level");
      return;
    }
    
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.title = "Click for a hint";
    
    attachButtonListener(btn, () => {
      log("Hint button clicked - showing hint");
      
      if (window.gameManager) {
        window.gameManager.incrementHints();
      }
      
      // Get a random hint or the first one
      const hintIndex = Math.floor(Math.random() * level.hints.length);
      const hint = level.hints[hintIndex];
      
      showHintModal(hint);
    });
    
    log(`Hint button setup complete for level ${level.id}`);
  }

  function showHintModal(hint) {
    log(`Showing hint: "${hint}"`);
    
    // Get modal element
    const modal = document.getElementById('hint-modal');
    if (!modal) {
      console.error("Hint modal not found in DOM");
      // Fallback to alert if modal is missing
      alert(`💡 Hint: ${hint}`);
      return;
    }
    
    // Update hint content
    const hintContent = modal.querySelector('.hint-content');
    if (hintContent) {
      hintContent.textContent = hint;
    } else {
      console.error("Hint content element not found");
      // Try to find any element to put our content in
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        modalBody.innerHTML = `<p class="hint-content">${hint}</p>`;
      } else {
        // Last resort: create content
        modal.innerHTML = `
          <div class="modal-content">
            <div class="modal-header">
              <h2>Hint</h2>
            </div>
            <div class="modal-body">
              <p class="hint-content">${hint}</p>
            </div>
            <div class="modal-actions">
              <button class="btn btn-primary close-hint">Got it</button>
            </div>
          </div>
        `;
      }
    }
    
    // Make sure the modal is visible
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    // Set up close button
    const closeBtn = modal.querySelector('.close-hint');
    if (closeBtn) {
      closeBtn.onclick = function() {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      };
    }
    
    // Also close when clicking outside the modal content
    modal.onclick = function(event) {
      if (event.target === modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    };
    
    log("Hint modal displayed");
  }

  // Fixing the showVictoryModal function

  function showVictoryModal(stars, level, nextAction) {
    log(`Showing victory modal with ${stars} stars`);

    const modal = getEl('victory-modal');
    if (!modal) {
      log("Victory modal not found");
      return;
    }

    const starsContainer = modal.querySelector('#victory-stars');
    if (starsContainer) {
      starsContainer.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.textContent = i < stars ? '⭐' : '☆';
        starsContainer.appendChild(star);
      }
    }

    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    // Setup buttons
    const prevBtn = modal.querySelector('#victory-prev');
    const repeatBtn = modal.querySelector('#victory-repeat');
    const nextBtn = modal.querySelector('#victory-next');

    const prevId = level.id - 1;
    const nextId = level.id + 1;

    // Previous level
    if (prevBtn) {
      const hasPrev = prevId > 0 && window.gameManager?.playerProgress?.unlockedLevels?.includes(prevId);
      prevBtn.disabled = !hasPrev;

      prevBtn.onclick = () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        if (hasPrev && window.gameManager) {
          window.gameManager.startLevel(prevId);
        }
      };
    }

    // Repeat level
    if (repeatBtn) {
      repeatBtn.onclick = () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        if (window.gameManager) {
          window.gameManager.startLevel(level.id);
        }
      };
    }

    // Next level
    if (nextBtn) {
      const hasNext = nextId <= window.gameLevels?.length;
      nextBtn.disabled = !hasNext;

      nextBtn.onclick = () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        if (hasNext && window.gameManager) {
          window.gameManager.startLevel(nextId);
        } else if (nextAction) {
          nextAction();
        }
      };
    }
  }

  function updateOverallProgress() {
    log("Updating overall progress");

    const progressEl = getEl('overall-progress');
    if (!progressEl || !window.gameManager?.playerProgress) {
      return;
    }

    const completed = Object.keys(window.gameManager.playerProgress.levelsCompleted).length;
    const total = window.gameLevels?.length || 0;
    const percent = Math.round((completed / total) * 100) || 0;

    progressEl.innerHTML = `
      <div>Progress: ${completed}/${total} (${percent}%)</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
    `;

    log(`Progress updated: ${completed}/${total}`);
  }

  // Initialize the module
  log("UI module ready");

  return {
    getEl,
    debounce,
    attachButtonListener,
    showView,
    renderLevelMap,
    loadLevelUI,
    showHintModal,
    showVictoryModal,
    updateOverallProgress
  };
})();