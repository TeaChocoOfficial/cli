// -Path: 'ui\src\main.tsx'
import './index.css';
import App from './App';
import env from './secure/env';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Providers from './components/layout/Providers';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <BrowserRouter basename={env.BASE_URL}>
                <App />
            </BrowserRouter>
        </Providers>
    </StrictMode>,
);
