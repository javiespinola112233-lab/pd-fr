/**
 * Members Page JavaScript
 * Handles member management (CRUD operations)
 */

let members = [];

document.addEventListener('DOMContentLoaded', loadMembers);

async function loadMembers() {
    try {
        const response = await fetch(getApiUrl('/api/members'));
        members = await response.json();
        renderMembersTable();
    } catch (error) {
        console.error('Error loading members:', error);
        showNotification('Error al cargar miembros', 'error');
    }
}

function renderMembersTable() {
    const tbody = document.getElementById('membersTableBody');

    if (members.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <span class="empty-icon">👥</span>
                    <p>No hay miembros registrados</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = members.map(member => `
        <tr class="${member.active ? '' : 'inactive'}">
            <td><strong>${member.name}</strong></td>
            <td><code>${member.employee_no}</code></td>
            <td><span class="badge badge-${member.category}">${member.category}</span></td>
            <td>${member.card_no || '-'}</td>
            <td>
                <span class="status-badge ${member.active ? 'active' : 'inactive'}">
                    ${member.active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="actions">
                <button class="btn-icon" onclick="editMember(${member.id})" title="Editar">✏️</button>
                <button class="btn-icon danger" onclick="deleteMember(${member.id})" title="Eliminar">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function filterMembers() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const allMembers = [...members]; // Keep original for reset

    const filtered = allMembers.filter(m =>
        m.name.toLowerCase().includes(search) ||
        m.employee_no.toLowerCase().includes(search) ||
        (m.card_no && m.card_no.toLowerCase().includes(search))
    );

    const tbody = document.getElementById('membersTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>No se encontraron resultados</p></td></tr>';
    } else {
        // Temporarily replace members for rendering
        const temp = members;
        members = filtered;
        renderMembersTable();
        members = temp;
    }
}

function openMemberModal(member = null) {
    const modal = document.getElementById('memberModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('memberForm');

    form.reset();

    if (member) {
        title.textContent = 'Editar Miembro';
        document.getElementById('memberId').value = member.id;
        document.getElementById('employeeNo').value = member.employee_no;
        document.getElementById('employeeNo').readOnly = true;
        document.getElementById('memberName').value = member.name;
        document.getElementById('memberCategory').value = member.category;
        document.getElementById('cardNo').value = member.card_no || '';
    } else {
        title.textContent = 'Nuevo Miembro';
        document.getElementById('memberId').value = '';
        document.getElementById('employeeNo').readOnly = false;
    }

    modal.classList.add('active');
}

function closeMemberModal() {
    document.getElementById('memberModal').classList.remove('active');
}

function editMember(id) {
    const member = members.find(m => m.id === id);
    if (member) {
        openMemberModal(member);
    }
}

async function saveMember(event) {
    event.preventDefault();

    const id = document.getElementById('memberId').value;
    const data = {
        employee_no: document.getElementById('employeeNo').value,
        name: document.getElementById('memberName').value,
        category: document.getElementById('memberCategory').value,
        card_no: document.getElementById('cardNo').value || null
    };

    try {
        const url = id ? getApiUrl(`/api/members/${id}`) : getApiUrl('/api/members');
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success || result.id) {
            showNotification(id ? 'Miembro actualizado' : 'Miembro creado', 'success');
            closeMemberModal();
            loadMembers();
        } else {
            showNotification(result.error || 'Error al guardar', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}

async function deleteMember(id) {
    if (!confirm('¿Está seguro de eliminar este miembro?')) return;

    try {
        const response = await fetch(getApiUrl(`/api/members/${id}`), { method: 'DELETE' });
        const result = await response.json();

        if (result.success) {
            showNotification('Miembro eliminado', 'success');
            loadMembers();
        } else {
            showNotification('Error al eliminar', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}
