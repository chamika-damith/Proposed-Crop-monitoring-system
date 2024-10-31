const openCropModalButton = document.getElementById('openCropModal');
const closeCropModalButton = document.getElementById('closeCropModal');
const addCropModal = document.getElementById('addCropModal');
const addCropForm = document.getElementById('addCropForm');
const cropTableBody = document.getElementById('cropTableBody');

let currentRow;

// Define constants for edit crop elements
const openCropEditModalBtn = document.getElementById('openCropEditModal');
const closeCropEditModalBtn = document.getElementById('closeCropEditModal');
const editCropForm = document.getElementById('editCropForm');
const editCropModal = document.getElementById('editCropModal');

// Open modal when the add crop button is clicked
openCropModalButton.addEventListener('click', () => {
    addCropModal.classList.remove('hidden');
});

// Close modal when the cancel button is clicked
closeCropModalButton.addEventListener('click', () => {
    addCropModal.classList.add('hidden');
});

// Add new crop to the table
addCropForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Gather input values
    const cropCode = document.getElementById('cropCode').value;
    const cropName = document.getElementById('cropName').value;
    const cropScientificName = document.getElementById('cropSceintificName').value;
    const cropCategory = document.getElementById('cropCategory').value;
    const cropSeason = document.getElementById('cropSeason').value;
    const cropField = document.getElementById('cropField').value;
    const cropImage = document.getElementById('cropImage').files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
        const row = document.createElement('tr');
        row.classList.add('border-b');
        row.innerHTML = `
            <td class="p-4 flex items-center space-x-4">
                <img src="${reader.result}" alt="${cropName}" class="w-12 h-12 rounded-lg">
                <span>${cropCode}</span>
            </td>
            <td class="p-4 text-center">${cropName}</td>
            <td class="p-4 text-center">${cropScientificName}</td>
            <td class="p-4 text-center">${cropCategory}</td>
            <td class="p-4 text-center">${cropSeason}</td>
            <td class="p-4 text-center">${cropField}</td>
            <td class="p-4 text-center space-x-3">
                <button class="text-blue-500 px-1 editbtn">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="text-red-500 border-2 border-red-400 rounded-full px-1 delete-crop-btn">
                    <i class="fa-solid fa-times"></i>
                </button>
            </td>
        `;
        cropTableBody.appendChild(row);
        addCropModal.classList.add('hidden');
        addCropForm.reset();

        row.querySelector('.editbtn').addEventListener('click', function() {
            editCrop(this);
        });

        row.querySelector('.delete-crop-btn').addEventListener('click', function() {
            deleteCrop(this);
        });
    };

    if (cropImage) {
        reader.readAsDataURL(cropImage);
    } else {
        console.log("No image provided");
    }
});

// Function to edit crop
function editCrop(button) {
    // Get the closest table row of the clicked button
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    // Populate form crop with current row data
    document.getElementById('cropEditCode').value = cells[0].querySelector('span').innerText;
    document.getElementById('cropEditName').value = cells[1].innerText;
    document.getElementById('cropEditSceintificName').value = cells[2].innerText;
    document.getElementById('cropEditCategory').value = cells[3].innerText;
    document.getElementById('cropEditSeason').value = cells[4].innerText;
    document.getElementById('cropEditField').value = cells[5].innerText;

    // Open the edit modal
    editCropModal.classList.remove('hidden');
}

// Attach event listener to edit buttons
document.querySelectorAll('.editbtn').forEach(button => {
    button.addEventListener('click', function() {
        editCrop(this);
    });
});

// Function to close edit modal
closeCropEditModalBtn.addEventListener('click', () => {
    editCropModal.classList.add('hidden');
});


// Handle form submission for editing
editCropForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    // Update the table row with new data
    currentRow.children[0].querySelector('span').innerText = document.getElementById('cropEditCode').value;
    currentRow.children[1].innerText = document.getElementById('cropEditName').value;
    currentRow.children[2].innerText = document.getElementById('cropEditSceintificName').value;
    currentRow.children[3].innerText = document.getElementById('cropEditCategory').value;
    currentRow.children[4].innerText = document.getElementById('cropEditSeason').value;
    currentRow.children[5].innerText = document.getElementById('cropEditField').value;


    closeCropEditModalBtn.click();
});

// Function to delete field
function deleteCrop(button) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this crop?');
    
    if (confirmation) {
        row.remove();
    }
}