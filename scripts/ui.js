const ui = (() => {
    const getEl = (id) => document.getElementById(id);

    const modals = {
        'hint-modal': getEl('hint-modal'),
        'victory-modal': getEl('victory-modal'),
        'input-modal': getEl('input-modal'),
    };

    function showView(viewId) {
        ['splash-screen', 'level-map-container', 'gameplay-container', 'how-to-play'].forEach((id) => {
            const el = getEl(id);
            if (el) {
                if (id === viewId) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            }
        });
    }

    function renderLevelMap(progress) {
        console.log("🗺️ Rendering level map with progress:", progress);
        
        const container = document.getElementById('level-map-svg-container');
        if (!container) {
            console.error('❌ Level map container not found!');
            return;
        }
        
        // Insert the base map
        container.innerHTML = SVGAssets.world_map;

        // Wait for DOM to be ready
        setTimeout(() => {
            console.log('🎮 Setting up level map interactions...');
            
            // Update each level node
            gameLevels.forEach((level) => {
                const nodeEl = container.querySelector(`#map-node-${level.id}`);
                if (!nodeEl) {
                    console.warn(`⚠️ Node map-node-${level.id} not found`);
                    return;
                }
                
                const isCompleted = !!progress.levelsCompleted[level.id];
                const isUnlocked = progress.unlockedLevels.includes(level.id);
                
                // 🔧 FIX: Simplified access logic - if unlocked OR completed, it's accessible
                const isAccessible = isUnlocked || isCompleted;

                console.log(`Level ${level.id}: completed=${isCompleted}, unlocked=${isUnlocked}, accessible=${isAccessible}`);

                // Clear existing classes and styles
                nodeEl.classList.remove('completed', 'unlocked', 'locked');
                nodeEl.style.cursor = '';
                nodeEl.style.opacity = '';
                
                // Update appearance based on status
                if (isCompleted) {
                    console.log(`✅ Level ${level.id} is completed - making it green with checkmark`);
                    nodeEl.classList.add('completed');
                    
                    const circle = nodeEl.querySelector('circle');
                    const numberText = nodeEl.querySelector('text');
                    
                    if (circle) {
                        circle.setAttribute('fill', '#2ecc71');
                        circle.setAttribute('stroke', '#27ae60');
                    }
                    
                    if (numberText) {
                        numberText.textContent = '✓';
                        numberText.setAttribute('font-size', '24');
                        numberText.setAttribute('fill', '#ffffff');
                    }
                } else if (isUnlocked) {
                    console.log(`🔓 Level ${level.id} is unlocked - making it yellow`);
                    nodeEl.classList.add('unlocked');
                    
                    const circle = nodeEl.querySelector('circle');
                    const numberText = nodeEl.querySelector('text');
                    
                    if (circle) {
                        circle.setAttribute('fill', '#f1c40f');
                        circle.setAttribute('stroke', '#f39c12');
                    }
                    
                    if (numberText) {
                        numberText.textContent = level.id;
                        numberText.setAttribute('font-size', '20');
                        numberText.setAttribute('fill', '#2c3e50');
                    }
                } else {
                    console.log(`🔒 Level ${level.id} is locked - making it gray`);
                    nodeEl.classList.add('locked');
                    nodeEl.style.opacity = '0.6';
                    
                    const circle = nodeEl.querySelector('circle');
                    const numberText = nodeEl.querySelector('text');
                    
                    if (circle) {
                        circle.setAttribute('fill', '#95a5a6');
                        circle.setAttribute('stroke', '#7f8c8d');
                    }
                    
                    if (numberText) {
                        numberText.textContent = '🔒';
                        numberText.setAttribute('font-size', '18');
                        numberText.setAttribute('fill', '#7f8c8d');
                    }
                }

                // 🔧 FIX: Add interactivity for accessible levels
                if (isAccessible) {
                    // Create a fresh node to avoid event listener conflicts
                    const newNode = nodeEl.cloneNode(true);
                    nodeEl.parentNode.replaceChild(newNode, nodeEl);
                    
                    newNode.style.cursor = 'pointer';
                    
                    // 🔧 FIX: Simplified click handler
                    newNode.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`🎯 Level ${level.id} clicked - Starting level immediately`);
                        
                        // Visual feedback
                        const circle = newNode.querySelector('circle');
                        if (circle) {
                            circle.style.transform = 'scale(1.1)';
                            circle.style.transition = 'transform 0.2s ease';
                            
                            setTimeout(() => {
                                circle.style.transform = 'scale(1)';
                            }, 200);
                        }
                        
                        // Start level immediately - no delays
                        gameManager.startLevel(level.id);
                    });
                    
                    // Hover effects
                    newNode.addEventListener('mouseenter', () => {
                        const circle = newNode.querySelector('circle');
                        if (circle) {
                            circle.style.transform = 'scale(1.05)';
                            circle.style.transition = 'transform 0.2s ease';
                        }
                    });
                    
                    newNode.addEventListener('mouseleave', () => {
                        const circle = newNode.querySelector('circle');
                        if (circle) {
                            circle.style.transform = 'scale(1)';
                        }
                    });
                    
                    // Enhanced tooltips
                    if (isCompleted) {
                        const levelData = progress.levelsCompleted[level.id];
                        const stars = '⭐'.repeat(levelData.stars || 0);
                        newNode.setAttribute('title', `${level.title} - COMPLETED ${stars}\n⏱️ Time: ${levelData.timeMinutes || 0}min • 💡 Hints: ${levelData.hintsUsed || 0}\n🔄 Click to replay this level`);
                    } else {
                        newNode.setAttribute('title', `${level.title}\n📚 Concepts: ${level.concepts}\n🎯 Click to start this level`);
                    }
                } else {
                    nodeEl.style.cursor = 'not-allowed';
                    nodeEl.setAttribute('title', `${level.title}\n🔒 Complete previous levels to unlock`);
                    
                    // 🔧 FIX: Add click handler for locked levels to show message
                    nodeEl.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alert(`Level ${level.id} is locked!\nComplete Level ${level.id - 1} first to unlock this level.`);
                    });
                }
            });
            
            console.log('✅ Level map setup complete');
        }, 200);
        
        updateOverallProgress();
    }

    function loadLevelUI(level) {
        console.log(`Loading Level UI for: ${level.title}`);
        
        // Verify level data integrity
        if (!verifyLevelData(level)) {
            console.error('Invalid level data:', level);
            return;
        }
        
        // Set level titles with proper truncation
        const sceneTitleEl = getEl('level-title-scene');
        const dialogueTitleEl = getEl('level-title-dialogue');
        
        if (sceneTitleEl) {
            sceneTitleEl.textContent = `Level ${level.id}: ${level.title}`;
            sceneTitleEl.title = `Level ${level.id}: ${level.title} - ${level.concepts}`;
        }
        
        if (dialogueTitleEl) {
            dialogueTitleEl.textContent = `Level ${level.id}: ${level.title}`;
            dialogueTitleEl.title = `Level ${level.id}: ${level.title} - ${level.concepts}`;
        }
        
        // Set dialogue with proper formatting
        const dialogueEl = getEl('npc-dialogue');
        if (dialogueEl) {
            dialogueEl.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">🎓 Instructor Says:</div>
                <div>${level.dialogue}</div>
            `;
        }
        
        // Set instructions with enhanced formatting
        const instructionsEl = getEl('instructions');
        if (instructionsEl) {
            instructionsEl.innerHTML = `
                <div class="instruction-header">
                    <h4>🎯 Your Mission:</h4>
                </div>
                <p>${level.instructions}</p>
                <div class="instruction-footer">
                    <p><strong>💡 Concepts:</strong> ${level.concepts}</p>
                    <p><strong>⌨️ Tip:</strong> Press <kbd>Ctrl+Enter</kbd> to run your code quickly!</p>
                </div>
            `;
        }
        
        // Load scene with error handling
        const sceneContainer = getEl('scene-container');
        if (sceneContainer) {
            try {
                if (SVGAssets[level.scene]) {
                    sceneContainer.innerHTML = SVGAssets[level.scene];
                } else if (SVGAssets.scene_level_1) {
                    sceneContainer.innerHTML = SVGAssets.scene_level_1;
                } else {
                    // Fallback scene
                    sceneContainer.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: var(--color-dark);">
                            <div style="font-size: 3rem; margin-bottom: 20px;">🐍</div>
                            <h3>Level ${level.id}</h3>
                            <p>${level.title}</p>
                            <small style="opacity: 0.7;">${level.concepts}</small>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error loading scene:', error);
                sceneContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--color-dark);">
                        <div style="font-size: 3rem; margin-bottom: 20px;">🐍</div>
                        <h3>Level ${level.id}: ${level.title}</h3>
                        <p>Ready to code!</p>
                    </div>
                `;
            }
        }
        
        // Initialize editor with proper error handling
        try {
            editorManager.init('editor-container', level.startingCode);
            console.log('Editor initialized successfully');
        } catch (error) {
            console.error('Failed to initialize editor:', error);
            const container = getEl('editor-container');
            if (container) {
                container.innerHTML = `
                    <textarea 
                        id="fallback-editor"
                        style="width:100%;height:100%;font-family:'Courier New',monospace;padding:15px;background:#263238;color:#fff;border:none;outline:none;resize:none;font-size:14px;line-height:1.5;"
                        placeholder="Write your Python code here..."
                    >${level.startingCode}</textarea>
                `;
            }
        }
        
        // Clear console with welcome message
        const consoleOutput = getEl('console-output');
        if (consoleOutput) {
            consoleOutput.innerHTML = `
                <span class="log-info">🐍 Welcome to Level ${level.id}: ${level.title}!</span>
                <span class="log-info">📚 Learning: ${level.concepts}</span>
                <span class="log-info">⚡ Ready to code! Press Run or Ctrl+Enter to execute your Python code.</span>
            `;
        }
        
        // Setup components with delay to ensure DOM is ready
        setTimeout(() => {
            setupLevelNavigation(level);
            setupRunButton(level);
            setupHintButton(level);
        }, 100);
        
        console.log(`Level ${level.id} UI loaded successfully`);
    }

    function setupLevelNavigation(currentLevel) {
        console.log(`🧭 Setting up navigation for Level ${currentLevel.id}`);
        
        const prevBtn = document.getElementById('prev-level-btn');
        const nextBtn = document.getElementById('next-level-btn');
        
        // Previous level setup
        if (prevBtn) {
            const newPrevBtn = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
            
            const prevLevelId = currentLevel.id - 1;
            const prevLevelExists = prevLevelId >= 1;
            
            // Check if previous level is accessible (completed or unlocked)
            const isPrevAccessible = prevLevelExists && (
                gameManager.playerProgress.unlockedLevels.includes(prevLevelId) ||
                gameManager.playerProgress.levelsCompleted[prevLevelId]
            );
            
            if (isPrevAccessible) {
                newPrevBtn.disabled = false;
                newPrevBtn.style.opacity = '1';
                newPrevBtn.title = `Go to Level ${prevLevelId}`;
                
                newPrevBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`⬅️ Navigating to Level ${prevLevelId}`);
                    
                    // Visual feedback
                    newPrevBtn.classList.add('active');
                    setTimeout(() => {
                        newPrevBtn.classList.remove('active');
                        gameManager.startLevel(prevLevelId);
                    }, 150);
                };
            } else {
                newPrevBtn.disabled = true;
                newPrevBtn.style.opacity = '0.4';
                newPrevBtn.title = prevLevelExists ? 'Previous level not accessible' : 'No previous level';
                newPrevBtn.onclick = null;
            }
        }
        
        // Next level setup
        if (nextBtn) {
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
            
            const nextLevelId = currentLevel.id + 1;
            const nextLevelExists = gameLevels.some(l => l.id === nextLevelId);
            
            // Check if next level is accessible (unlocked or completed)
            const isNextAccessible = nextLevelExists && (
                gameManager.playerProgress.unlockedLevels.includes(nextLevelId) ||
                gameManager.playerProgress.levelsCompleted[nextLevelId]
            );
            
            if (isNextAccessible) {
                newNextBtn.disabled = false;
                newNextBtn.style.opacity = '1';
                newNextBtn.title = `Go to Level ${nextLevelId}`;
                
                newNextBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`➡️ Navigating to Level ${nextLevelId}`);
                    
                    // Visual feedback
                    newNextBtn.classList.add('active');
                    setTimeout(() => {
                        newNextBtn.classList.remove('active');
                        gameManager.startLevel(nextLevelId);
                    }, 150);
                };
            } else {
                newNextBtn.disabled = true;
                newNextBtn.style.opacity = '0.4';
                newNextBtn.title = nextLevelExists ? 'Complete current level to unlock' : 'No more levels';
                newNextBtn.onclick = null;
            }
        }
        
        console.log(`✅ Navigation setup complete for Level ${currentLevel.id}`);
    }

    function setupRunButton(level) {
        const runBtn = getEl('run-btn');
        if (!runBtn) return;
        
        const newRunBtn = runBtn.cloneNode(true);
        runBtn.parentNode.replaceChild(newRunBtn, runBtn);
        
        newRunBtn.onclick = async () => {
            newRunBtn.classList.add('loading');
            newRunBtn.innerHTML = '<div class="spinner"></div>Running...';
            
            let code;
            try {
                code = editorManager.getCode();
            } catch (error) {
                const textarea = document.querySelector('#editor-container textarea');
                code = textarea ? textarea.value : '';
            }
            
            if (!code.trim()) {
                const consoleOutput = getEl('console-output');
                consoleOutput.innerHTML = `<span class="log-error">❌ Error: No code to run! Please write some Python code first.</span>`;
                newRunBtn.classList.remove('loading');
                newRunBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>Run';
                return;
            }

            const result = await pyodideRunner.run(code);
            
            const consoleOutput = getEl('console-output');
            
            if (result.error) {
                consoleOutput.innerHTML = `
                    <span class="log-error">❌ Error: ${result.error}</span>
                    <span class="log-info">💡 Don't worry! Debugging is part of learning. Check your syntax and try again.</span>
                `;
            } else {
                const outputDisplay = result.output || 'Program completed successfully!';
                consoleOutput.innerHTML = `
                    <span class="log-success">✅ Output:</span>
                    <span class="log-output">${outputDisplay}</span>
                `;
                
                // Check for level completion with proper success check
                console.log("Checking success condition");
                if (level.successCondition && level.successCondition(result.output)) {
                    console.log("Success condition met!");
                    consoleOutput.innerHTML += `
                        <span class="log-celebration">🎉 Excellent work! You completed the challenge!</span>
                        <span class="log-celebration">🏆 Preparing your victory celebration...</span>
                    `;
                    
                    // Call handleLevelSuccess after a short delay
                    setTimeout(() => {
                        console.log("Triggering level success");
                        gameManager.handleLevelSuccess();
                    }, 1500);
                } else {
                    console.log("Success condition not met");
                }
            }
            
            newRunBtn.classList.remove('loading');
            newRunBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>Run';
        };
    }

    function setupHintButton(level) {
        let currentHint = 0;
        const hintBtn = getEl('hint-btn');
        if (!hintBtn) return;
        
        const newHintBtn = hintBtn.cloneNode(true);
        hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);
        
        // 🔧 IMPROVED: More descriptive initial button text
        newHintBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            💡 Get Hint (${level.hints.length} available)
        `;
        
        newHintBtn.onclick = () => {
            if (currentHint < level.hints.length) {
                // 🔧 IMPROVED: Show which hint number this is
                const hintNumber = currentHint + 1;
                const hintText = getEl('hint-text');
                hintText.innerHTML = `
                    <div style="margin-bottom: 15px;">
                        <strong style="color: var(--color-primary);">💡 Hint ${hintNumber} of ${level.hints.length}:</strong>
                    </div>
                    <div style="font-size: 1.1rem; line-height: 1.5;">
                        ${level.hints[currentHint]}
                    </div>
                `;
                
                gameManager.incrementHints();
                currentHint++;
                
                const remainingHints = level.hints.length - currentHint;
                if (remainingHints > 0) {
                    newHintBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        💡 Get Hint (${remainingHints} left)
                    `;
                } else {
                    newHintBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        ❌ No Hints Left
                    `;
                    newHintBtn.disabled = true;
                    newHintBtn.title = "You've used all available hints for this level";
                }
                
                showModal('hint-modal');
            } else {
                const hintText = getEl('hint-text');
                hintText.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 2rem; margin-bottom: 15px;">🤔</div>
                        <div style="font-size: 1.2rem; font-weight: bold; color: var(--color-primary); margin-bottom: 10px;">
                            All hints used!
                        </div>
                        <div style="line-height: 1.5;">
                            You've used all ${level.hints.length} available hints for this level.<br>
                            Try to solve it on your own, or check the solution below if you're really stuck.
                        </div>
                    </div>
                `;
                showModal('hint-modal');
            }
        };

        // 🔧 IMPROVED: Better hint modal buttons
        const getHintBtn = getEl('get-hint-btn');
        const showSolutionBtn = getEl('show-solution-btn');

        if (getHintBtn) {
            const newGetHintBtn = getHintBtn.cloneNode(true);
            getHintBtn.parentNode.replaceChild(newGetHintBtn, getHintBtn);
            
            newGetHintBtn.textContent = "👍 Got It!";
            newGetHintBtn.onclick = () => {
                hideModal('hint-modal');
            };
        }

        if (showSolutionBtn) {
            const newShowSolutionBtn = showSolutionBtn.cloneNode(true);
            showSolutionBtn.parentNode.replaceChild(newShowSolutionBtn, showSolutionBtn);
            
            newShowSolutionBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Show Solution
            `;
            
            // 🔧 IMPROVED: Confirmation before showing solution
            newShowSolutionBtn.onclick = () => {
                if (confirm("Are you sure you want to see the solution? This will replace your current code.")) {
                    try {
                        editorManager.setCode(level.solution);
                    } catch (error) {
                        const textarea = document.querySelector('#editor-container textarea');
                        if (textarea) textarea.value = level.solution;
                    }
                    hideModal('hint-modal');
                    
                    // Show solution message in console
                    const consoleOutput = getEl('console-output');
                    consoleOutput.innerHTML += `
                        <span class="log-info">💡 Solution loaded! Study the code carefully and run it to see how it works.</span>
                        <span class="log-info">🎯 Try to understand each line before moving to the next level.</span>
                    `;
                }
            };
        }
    }

    function showModal(modalId) {
        const modal = modals[modalId] || getEl(modalId);
        if (modal) {
            modal.classList.add('visible');
        }
    }

    function hideModal(modalId) {
        const modal = modals[modalId] || getEl(modalId);
        if (modal) {
            modal.classList.remove('visible');
        }
    }

    function showInputModal(prompt) {
        getEl('input-modal-prompt').textContent = prompt;
        getEl('input-modal-input').value = '';
        showModal('input-modal');
        
        const submitBtn = getEl('input-modal-submit');
        const input = getEl('input-modal-input');
        
        if (submitBtn) {
            // Remove existing event listeners
            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            
            newSubmitBtn.onclick = () => {
                const value = input.value;
                hideModal('input-modal');
                pyodideRunner.provideInput(value);
            };
        }
        
        if (input) {
            input.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    const submitBtn = getEl('input-modal-submit');
                    if (submitBtn) submitBtn.click();
                }
            };
            
            setTimeout(() => input.focus(), 100);
        }
    }

    function showVictoryModal(stars, level, nextCallback) {
        console.log(`🎉 Victory modal called for Level ${level.id} with ${stars} stars`);
        
        // Enhanced victory messages based on performance
        let victoryMessage = '';
        let encouragement = '';
        
        if (stars === 3) {
            victoryMessage = `🏆 PERFECT! You completed ${level.title} with full stars!`;
            encouragement = "Outstanding work! You're mastering Python like a true champion!";
        } else if (stars === 2) {
            victoryMessage = `🌟 Excellent! You completed ${level.title}!`;
            encouragement = "Great job! You're getting stronger with each challenge!";
        } else {
            victoryMessage = `✅ Well done! You completed ${level.title}!`;
            encouragement = "Every step forward is progress. Keep pushing your limits!";
        }
        
        // Update modal text
        const victoryTextEl = document.getElementById('victory-text');
        if (victoryTextEl) {
            victoryTextEl.innerHTML = `
                <div class="victory-main">${victoryMessage}</div>
                <div class="victory-encouragement">${encouragement}</div>
            `;
        }

        // Update stars display with enhanced animation
        const starsContainer = document.getElementById('victory-stars');
        if (starsContainer) {
            starsContainer.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const star = document.createElement('span');
                star.className = 'star-icon';
                star.style.animationDelay = `${i * 0.3}s`;
                star.innerHTML = i < stars ? '⭐' : '☆';
                if (i < stars) {
                    star.style.filter = 'drop-shadow(0 0 3px gold)';
                }
                starsContainer.appendChild(star);
            }
        }

        // Show modal
        showModal('victory-modal');

        // Setup next level button with enhanced functionality
        const nextBtn = document.getElementById('next-level-btn');
        if (nextBtn) {
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
            
            const nextLevelExists = gameLevels.some(l => l.id === level.id + 1);
            
            if (nextLevelExists) {
                newNextBtn.style.display = 'inline-flex';
                newNextBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 8px;">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                    Continue Adventure
                `;
                
                newNextBtn.onclick = () => {
                    console.log("🚀 Continuing to next level");
                    hideModal('victory-modal');
                    
                    // Add loading state
                    newNextBtn.classList.add('loading');
                    newNextBtn.innerHTML = '<div class="spinner"></div>Loading...';
                    
                    setTimeout(() => {
                        if (nextCallback) {
                            nextCallback();
                        }
                    }, 300);
                };
            } else {
                newNextBtn.style.display = 'none';
            }
        }
        
        // Setup back to map button
        const backToMapBtn = document.getElementById('back-to-map-victory-btn');
        if (backToMapBtn) {
            const newBackToMapBtn = backToMapBtn.cloneNode(true);
            backToMapBtn.parentNode.replaceChild(newBackToMapBtn, backToMapBtn);
            
            newBackToMapBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 8px;">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                Back to Map
            `;
            
            newBackToMapBtn.onclick = () => {
                console.log("🗺️ Returning to level map");
                hideModal('victory-modal');
                
                setTimeout(() => {
                    gameManager.showLevelMap();
                }, 200);
            };
        }
    }

    function updateOverallProgress() {
        const progress = gameManager.playerProgress;
        if (!progress) return;
        
        const completedCount = Object.keys(progress.levelsCompleted).length;
        const totalCount = gameLevels.length;
        const percentage = Math.min(100, (completedCount / totalCount) * 100); // Cap at 100%
        
        // Calculate total stars earned
        const totalStars = Object.values(progress.levelsCompleted)
            .reduce((sum, level) => sum + (level.stars || 0), 0);
        const maxStars = totalCount * 3;
        
        // Calculate star percentage for advanced display
        const starPercentage = (totalStars / maxStars) * 100;

        // Update progress bar with smoother transition
        const fillEl = getEl('overall-progress-fill');
        if (fillEl) {
            fillEl.style.transition = 'width 0.5s ease-out';
            fillEl.style.width = `${percentage}%`;
            // Add color based on completion percentage
            if (percentage > 75) {
                fillEl.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
            } else if (percentage > 50) {
                fillEl.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
            } else if (percentage > 25) {
                fillEl.style.background = 'linear-gradient(90deg, #f1c40f, #f39c12)';
            } else {
                fillEl.style.background = 'linear-gradient(90deg, #e67e22, #d35400)';
            }
        }
        
        // Update progress stats with enhanced display
        const progressStatsEl = getEl('progress-stats');
        if (progressStatsEl) {
            progressStatsEl.innerHTML = `
                <div style="margin-bottom: 5px;">
                    <strong>${completedCount}</strong>/<strong>${totalCount}</strong> Levels Complete
                </div>
                <div style="font-size: 0.9rem;">
                    <span title="${totalStars} out of ${maxStars} total stars">⭐ ${totalStars}/${maxStars}</span> • 
                    <span title="${progress.hintsUsed} hints used across all levels">💡 ${progress.hintsUsed}</span> • 
                    <span title="Time spent playing">⏱️ ${Math.round(progress.totalPlayTime/60000)}min</span>
                </div>
            `;
        }
        
        console.log(`Progress updated: ${completedCount}/${totalCount} levels, ${totalStars}/${maxStars} stars`);
    }

    function initializeModals() {
        document.querySelectorAll('.btn-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) {
                    modal.classList.remove('visible');
                }
            });
        });
    }

    function attachEventListeners() {
        console.log("🔧 Attaching UI event listeners");
        
        // Enhanced button attachment with retry mechanism
        const attachButtonWithRetry = (buttonId, callback, description, maxRetries = 3) => {
            let retries = 0;
            
            const tryAttach = () => {
                const button = document.getElementById(buttonId);
                if (button) {
                    console.log(`✅ Found ${description} button`);
                    
                    // Remove existing listeners by cloning
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    
                    // Add event listener with immediate feedback
                    newButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`🎯 ${description} clicked`);
                        
                        // Immediate visual feedback
                        newButton.style.transform = 'scale(0.95)';
                        newButton.style.transition = 'transform 0.1s ease-out';
                        
                        // Execute callback after brief delay for visual feedback
                        setTimeout(() => {
                            newButton.style.transform = '';
                            callback();
                        }, 100);
                    });
                    
                    // Add touch support for mobile
                    newButton.addEventListener('touchstart', function(e) {
                        newButton.style.transform = 'scale(0.95)';
                    }, { passive: true });
                    
                    newButton.addEventListener('touchend', function(e) {
                        setTimeout(() => {
                            newButton.style.transform = '';
                        }, 100);
                    }, { passive: true });
                    
                    return true;
                } else {
                    retries++;
                    console.warn(`⚠️ ${description} not found (attempt ${retries}/${maxRetries})`);
                    
                    if (retries < maxRetries) {
                        setTimeout(tryAttach, 300);
                    }
                    return false;
                }
            };
            
            tryAttach();
        };
        
        // Attach all button listeners with better error handling
        const setupAllButtons = () => {
            // Navigation buttons
            attachButtonWithRetry('start-game-btn', () => {
                console.log("🚀 Starting game - showing level map");
                gameManager.showLevelMap();
            }, 'Start Adventure');
            
            attachButtonWithRetry('how-to-play-btn', () => {
                console.log("📖 Showing how to play");
                showView('how-to-play');
            }, 'How to Play');
            
            attachButtonWithRetry('back-to-splash-btn', () => {
                console.log("🏠 Back to splash screen");
                showView('splash-screen');
            }, 'Back to Splash');
            
            attachButtonWithRetry('back-to-menu-btn', () => {
                console.log("🏠 Back to main menu");
                showView('splash-screen');
            }, 'Back to Menu');
            
            attachButtonWithRetry('back-to-map-btn', () => {
                console.log("🗺️ Back to level map");
                gameManager.showLevelMap();
            }, 'Back to Map');
            
            attachButtonWithRetry('reset-progress-btn', () => {
                console.log("🔄 Reset progress clicked");
                gameManager.resetProgress();
            }, 'Reset Progress');

            attachButtonWithRetry('debug-unlock-all-btn', () => {
                console.log("🔓 Debug: Unlocking all levels");
                // Unlock all levels for testing
                gameManager.playerProgress.unlockedLevels = [1, 2, 3, 4, 5];
                gameManager.playerProgress.levelsCompleted = {
                    1: { stars: 3, completedAt: Date.now(), timeMinutes: 2, hintsUsed: 0 },
                    2: { stars: 2, completedAt: Date.now(), timeMinutes: 5, hintsUsed: 1 }
                };
                
                // Save and refresh
                localStorage.setItem('pychamp_progress', JSON.stringify(gameManager.playerProgress));
                updateOverallProgress();
                gameManager.showLevelMap();
            }, 'Debug Unlock All');
        };
        
        // Setup buttons immediately and with delays
        setupAllButtons();
        setTimeout(setupAllButtons, 500);
        setTimeout(setupAllButtons, 1000);
        
        // Enhanced global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to close modals
            if (e.key === 'Escape') {
                const visibleModal = document.querySelector('.modal-overlay.visible');
                if (visibleModal) {
                    const modalId = visibleModal.id;
                    hideModal(modalId);
                    e.preventDefault();
                }
            }
            
            // Ctrl+Enter to run code
            if (e.key === 'Enter' && e.ctrlKey) {
                const runBtn = document.getElementById('run-btn');
                if (runBtn && !runBtn.disabled && !runBtn.classList.contains('loading')) {
                    runBtn.click();
                    e.preventDefault();
                }
            }
            
            // Ctrl+H for hint (in gameplay)
            if (e.key === 'h' && e.ctrlKey) {
                const hintBtn = document.getElementById('hint-btn');
                if (hintBtn && !hintBtn.disabled) {
                    hintBtn.click();
                    e.preventDefault();
                }
            }
            
            // Arrow keys for level navigation in gameplay
            if (document.getElementById('gameplay-container') && !document.getElementById('gameplay-container').classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    const prevBtn = document.getElementById('prev-level-btn');
                    if (prevBtn && !prevBtn.disabled) {
                        prevBtn.click();
                        e.preventDefault();
                    }
                } else if (e.key === 'ArrowRight') {
                    const nextBtn = document.getElementById('next-level-btn');
                    if (nextBtn && !nextBtn.disabled) {
                        nextBtn.click();
                        e.preventDefault();
                    }
                }
            }
        });
        
        console.log("✅ UI event listeners setup complete");
    }

    function verifyLevelData(level) {
        const requiredFields = ['id', 'title', 'dialogue', 'instructions', 'startingCode', 'hints', 'successCondition'];
        const missing = requiredFields.filter(field => !level[field]);
        
        if (missing.length > 0) {
            console.error(`Level ${level.id} missing fields:`, missing);
            return false;
        }
        
        // Verify hints array
        if (!Array.isArray(level.hints) || level.hints.length === 0) {
            console.warn(`Level ${level.id} has no hints`);
        }
        
        // Verify success condition is a function
        if (typeof level.successCondition !== 'function') {
            console.error(`Level ${level.id} has invalid success condition`);
            return false;
        }
        
        return true;
    }

    // Initialize modals and event listeners
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM content loaded, initializing UI");
            initializeModals();
            attachEventListeners();
        });
    } else {
        console.log("DOM already loaded, initializing UI immediately");
        initializeModals();
        attachEventListeners();
    }

    return {
        showView,
        renderLevelMap,
        loadLevelUI,
        updateOverallProgress,
        showModal,
        hideModal,
        showInputModal,
        showVictoryModal,
        setupHintButton,  // Export this for testing
        setupRunButton    // Export this for testing
    };
})();

window.ui = ui;