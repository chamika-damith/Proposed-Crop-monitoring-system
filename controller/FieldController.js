const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const addFieldForm = document.getElementById('addFieldForm');
const fieldTableBody = document.getElementById('fieldTableBody');
const addFieldModal = document.getElementById('addFieldModal');

// Function to open modal
openModalButton.addEventListener('click', () => {
    addFieldModal.classList.remove('hidden');
});

// Function to close modal
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
            <td class="p-4 text-center"><button class="bg-green-200 py-1 px-2 rounded">${fieldCrops}</button></td>
            <td class="p-4 text-center"><button class="bg-red-200 py-1 px-2 rounded">${fieldStaff}</button></td>
            <td class="p-4 text-gray-500 space-x-3">
                <button class="text-blue-500 px-1" onclick="editField(this)"><i class="fa-solid fa-pen"></i></button>
                <button class="text-red-500 border-2 border-red-400 rounded-full px-1" onclick="deleteField(this)"><i class="fa-solid fa-times"></i></button>
            </td>
        `;
        fieldTableBody.appendChild(row);
        addFieldModal.classList.add('hidden');
        addFieldForm.reset();
    };

    if (fieldImage) {
        reader.readAsDataURL(fieldImage);
    }
});

// Function to edit field
function editField(button) {
}

// Function to delete field
function deleteField(button) {    
}
