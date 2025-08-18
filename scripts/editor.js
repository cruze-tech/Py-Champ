const editorManager = (() => {
  console.log("Editor Manager initializing");
  
  let editor;

  function init(containerId, initialCode) {
    console.log(`Initializing editor in ${containerId}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container not found: ${containerId}`);
      return;
    }

    try {
      // Clear container
      container.innerHTML = '';
      
      // Create editor
      if (window.CodeMirror) {
        // Mobile-friendly CodeMirror configuration
        const isMobile = window.innerWidth <= 768;
        
        editor = CodeMirror(container, {
          value: initialCode || '',
          mode: 'python',
          theme: 'default',
          lineNumbers: true,
          indentUnit: 4,
          lineWrapping: true,
          autofocus: !isMobile, // Don't auto-focus on mobile to prevent keyboard popup
          extraKeys: {
            'Ctrl-Enter': () => {
              document.getElementById('run-btn')?.click();
            },
            'Tab': function(cm) {
              // Insert 4 spaces instead of tab for Python
              cm.replaceSelection('    ');
            }
          },
          // Mobile-specific options
          inputStyle: isMobile ? 'contenteditable' : 'textarea',
          dragDrop: !isMobile,
          cursorScrollMargin: isMobile ? 50 : 0,
          viewportMargin: isMobile ? 10 : Infinity
        });
        
        // Mobile-specific event handlers
        if (isMobile) {
          editor.on('focus', () => {
            // Scroll editor into view on mobile when focused
            setTimeout(() => {
              container.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          });
        }
        
        // Force refresh after a short delay
        setTimeout(() => {
          if (editor) {
            editor.refresh();
            console.log("Editor refreshed");
          }
        }, 100);
        
        // Responsive refresh on window resize
        window.addEventListener('resize', () => {
          if (editor) {
            setTimeout(() => editor.refresh(), 100);
          }
        });
        
      } else {
        console.error("CodeMirror not loaded");
        // Fallback textarea with mobile-friendly attributes
        container.innerHTML = `
          <textarea 
            style="width:100%;height:100%;font-family:monospace;font-size:14px;padding:10px;border:1px solid #374151;border-radius:8px;background:#0f172a;color:#e5e7eb;"
            placeholder="Write your Python code here..."
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          >${initialCode || ''}</textarea>
        `;
      }
    } catch (error) {
      console.error("Error initializing editor:", error);
      container.innerHTML = `
        <textarea 
          style="width:100%;height:100%;font-family:monospace;font-size:14px;padding:10px;border:1px solid #374151;border-radius:8px;background:#0f172a;color:#e5e7eb;"
          placeholder="Write your Python code here..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        >${initialCode || ''}</textarea>
      `;
    }
  }

  function getCode() {
    if (editor) {
      return editor.getValue();
    } else {
      const textarea = document.querySelector('#editor-container textarea');
      return textarea ? textarea.value : '';
    }
  }

  function setCode(code) {
    if (editor) {
      editor.setValue(code || '');
    } else {
      const textarea = document.querySelector('#editor-container textarea');
      if (textarea) {
        textarea.value = code || '';
      }
    }
  }

  console.log("Editor Manager ready");
  
  return { init, getCode, setCode };
})();

window.editorManager = editorManager;