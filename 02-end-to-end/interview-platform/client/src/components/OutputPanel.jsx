import React from 'react';

const OutputPanel = ({ output, isError }) => {
    return (
        <div style={{
            height: '100%',
            backgroundColor: '#1e1e1e',
            color: isError ? '#ff6b6b' : '#f0f0f0',
            padding: '1rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            overflowY: 'auto',
            borderLeft: '1px solid #333'
        }}>
            <h3 style={{ marginTop: 0, color: '#888', fontSize: '0.9rem' }}>OUTPUT</h3>
            <div>{output || 'Run code to see output...'}</div>
        </div>
    );
};

export default OutputPanel;
