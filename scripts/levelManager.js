class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.totalLevels = 5; // Based on your gameLevels array
        this.levelStartTime = Date.now();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Level completion modal buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prevLevelBtn') this.goToPreviousLevel();
            if (e.target.id === 'repeatLevelBtn') this.repeatLevel();
            if (e.target.id === 'nextLevelBtn') this.goToNextLevel();
            if (e.target.id === 'levelCompleteModal') this.closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    completeLevel(score = 100, starsEarned = 3) {
        const completionTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
        this.showCompletionModal(score, completionTime, starsEarned);
    }

    showCompletionModal(score, time, stars) {
        const modal = document.getElementById('levelCompleteModal');
        const titleElement = document.getElementById('levelCompleteTitle');
        const starsElement = document.getElementById('starsEarned');
        const timeElement = document.getElementById('completionTime');
        const scoreElement = document.getElementById('completionScore');
        const prevBtn = document.getElementById('prevLevelBtn');
        const nextBtn = document.getElementById('nextLevelBtn');

        // Update modal content
        titleElement.textContent = `Level ${this.currentLevel} Complete!`;
        starsElement.innerHTML = '⭐'.repeat(Math.max(0, Math.min(3, stars))) + '☆'.repeat(3 - Math.max(0, Math.min(3, stars)));
        timeElement.textContent = this.formatTime(time);
        scoreElement.textContent = score.toLocaleString();

        // Update button states
        prevBtn.disabled = this.currentLevel <= 1;
        prevBtn.style.opacity = this.currentLevel <= 1 ? '0.5' : '1';
        
        nextBtn.disabled = this.currentLevel >= this.totalLevels;
        nextBtn.style.opacity = this.currentLevel >= this.totalLevels ? '0.5' : '1';

        if (this.currentLevel >= this.totalLevels) {
            titleElement.textContent = 'Congratulations! All Levels Complete!';
            nextBtn.textContent = '🎉 Play Again';
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
        }

        // Show modal
        modal.style.display = 'block';
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('levelCompleteModal');
        modal.style.display = 'none';
        modal.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }

    goToPreviousLevel() {
        if (this.currentLevel > 1) {
            this.currentLevel--;
            this.startLevel(this.currentLevel);
            this.closeModal();
        }
    }

    repeatLevel() {
        this.startLevel(this.currentLevel);
        this.closeModal();
    }

    goToNextLevel() {
        if (this.currentLevel < this.totalLevels) {
            this.currentLevel++;
            this.startLevel(this.currentLevel);
        } else {
            // Restart from level 1 or return to map
            this.currentLevel = 1;
            if (window.gameManager && window.gameManager.showLevelMap) {
                window.gameManager.showLevelMap();
            }
        }
        this.closeModal();
    }

    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.levelStartTime = Date.now();
        
        // Use existing gameManager to start level
        if (window.gameManager && window.gameManager.startLevel) {
            window.gameManager.startLevel(levelNumber);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize level manager
window.levelManager = new LevelManager();