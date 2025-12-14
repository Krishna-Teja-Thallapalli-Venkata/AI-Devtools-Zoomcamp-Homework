// Keep pyodide instance global to avoid reloading
let pyodideInstance = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (window.loadPyodide) {
    pyodideInstance = await window.loadPyodide();
    return pyodideInstance;
  }
  throw new Error("Pyodide not loaded");
}

export const executeCode = async (code, language = "javascript") => {
  if (language === "python") {
    try {
      const pyodide = await getPyodide();
      // Redirect stdout to capture print statements
      pyodide.setStdout({
        batched: (msg) => {
          // This is a bit tricky with simple return. 
          // We'll gather output in a variable.
        }
      });

      // Allow capturing stdout
      let output = [];
      pyodide.setStdout({ batched: (msg) => output.push(msg) });
      pyodide.setStderr({ batched: (msg) => output.push(msg) });

      await pyodide.runPythonAsync(code);
      return { isError: false, output: output.join("\n") };
    } catch (err) {
      return { isError: true, output: err.toString() };
    }
  }

  // Existing Javascript execution via Worker
  return new Promise((resolve, reject) => {
    const workerCode = `
      self.onmessage = async (e) => {
        const code = e.data;
        let logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.join(' '));
        };
        
        try {
          // Wrap in async function to allow await if needed, though eval is synchronous usually
          // We use simple eval for this homework
          const result = eval(code);
          if (result !== undefined) {
             logs.push(String(result));
          }
          self.postMessage({ type: 'success', logs });
        } catch (err) {
          self.postMessage({ type: 'error', error: err.toString() });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      const { type, logs, error } = e.data;
      URL.revokeObjectURL(workerUrl);
      worker.terminate();
      if (type === 'error') {
        resolve({ isError: true, output: error });
      } else {
        resolve({ isError: false, output: logs.join('\\n') });
      }
    };

    worker.onerror = (err) => {
      URL.revokeObjectURL(workerUrl);
      worker.terminate();
      resolve({ isError: true, output: 'Runtime Error: ' + err.message });
    };

    worker.postMessage(code);

    // Timeout after 5 seconds
    setTimeout(() => {
      worker.terminate();
      resolve({ isError: true, output: 'Execution Timed Out' });
    }, 5000);
  });
};
