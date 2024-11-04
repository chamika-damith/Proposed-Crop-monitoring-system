const openEquipmentModalBtn = document.getElementById('openEquipmentModal');
const closeEquipmentModalBtn = document.getElementById('closeEquipmentModal');
const addEquipmentModal = document.getElementById('addEquipmentModal');
const addEquipmentForm = document.getElementById('addEquipmentForm');
const equipmentTableBody = document.getElementById('equipmentTableBody');

// Open modal when the add equipment button is clicked
openEquipmentModalBtn.addEventListener('click', () => {
    addEquipmentModal.classList.remove('hidden');
});

// Close modal when the cancel button is clicked
closeEquipmentModalBtn.addEventListener('click', () => {
    addEquipmentModal.classList.add('hidden');
});

// Add new equipment to the table
addEquipmentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const equipmentId = document.getElementById('equipmentId').value;
    const equipmentName = document.getElementById('equipmentName').value;
    const equipmentType = document.getElementById('equipmentType').value;
    const equipmentStatus = document.getElementById('equipmentStatus').value;
    const assignedStaff = document.getElementById('assignedStaff').value;
    const assignedField = document.getElementById('assignedField').value;

    const row = document.createElement('tr');
    row.classList.add('border-b');
    row.innerHTML = `
        <td class="p-4 text-center">${equipmentId}</td>
        <td class="p-4 text-center">${equipmentName}</td>
        <td class="p-4 text-center">${equipmentType}</td>
        <td class="p-4 text-center">${equipmentStatus}</td>
        <td class="p-4 text-center">${assignedStaff}</td>
        <td class="p-4 text-center">${assignedField}</td>
        <td class="p-4 text-center space-x-3">
            <button class="text-blue-500 px-1 editEquipmentBtn" id="openEquipmentEditModal">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="text-red-500 border-2 border-red-400 rounded-full px-1 delete-equipment-btn">
                <i class="fa-solid fa-times"></i>
            </button>
        </td>
    `;

    equipmentTableBody.appendChild(row);

    addEquipmentModal.classList.add('hidden');
    addEquipmentForm.reset();

    row.querySelector('.editEquipmentBtn').addEventListener('click', function() {
        editEquipment(this);
    });

    row.querySelector('.delete-equipment-btn').addEventListener('click', function() {
        deleteEquipment(this);
    });
});
