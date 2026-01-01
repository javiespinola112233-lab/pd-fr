/**
 * Settings Page JavaScript
 * Handles device configuration and connection
 */

document.addEventListener('DOMContentLoaded', function () {
    loadSettings();
    checkDeviceStatusPage();
});

async function loadSettings() {
    try {
        const response = await fetch(getApiUrl('/api/settings'));
        const config = await response.json();

        if (config.ip_address) {
            document.getElementById('ipAddress').value = config.ip_address;
            document.getElementById('port').value = config.port || 8000;
            document.getElementById('username').value = config.username || '';
            document.getElementById('password').value = config.password || '';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Error al cargar configuración', 'error');
    }
}

async function saveSettings(event) {
    event.preventDefault();

    const data = {
        ip_address: document.getElementById('ipAddress').value,
        port: parseInt(document.getElementById('port').value),
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch(getApiUrl('/api/settings'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Configuración guardada', 'success');
        } else {
            showNotification('Error al guardar', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}

async function checkDeviceStatusPage() {
    try {
        const response = await fetch(getApiUrl('/api/device/status'));
        const status = await response.json();
        updateConnectionUI(status);
    } catch (error) {
        console.error('Error checking status:', error);
    }
}

function updateConnectionUI(status) {
    const connStatus = document.getElementById('connStatus');
    const deviceSerial = document.getElementById('deviceSerial');
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');

    if (status.connected) {
        connStatus.innerHTML = '<span class="status-indicator connected"></span> Conectado';
        deviceSerial.textContent = status.serial || 'N/A';
        connectBtn.style.display = 'none';
        disconnectBtn.style.display = 'inline-block';
    } else {
        connStatus.innerHTML = '<span class="status-indicator disconnected"></span> Desconectado';
        deviceSerial.textContent = '-';
        connectBtn.style.display = 'inline-block';
        disconnectBtn.style.display = 'none';
    }

    // Update sidebar status too
    updateDeviceStatus(status.connected);
}

async function connectDevice() {
    const btn = document.getElementById('connectBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-small"></span> Conectando...';

    try {
        const response = await fetch(getApiUrl('/api/device/connect'), { method: 'POST' });
        const result = await response.json();

        if (result.success) {
            showNotification('Conectado exitosamente', 'success');
            updateConnectionUI({ connected: true, serial: result.serial });
        } else {
            showNotification(result.error || 'Error al conectar', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '🔗 Conectar';
    }
}

async function disconnectDevice() {
    try {
        await fetch(getApiUrl('/api/device/disconnect'), { method: 'POST' });
        showNotification('Desconectado', 'info');
        updateConnectionUI({ connected: false });
    } catch (error) {
        showNotification('Error al desconectar', 'error');
    }
}
