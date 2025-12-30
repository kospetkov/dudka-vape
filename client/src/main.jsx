import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n/config';

// Применяем сохранённую тему до рендера (избегаем мигания)
// По умолчанию СВЕТЛАЯ тема для клиента
const savedTheme = localStorage.getItem('dudka-theme');
if (savedTheme === 'dark') {
    // Тёмная только если явно выбрана
    document.documentElement.removeAttribute('data-theme');
} else {
    // Светлая по умолчанию
    document.documentElement.setAttribute('data-theme', 'light');
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);