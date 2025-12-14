import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange, language = "javascript" }) => {
    const handleEditorChange = (value, event) => {
        onChange(value);
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;
