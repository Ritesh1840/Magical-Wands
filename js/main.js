import { MagicalApp } from './lib/app.js';

function boot() {
    if (!window.appInitialized) {
        window.appInitialized = true;
        new MagicalApp();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
