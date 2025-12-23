import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeEditorProvider } from './context/ThemeEditorContext';
import './index.css';
import './i18n/config';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeEditorProvider>
            <App />
        </ThemeEditorProvider>
    </StrictMode>
);
