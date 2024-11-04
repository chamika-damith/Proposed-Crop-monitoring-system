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

const cropListElement = document.getElementById('cropList');
const cropDetailsContent = document.getElementById('cropDetailsContent');
const addCropBtn = document.getElementById('addCropBtn');
const fieldCrops = document.getElementById('fieldCrops');

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
            <td class="p-4 text-center"><button class="bg-green-200 py-1 px-2 rounded cropDetail" id="viewCropDetailsBtn">null</button></td>
            <td class="p-4 text-center"><button class="bg-red-200 py-1 px-2 rounded fieldStaffDetail">null</button></td>
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


        row.querySelector('.fieldStaffDetail').addEventListener('click', function () {
            viewStaffDetail(this);
        });

        row.querySelector('.cropDetail').addEventListener('click', function () {
            viewCropDetails(this);
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


// Function to view staff detail
function viewStaffDetail() {
    document.getElementById('fieldStaffDetailsContent').innerHTML = `
        <p class="flex items-center text-gray-700">
            <i class="fas fa-user-circle mr-2"></i><strong>Crop Name:</strong> <span class="font-medium ml-2">staff A</span>
        </p>
    `;
    document.getElementById('fieldStaffDetailModal').classList.remove('hidden');
}

document.getElementById('closefieldStaffDetailModal').addEventListener('click', function () {
    document.getElementById('fieldStaffDetailModal').classList.add('hidden');
});


document.getElementById('addStaffBtn').addEventListener('click', function () {
    const staffSelect = document.getElementById('fieldStaff');
    const staffList = document.getElementById('staffList');
    const selectedStaff = staffSelect.value;
    const selectedStaffText = staffSelect.options[staffSelect.selectedIndex].text;

    if (selectedStaff) {
        const staffItem = document.createElement('div');
        staffItem.className = 'flex justify-between items-center mb-1';
        staffItem.innerHTML = `
            <span>${selectedStaffText}</span>
            <button type="button" class="text-red-500 remove-btn">Remove</button>
        `;
        staffList.appendChild(staffItem);

        staffItem.querySelector('.remove-btn').addEventListener('click', function () {
            staffList.removeChild(staffItem);
        });
    }
});




 // Add selected crop to the preview list
 addCropBtn.addEventListener('click', () => {
    const selectedCrop = fieldCrops.value;
    if (selectedCrop) {
        const cropItem = document.createElement('div');
        cropItem.className = 'flex justify-between items-center mb-1 text-gray-700';
        cropItem.innerHTML = `
            <span>${selectedCrop}</span>
            <button type="button" class="text-red-500 font-bold remove-crop">X</button>
        `;
        cropListElement.appendChild(cropItem);

        // Handle removal of crop items
        cropItem.querySelector('.remove-crop').addEventListener('click', () => {
            cropListElement.removeChild(cropItem);
        });
    }
});

function viewCropDetails(){
    cropDetailsContent.innerHTML = '';
    const cropItems = cropListElement.querySelectorAll('span');

    cropItems.forEach(crop => {
        const cropDetail = document.createElement('p');
        cropDetail.className = 'text-gray-700';
        cropDetail.innerHTML = `<strong>Crop Name:</strong> ${crop.innerText}`;
        cropDetailsContent.appendChild(cropDetail);
    });

    document.getElementById('cropDetailModal').classList.remove('hidden');
}

document.getElementById('closecropDetailModal').addEventListener('click', function () {
    document.getElementById('cropDetailModal').classList.add('hidden');
});