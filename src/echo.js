import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Esto evita que la app truene si el .env no carga
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'condominio_key_abc',
    wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

export default echo;