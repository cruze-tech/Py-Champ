const editorManager = (() => {
    let editor;

    function init(containerId, initialCode) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Editor container '${containerId}' not found`);
            return;
        }
        
        // Clear any existing content
        container.innerHTML = '';
        
        try {
            // Create CodeMirror editor
            editor = CodeMirror(container, {
                value: initialCode || "",
                mode: "python",
                theme: "material-darker",
                lineNumbers: true,
                indentUnit: 4,
                lineWrapping: true,
                autofocus: true,
                extraKeys: {
                    "Ctrl-Enter": function() {
                        const runBtn = document.getElementById('run-btn');
                        if (runBtn) runBtn.click();
                    }
                }
            });
            
            // Ensure proper sizing with a slight delay
            setTimeout(() => {
                editor.setSize("100%", "100%");
                editor.refresh();
            }, 100);
            
            console.log('✅ CodeMirror editor initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize CodeMirror:', error);
            
            // Fallback to textarea
            container.innerHTML = `
                <textarea 
                    id="fallback-editor"
                    style="width:100%;height:100%;font-family:'Courier New',monospace;padding:15px;background:#263238;color:#fff;border:none;outline:none;resize:none;font-size:14px;line-height:1.5;"
                    placeholder="Write your Python code here..."
                >${initialCode || ''}</textarea>
            `;
        }
    }

    function getCode() {
        return editor ? editor.getValue() : '';
    }

    function setCode(code) {
        if (editor) {
            editor.setValue(code);
        }
    }

    return { init, getCode, setCode };
})();