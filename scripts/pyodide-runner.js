const pyodideRunner = (() => {
    let pyodide;
    let _inputResolve = null;
    let isInitialized = false;
    let isInitializing = false;

    async function init() {
        if (isInitialized || isInitializing) return;
        isInitializing = true;

        try {
            console.log("Loading Pyodide in background...");
            
            pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
            });
            
            console.log("Pyodide loaded successfully in background");
            
            // Setup input handling
            pyodide.globals.set('js_input_handler', (prompt = '') => {
                return new Promise((resolve) => {
                    _inputResolve = resolve;
                    ui.showInputModal(prompt);
                });
            });
            
            // Override Python's input function
            pyodide.runPython(`
import js
import builtins

def custom_input(prompt=""):
    return js.js_input_handler(prompt)

builtins.input = custom_input
            `);
            
            console.log("Pyodide Ready in background.");
            isInitialized = true;
            
        } catch (error) {
            console.error("Failed to initialize Pyodide:", error);
        } finally {
            isInitializing = false;
        }
    }

    function provideInput(value) {
        if(_inputResolve) {
            _inputResolve(value);
            _inputResolve = null;
        }
    }

    async function run(code) {
        // Show loading indicator while waiting for Pyodide
        if (!isInitialized && !isInitializing) {
            const consoleOutput = document.getElementById('console-output');
            if (consoleOutput) {
                consoleOutput.innerHTML = '<span class="log-info">Starting Python interpreter...</span>';
            }
            await init();
        }

        // Wait for initialization to complete with visual feedback
        while (isInitializing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!isInitialized) {
            return { output: '', error: 'Python interpreter failed to load' };
        }

        let output = '';
        let error = '';
        
        try {
            // Capture stdout
            pyodide.runPython(`
import sys
import io

# Create string buffer to capture output
captured_output = io.StringIO()
sys.stdout = captured_output
            `);
            
            // Run user code
            await pyodide.runPythonAsync(code);
            
            // Get captured output
            output = pyodide.runPython(`
sys.stdout = sys.__stdout__
captured_output.getvalue()
            `);
            
            // Reset stdout in case of error
            pyodide.runPython(`sys.stdout = sys.__stdout__`);
        } catch (e) {
            error = e.message;
            // Also reset stdout on error
            try {
                pyodide.runPython(`sys.stdout = sys.__stdout__`);
            } catch (resetError) {
                console.warn('Failed to reset stdout:', resetError);
            }
        }
        
        return { output: output.trim(), error };
    }

    return { init, run, provideInput };
})();

// Initialize Pyodide immediately when script loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Starting Pyodide initialization on DOM load");
    pyodideRunner.init();
});