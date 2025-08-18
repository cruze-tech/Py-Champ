const pyodideRunner = (() => {
  console.log("Python Runner initializing");
  
  let pyodide;
  let isInitialized = false;
  let isInitializing = false;
  let pendingPromise = null;

  async function loadScript(src) {
    console.log(`Loading script: ${src}`);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log(`Script loaded: ${src}`);
        resolve();
      };
      script.onerror = (err) => {
        console.error(`Failed to load script: ${src}`, err);
        reject(new Error(`Failed to load ${src}`));
      };
      document.head.appendChild(script);
    });
  }

  async function init() {
    if (isInitialized || isInitializing) {
      return pendingPromise;
    }
    
    isInitializing = true;
    console.log("Initializing Python runtime");
    
    pendingPromise = (async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js');
        
        if (!window.loadPyodide) {
          throw new Error("Pyodide failed to load correctly");
        }
        
        console.log("Loading Pyodide...");
        pyodide = await window.loadPyodide({
          stdout: (text) => console.log("Python stdout:", text),
          stderr: (text) => console.error("Python stderr:", text)
        });
        
        console.log("Python runtime ready");
        isInitialized = true;
        
        // Basic test
        const testResult = await pyodide.runPythonAsync("1+1");
        console.log("Python test:", testResult);
        
        return true;
      } catch (err) {
        console.error("Failed to initialize Python runtime:", err);
        isInitializing = false;
        return false;
      }
    })();
    
    const result = await pendingPromise;
    isInitializing = false;
    return result;
  }

  async function run(code, level = null) {
    console.log("Running Python code");
    
    // Make sure Python is ready
    if (!isInitialized && !isInitializing) {
      await init();
    } else if (isInitializing) {
      await pendingPromise;
    }
    
    if (!isInitialized || !pyodide) {
      return {
        output: "Python runtime not available. Please try again later.",
        error: "Runtime initialization failed"
      };
    }
    
    try {
      // Capture stdout
      let output = '';
      
      // Handle input() function for interactive levels
      if (level && level.hasUserInput) {
        // Mock input function for testing
        pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()

# Mock input function for testing
def input(prompt=''):
    print(prompt, end='')
    return '${level.testInput || 'Python'}'
        `);
      } else {
        // Override print to capture output
        pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
        `);
      }
      
      // Run user code
      await pyodide.runPythonAsync(code);
      
      // Get captured output
      output = pyodide.runPython("sys.stdout.getvalue()");
      
      return { output: output.trim(), error: '' };
    } catch (error) {
      console.error("Python execution error:", error);
      return { output: '', error: error.message || String(error) };
    }
  }

  // Initialize in background after page loads
  setTimeout(init, 1000);
  
  return { init, run };
})();

window.pyodideRunner = pyodideRunner;