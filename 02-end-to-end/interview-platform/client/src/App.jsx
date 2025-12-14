import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import { executeCode } from './utils/executeCode';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

function App() {
    const [code, setCode] = useState("// Start coding along with your candidate...\nconsole.log('Hello World');");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");
    const [isError, setIsError] = useState(false);
    const [roomId, setRoomId] = useState("default-room");
    const socketRef = useRef(null);
    const isRemoteUpdate = useRef(false);

    useEffect(() => {
        // Get room from URL or default
        const params = new URLSearchParams(window.location.search);
        const room = params.get('room') || 'default-room';
        setRoomId(room);

        socketRef.current = io("http://localhost:3001");

        socketRef.current.emit("join-room", room);

        socketRef.current.on("code-update", (newCode) => {
            isRemoteUpdate.current = true;
            setCode(newCode);
            // Reset lock after a short delay to allow local edits again if needed, 
            // but usually the changing of state triggers re-render, 
            // where we don't emit back immediately.
            setTimeout(() => isRemoteUpdate.current = false, 100);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleCodeChange = (newCode) => {
        if (isRemoteUpdate.current) return;
        setCode(newCode);
        if (socketRef.current) {
            socketRef.current.emit("code-change", { roomId, code: newCode });
        }
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        if (e.target.value === "python") {
            setCode("# Write Python code here\nprint('Hello Python')");
        } else {
            setCode("// Write JavaScript code here\nconsole.log('Hello JS')");
        }
    };

    const runCode = async () => {
        setOutput("Running...");
        setIsError(false);
        const result = await executeCode(code, language);
        setOutput(result.output);
        setIsError(result.isError);
    };

    const copyLink = () => {
        const url = `${window.location.origin}?room=${roomId}`;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <header style={{
                padding: '1rem',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#242424'
            }}>
                <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Interview Platform</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        style={{ padding: '0.5rem', borderRadius: '4px' }}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>
                    <button onClick={copyLink}>Share Room Link</button>
                    <button onClick={runCode} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Run Code</button>
                </div>
            </header>

            <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 1, borderRight: '1px solid #333' }}>
                    <CodeEditor code={code} onChange={handleCodeChange} language={language} />
                </div>
                <div style={{ width: '30%', minWidth: '300px' }}>
                    <OutputPanel output={output} isError={isError} />
                </div>
            </main>
        </div>
    );
}

export default App;
