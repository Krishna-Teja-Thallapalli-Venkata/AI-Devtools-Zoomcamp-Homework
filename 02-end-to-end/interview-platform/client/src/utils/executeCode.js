export const executeCode = (code) => {
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
