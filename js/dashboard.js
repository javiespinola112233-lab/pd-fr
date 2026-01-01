/**
 * Dashboard Page JavaScript
 * Handles attendance list and real-time updates
 */

document.addEventListener('DOMContentLoaded', function () {
    loadTodayAttendance();
    startLiveUpdates();
    updateClock();
    setInterval(updateClock, 1000);
});

function updateClock() {
    const now = new Date();
    document.getElementById('currentTime').textContent =
        now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

async function loadTodayAttendance() {
    try {
        const response = await fetch(getApiUrl('/api/attendance/today'), {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        const data = await response.json();

        // Update stats
        document.getElementById('statTotal').textContent = data.stats.total_records;
        document.getElementById('statSuccess').textContent = data.stats.success_count;
        document.getElementById('statUnique').textContent = data.stats.unique_attendees;

        // Render attendance list
        renderAttendanceList(data.records);
    } catch (error) {
        console.error('Error loading attendance:', error);
        showNotification('Error al cargar asistencias', 'error');
    }
}

function renderAttendanceList(records) {
    const container = document.getElementById('attendanceList');

    if (records.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>No hay registros de asistencia hoy</p>
            </div>
        `;
        return;
    }

    container.innerHTML = records.map(record => createAttendanceItem(record)).join('');
}

function createAttendanceItem(record, isNew = false) {
    const time = new Date(record.event_time);
    const timeStr = time.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const name = record.member_name || `ID: ${record.employee_no}`;
    const category = record.member_category || 'Sin asignar';
    const isSuccess = record.event_type.toLowerCase().includes('pass') ||
        record.event_type.toLowerCase().includes('verificad');

    return `
        <div class="attendance-item ${isNew ? 'new-item' : ''} ${isSuccess ? 'success' : 'fail'}">
            <div class="attendance-avatar">
                ${name.charAt(0).toUpperCase()}
            </div>
            <div class="attendance-info">
                <span class="attendance-name">${name}</span>
                <span class="attendance-category">${category}</span>
            </div>
            <div class="attendance-event">
                <span class="event-type">${record.event_type}</span>
            </div>
            <div class="attendance-time">
                ${timeStr}
            </div>
        </div>
    `;
}

function startLiveUpdates() {
    // Use fetch with ReadableStream to support ngrok header (EventSource doesn't support headers)
    fetchSSE();
}

async function fetchSSE() {
    try {
        const response = await fetch(getApiUrl('/api/attendance/live'), {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop(); // Keep incomplete chunk

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        handleSSEMessage(data);
                    } catch (e) {
                        console.log('SSE parse error:', e);
                    }
                }
            }
        }
    } catch (error) {
        console.log('SSE connection error, retrying in 5s...', error);
        setTimeout(fetchSSE, 5000);
    }

    // Reconnect after stream ends
    setTimeout(fetchSSE, 1000);
}

function handleSSEMessage(data) {
    if (data.type === 'ping') return;

    // Add new item to the top of the list
    const container = document.getElementById('attendanceList');
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        container.innerHTML = '';
    }

    container.insertAdjacentHTML('afterbegin', createAttendanceItem(data, true));

    // Update stats
    const totalEl = document.getElementById('statTotal');
    totalEl.textContent = parseInt(totalEl.textContent) + 1;

    if (data.is_success) {
        const successEl = document.getElementById('statSuccess');
        successEl.textContent = parseInt(successEl.textContent) + 1;
    }

    // Flash effect
    setTimeout(() => {
        const newItem = container.querySelector('.new-item');
        if (newItem) newItem.classList.remove('new-item');
    }, 2000);
}

async function syncEvents() {
    const btn = event.target.closest('button');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-small"></span> Sincronizando...';

    try {
        const response = await fetch(getApiUrl('/api/device/sync'), { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            showNotification(`Sincronizados ${data.synced_count} eventos`, 'success');
            loadTodayAttendance();
        } else {
            showNotification(data.error || 'Error al sincronizar', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>🔄</span> Sincronizar';
    }
}
