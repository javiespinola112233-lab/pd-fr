// =====================================================
// Configuración del API Backend
// =====================================================

const API_CONFIG = {
    // URL del backend (servidor Flask en la Acer)
    // IMPORTANTE: Cambia esta URL por la de ngrok cuando ejecutes start_server_online.bat
    BASE_URL: 'http://localhost:5000',

    // Para acceso remoto, usa la URL de ngrok:
    // BASE_URL: 'https://your-ngrok-url.ngrok.io',
};

// No modificar esta función
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}
