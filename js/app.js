/**
 * Rowing Club Attendance System
 * Main JavaScript Application
 */

// Check device status on load
document.addEventListener('DOMContentLoaded', function () {
    checkDeviceStatus();
    setInterval(checkDeviceStatus, 30000); // Check every 30 seconds
});

/**
 * Check device connection status
 */
async function checkDeviceStatus() {
    try {
        const response = await fetch(getApiUrl('/api/device/status'));
        const status = await response.json();
        updateDeviceStatus(status.connected);
    } catch (error) {
        updateDeviceStatus(false);
    }
}

/**
 * Update device status indicator in sidebar
 */
function updateDeviceStatus(connected) {
    const statusEl = document.getElementById('deviceStatus');
    if (!statusEl) return;

    const indicator = statusEl.querySelector('.status-indicator');
    const text = statusEl.querySelector('.status-text');

    if (connected) {
        indicator.className = 'status-indicator connected';
        text.textContent = 'Conectado';
    } else {
        indicator.className = 'status-indicator disconnected';
        text.textContent = 'Desconectado';
    }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format time for display
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Debounce function for search inputs
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * API request helper
 */
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
