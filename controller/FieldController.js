// Define constants for modal and form elements
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const addFieldForm = document.getElementById('addFieldForm');
const fieldTableBody = document.getElementById('fieldTableBody');
const addFieldModal = document.getElementById('addFieldModal');

// Define constants for edit modal elements
const openEditModalBtn = document.getElementById('openEditModal');
const closeEditModalBtn = document.getElementById('closeEditModal');
const editFieldForm = document.getElementById('editFieldForm');
const editFieldModal = document.getElementById('editModal');

let currentRow;

// Function to open add field modal
openModalButton.addEventListener('click', () => {
    addFieldModal.classList.remove('hidden');
});

// Function to close add field modal
closeModalButton.addEventListener('click', () => {
    addFieldModal.classList.add('hidden');
});

// Function to add field
addFieldForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fieldName = document.getElementById('fieldName').value;
    const fieldLocation = document.getElementById('fieldLocation').value;
    const fieldSize = document.getElementById('fieldSize').value;
    const fieldCrops = document.getElementById('fieldCrops').value;
    const fieldStaff = document.getElementById('fieldStaff').value;
    const fieldImage = document.getElementById('fieldImage').files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
        const row = document.createElement('tr');
        row.classList.add('border-b');
        row.innerHTML = `
            <td class="p-4 flex items-center space-x-4">
                <img src="${reader.result}" alt="${fieldName}" class="w-12 h-12 rounded-lg">
                <span>${fieldName}</span>
            </td>
            <td class="p-4 text-center">${fieldLocation}</td>
            <td class="p-4 text-center">${fieldSize}</td>
            <td class="p-4 text-center"><button class="bg-green-200 py-1 px-2 rounded cropDetail">${fieldCrops}</button></td>
            <td class="p-4 text-center"><button class="bg-red-200 py-1 px-2 rounded">${fieldStaff}</button></td>
            <td class="p-4 text-gray-500 space-x-3">
                <button class="text-blue-500 px-1 edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="text-red-500 border-2 border-red-400 rounded-full px-1 delete-btn"><i class="fa-solid fa-times"></i></button>
            </td>
        `;
        fieldTableBody.appendChild(row);
        addFieldModal.classList.add('hidden');
        addFieldForm.reset();

        row.querySelector('.edit-btn').addEventListener('click', function () {
            editField(this);
        });

        row.querySelector('.delete-btn').addEventListener('click', function () {
            deleteField(this);
        });

        row.querySelector('.cropDetail').addEventListener('click', function () {
            viewCropDetail(this);
        });
    };

    if (fieldImage) {
        reader.readAsDataURL(fieldImage);
    }
});


// Function to edit field
function editField(button) {
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    document.getElementById('editfieldName').value = cells[0].querySelector('span').innerText;
    document.getElementById('editfieldLocation').value = cells[1].innerText;
    document.getElementById('editfieldSize').value = cells[2].innerText;
    document.getElementById('fieldCrops').value = cells[3].querySelector('button').innerText;
    document.getElementById('fieldStaff').value = cells[4].querySelector('button').innerText;

    // Open the edit modal
    editFieldModal.classList.remove('hidden');
}

// Attach event listener to edit buttons
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function () {
        editField(this);
    });
});

// Attach event listener to delete buttons
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function () {
        deleteField(this);
    });
});


// Function to delete field
function deleteField(button) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this field?');

    if (confirmation) {
        row.remove();
    }
}


// Function to close edit modal
closeEditModalBtn.addEventListener('click', () => {
    editFieldModal.classList.add('hidden');
});

// Handle form submission for editing
editFieldForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    // Update the table row with new data
    currentRow.children[0].querySelector('span').innerText = document.getElementById('editfieldName').value;
    currentRow.children[1].innerText = document.getElementById('editfieldLocation').value;
    currentRow.children[2].innerText = document.getElementById('editfieldSize').value;
    currentRow.children[3].querySelector('button').innerText = document.getElementById('fieldCrops').value;
    currentRow.children[4].querySelector('button').innerText = document.getElementById('fieldStaff').value;


    closeEditModalBtn.click();
});



// Function to view crop detail
function viewCropDetail() {
    document.getElementById('cropDetailsContent').innerHTML = `
        <p class="flex items-center text-gray-700">
            <i class="fas fa-user-circle mr-2"></i><strong>Crop Name:</strong> <span class="font-medium ml-2">crop A</span>
        </p>
    `;
    document.getElementById('cropDetailModal').classList.remove('hidden');
}

document.getElementById('closecropDetailModal').addEventListener('click', function () {
    document.getElementById('cropDetailModal').classList.add('hidden');
});