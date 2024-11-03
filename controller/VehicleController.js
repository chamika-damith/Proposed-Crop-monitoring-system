const openVehicleModalBtn = document.getElementById('openVehicleModal');
const closeVehicleModalBtn = document.getElementById('closeVehicleModal');
const addVehicleModal = document.getElementById('addVehicleModal');
const addVehicleForm = document.getElementById('addVehicleForm');
const vehicleTableBody = document.getElementById('vehicleTableBody');

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
            <button class="text-blue-500 px-1 editVehicleBtn">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="text-red-500 border-2 border-red-400 rounded-full px-1 deleteVehicleBtn">
                <i class="fa-solid fa-times"></i>
            </button>
        </td>
    `;

    vehicleTableBody.appendChild(row);

    addVehicleModal.classList.add('hidden');
    addVehicleForm.reset();
});