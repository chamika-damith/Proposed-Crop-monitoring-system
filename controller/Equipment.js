const openEquipmentModalBtn = document.getElementById('openEquipmentModal');
const closeEquipmentModalBtn = document.getElementById('closeEquipmentModal');
const addEquipmentModal = document.getElementById('addEquipmentModal');
const addEquipmentForm = document.getElementById('addEquipmentForm');
const equipmentTableBody = document.getElementById('equipmentTableBody');

const editEquipmentModal = document.getElementById('editEquipmentModal');
const editEquipmentForm = document.getElementById('editEquipmentForm');
const closeEditEquipmentModalBtn = document.getElementById('closeEditEquipmentModal');

let currentRow; 

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


// Function to edit equipment data
function editEquipment(button) {
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    document.getElementById('editEquipmentName').value = cells[1].innerText;
    document.getElementById('editEquipmentType').value = cells[2].innerText;
    document.getElementById('editEquipmentStatus').value = cells[3].innerText;
    document.getElementById('editAssignedStaff').value = cells[4].innerText;
    document.getElementById('editAssignedField').value = cells[5].innerText;

    editEquipmentModal.classList.remove('hidden');
}

document.querySelectorAll('.editEquipmentBtn').forEach(button => {
    button.addEventListener('click', function() {
        editEquipment(this);
    });
});

// Close the modal on cancel button click
closeEditEquipmentModalBtn.addEventListener('click', () => {
    editEquipmentModal.classList.add('hidden');
});

// Handle form submission to save edited equipment data
editEquipmentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    currentRow.children[1].innerText = document.getElementById('editEquipmentName').value;
    currentRow.children[2].innerText = document.getElementById('editEquipmentType').value;
    currentRow.children[3].innerText = document.getElementById('editEquipmentStatus').value;
    currentRow.children[4].innerText = document.getElementById('editAssignedStaff').value;
    currentRow.children[5].innerText = document.getElementById('editAssignedField').value;

    editEquipmentModal.classList.add('hidden');
});


// Function to delete equipment
function deleteEquipment(button) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this equipment?');
    
    if (confirmation) {
        row.remove();
    }
}