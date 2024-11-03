const openVehicleModalBtn = document.getElementById('openVehicleModal');
const closeVehicleModalBtn = document.getElementById('closeVehicleModal');
const addVehicleModal = document.getElementById('addVehicleModal');
const addVehicleForm = document.getElementById('addVehicleForm');
const vehicleTableBody = document.getElementById('vehicleTableBody');


// Define constants for edit vehicle elements
const openVehicleEditModalBtn = document.getElementById('openVehicleEditModal');
const closeEditVehicleModalBtn = document.getElementById('closeEditVehicleModal');
const editVehicleForm = document.getElementById('editVehicleForm');
const editVehicleModal = document.getElementById('editVehicleModal');

let currentRow; 

// Open modal when the add vehicle button is clicked
openVehicleModalBtn.addEventListener('click', () => {
    console.log("Added hii")
    addVehicleModal.classList.remove('hidden');
});

// Close modal when the cancel button is clicked
closeVehicleModalBtn.addEventListener('click', () => {
    addVehicleModal.classList.add('hidden');
});

// Add new vehicle to the table
addVehicleForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const licensePlateNumber = document.getElementById('licensePlateNumber').value;
    const vehicleCategory = document.getElementById('vehicleCategory').value;
    const fuelType = document.getElementById('fuelType').value;
    const status = document.getElementById('status').value;
    const allocatedStaff = document.getElementById('allocatedStaff').value;
    const remarks = document.getElementById('remarks').value;

    const row = document.createElement('tr');
    row.classList.add('border-b');
    row.innerHTML = `
        <td class="p-4 text-center">${licensePlateNumber}</td>
        <td class="p-4 text-center">${vehicleCategory}</td>
        <td class="p-4 text-center">${fuelType}</td>
        <td class="p-4 text-center">${status}</td>
        <td class="p-4 text-center">${allocatedStaff}</td>
        <td class="p-4 text-center">${remarks}</td>
        <td class="p-4 text-center space-x-3">
            <button class="text-blue-500 px-1 editVehiclebtn" id="openVehicleEditModal">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="text-red-500 border-2 border-red-400 rounded-full px-1 delete-vehicle-btn">
                <i class="fa-solid fa-times"></i>
            </button>
        </td>
    `;

    vehicleTableBody.appendChild(row);

    addVehicleModal.classList.add('hidden');
    addVehicleForm.reset();

    row.querySelector('.editVehiclebtn').addEventListener('click', function() {
        editVehicle(this);
    });

    row.querySelector('.delete-vehicle-btn').addEventListener('click', function() {
        deleteVehicle(this);
    });
});

// Function to edit vehicle data
function editVehicle(button) {
    // Get the closest table row of the clicked button
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    // Populate form with current row data
    document.getElementById('editLicensePlateNumber').value = cells[0].innerText;
    document.getElementById('editVehicleCategory').value = cells[1].innerText;
    document.getElementById('editFuelType').value = cells[2].innerText;
    document.getElementById('editStatus').value = cells[3].innerText;
    document.getElementById('editAllocatedStaff').value = cells[4].innerText;
    document.getElementById('editRemarks').value = cells[5].innerText;

    // Open the edit modal
    editVehicleModal.classList.remove('hidden');
}

// Attach event listener to edit buttons
document.querySelectorAll('.editbtn').forEach(button => {
    button.addEventListener('click', function() {
        editVehicle(this);
    });
});

// Function to close the edit modal
closeEditVehicleModalBtn.addEventListener('click', () => {
    editVehicleModal.classList.add('hidden');
});

// Handle form submission for editing vehicle data
editVehicleForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    currentRow.children[0].innerText = document.getElementById('editLicensePlateNumber').value;
    currentRow.children[1].innerText = document.getElementById('editVehicleCategory').value;
    currentRow.children[2].innerText = document.getElementById('editFuelType').value;
    currentRow.children[3].innerText = document.getElementById('editStatus').value;
    currentRow.children[4].innerText = document.getElementById('editAllocatedStaff').value;
    currentRow.children[5].innerText = document.getElementById('editRemarks').value;

    closeEditVehicleModalBtn.click();
});

// Function to delete vehicle
function deleteVehicle(button) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this vehicle?');
    
    if (confirmation) {
        row.remove();
    }
}