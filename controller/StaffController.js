// Define constants for modal and form elements
const openStaffModalbtn = document.getElementById('openStaffModal');
const closeStaffModalbtn = document.getElementById('closeStaffModal');
const addStaffForm = document.getElementById('addStaffForm');
const staffTableBody = document.getElementById('staffTableBody');
const addStaffModal = document.getElementById('addStaffModal');



const closeStaffEditModal = document.getElementById('closeStaffEditModal');
const editStaffForm = document.getElementById('editStaffForm');
const editStaffModal = document.getElementById('editStaffModal');


const addStaffFieldBtn = document.getElementById('addStaffFieldBtn');
const staffFieldSelect = document.getElementById('staffFieldSelect');
const staffFieldList = document.getElementById('staffFieldList');

const addVehicleFieldBtn = document.getElementById('addVehicleFieldBtn');
const fieldvehicle = document.getElementById('fieldvehicle');
const vehicleFieldList = document.getElementById('vehicleFieldList');

const editStaffFieldBtn = document.getElementById('editStaffFieldBtn');
const staffEditFieldSelect = document.getElementById('staffEditFieldSelect');
const editstaffFieldList = document.getElementById('editstaffFieldList');

const editVehicleFieldBtn = document.getElementById('editVehicleFieldBtn');
const editfieldvehicle = document.getElementById('editfieldvehicle');
const editvehicleFieldList = document.getElementById('editvehicleFieldList');


let currentRow;

// Function to open add staff modal
openStaffModalbtn.addEventListener('click', () => {
    addStaffModal.classList.remove('hidden');
});

// Function to close add staff modal
closeStaffModalbtn.addEventListener('click', () => {
    addStaffModal.classList.add('hidden');
});

// Function to add staff
addStaffForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const designation = document.getElementById('designation').value;
    const gender = document.getElementById('gender').value;
    const joinDate = document.getElementById('joinedDate').value;
    const dob = document.getElementById('dob').value;
    const address = document.getElementById('address').value;
    const contactNo = document.getElementById('contactNo').value;
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value;

    const row = document.createElement('tr');
    row.classList.add('border-b');
    row.innerHTML = `
        <td class="p-4 text-center">${firstName}</td>
        <td class="p-4 text-center">${lastName}</td>
        <td class="p-4 text-center">${designation}</td>
        <td class="p-4 text-gray-500 space-x-3">
            <button class="text-green-500 px-1 viewStaffDetailbtn" data-id="${email}">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button class="text-blue-500 px-1 editStaffbtn" id="openStaffEditModal">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="text-red-500 border-2 border-red-400 rounded-full px-1 delete-staff-btn">
                <i class="fa-solid fa-times"></i>
            </button>
        </td>
    `;
    staffTableBody.appendChild(row);
    addStaffModal.classList.add('hidden');
    addStaffForm.reset();

    row.querySelector('.delete-staff-btn').addEventListener('click', function() {
        deleteStaff(this);
    });

    row.querySelector('.editStaffbtn').addEventListener('click', function () {
        editStaff(this, {
            firstName,
            lastName,
            designation,
            gender,
            joinDate,
            dob,
            address,
            contactNo,
            role,
            email,
        });
    });

    row.querySelector('.viewStaffDetailbtn').addEventListener('click', function () {
        viewStaffDetail({
            firstName,
            lastName,
            designation,
            gender,
            joinDate,
            dob,
            address,
            contactNo,
            role,
            email,
        });
    });
});

// Function to view staff detail
function viewStaffDetail(staff) {
    document.getElementById('staffDetailsContent').innerHTML = `
        <p class="flex items-center text-gray-700">
            <i class="fas fa-user-circle mr-2"></i><strong>First Name:</strong> <span class="font-medium ml-2">${staff.firstName}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-user-circle mr-2"></i><strong>Last Name:</strong> <span class="font-medium ml-2">${staff.lastName}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-id-badge mr-2"></i><strong>Designation:</strong> <span class="font-medium ml-2">${staff.designation}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-venus-mars mr-2"></i><strong>Gender:</strong> <span class="font-medium ml-2">${staff.gender}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-calendar-alt mr-2"></i><strong>Joined Date:</strong> <span class="font-medium ml-2">${staff.joinDate}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-birthday-cake mr-2"></i><strong>DOB:</strong> <span class="font-medium ml-2">${staff.dob}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-map-marker-alt mr-2"></i><strong>Address:</strong> <span class="font-medium ml-2">${staff.address}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-phone-alt mr-2"></i><strong>Contact No:</strong> <span class="font-medium ml-2">${staff.contactNo}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-envelope mr-2"></i><strong>Email:</strong> <span class="font-medium ml-2">${staff.email}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-user-tag mr-2"></i><strong>Role:</strong> <span class="font-medium ml-2">${staff.role}</span>
        </p>
        

        <!-- Fields -->
            <p class="flex items-center text-gray-700">
                <i class="fas fa-briefcase mr-2"></i><strong>Field:</strong>
            </p>
            <ul id="staffFields" class="ml-6 list-disc text-gray-600">
                <li>Field 1</li>
                <li>Field 2</li>
                <li>Field 3</li>
            </ul>

            <!-- Vehicles -->
            <p class="flex items-center text-gray-700 mt-4">
                <i class="fas fa-car mr-2"></i><strong>Vehicle:</strong>
            </p>
            <ul id="staffVehicles" class="ml-6 list-disc text-gray-600">
                <li>Vehicle 1</li>
                <li>Vehicle 2</li>
                <li>Vehicle 3</li>
            </ul>

    `;
    document.getElementById('staffDetailModal').classList.remove('hidden');
}

document.getElementById('closeStaffDetailModal').addEventListener('click', function () {
    document.getElementById('staffDetailModal').classList.add('hidden');
});

// Function to edit staff
function editStaff(button, staff) {
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    document.getElementById('editfirstName').value = cells[0].innerText;
    document.getElementById('editlastName').value = cells[1].innerText;
    document.getElementById('editdesignation').value = cells[2].innerText;
    document.getElementById('editgender').value = staff.gender;
    document.getElementById('editjoinedDate').value = staff.joinDate;
    document.getElementById('editdob').value = staff.dob;
    document.getElementById('editaddress').value = staff.address;
    document.getElementById('editcontactNo').value = staff.contactNo;
    document.getElementById('editemail').value = staff.email;
    document.getElementById('editrole').value = staff.role;

    // Open the edit modal
    editStaffModal.classList.remove('hidden');
}

// Function to close edit modal
closeStaffEditModal.addEventListener('click', () => {
    editStaffModal.classList.add('hidden');
});

document.querySelectorAll('.editStaffbtn').forEach(button => {
    button.addEventListener('click', function () {
        editStaff(this);
    });
});


// Submit edit form and update the view
editStaffForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Update table row with new values
    currentRow.children[0].innerText = document.getElementById('editfirstName').value;
    currentRow.children[1].innerText = document.getElementById('editlastName').value;
    currentRow.children[2].innerText = document.getElementById('editdesignation').value;

    // View updated staff details
    viewStaffDetail({
        firstName: document.getElementById('editfirstName').value,
        lastName: document.getElementById('editlastName').value,
        designation: document.getElementById('editdesignation').value,
        gender: document.getElementById('editgender').value,
        joinDate: document.getElementById('editjoinedDate').value,
        dob: document.getElementById('editdob').value,
        address: document.getElementById('editaddress').value,
        contactNo: document.getElementById('editcontactNo').value,
        email: document.getElementById('editemail').value,
        role: document.getElementById('editrole').value,
    });

    // Close the edit modal
    editStaffModal.classList.add('hidden');
});

// Function to delete staff
function deleteStaff(button) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this staff?');
    
    if (confirmation) {
        row.remove();
    }
}

addStaffFieldBtn.addEventListener('click', () => {
    const selectedField = staffFieldSelect.value;
    if (selectedField) {
        const fieldItem = document.createElement('div');
        fieldItem.className = 'flex justify-between items-center mb-1 text-gray-700';
        fieldItem.innerHTML = `
            <span>${selectedField}</span>
            <button type="button" class="text-red-500 font-bold remove-edit-field">X</button>
        `;
        staffFieldList.appendChild(fieldItem);

        // Handle removal of field items
        fieldItem.querySelector('.remove-edit-field').addEventListener('click', () => {
            staffFieldList.removeChild(fieldItem);
        });
    }
});

addVehicleFieldBtn.addEventListener('click', () => {
    const selectedVehicle = fieldvehicle.value;
    if (selectedVehicle) {
        const vehicleItem = document.createElement('div');
        vehicleItem.className = 'flex justify-between items-center mb-1 text-gray-700';
        vehicleItem.innerHTML = `
            <span>${selectedVehicle}</span>
            <button type="button" class="text-red-500 font-bold remove-edit-vehicle">X</button>
        `;
        vehicleFieldList.appendChild(vehicleItem);

        // Handle removal of vehicle items
        vehicleItem.querySelector('.remove-edit-vehicle').addEventListener('click', () => {
            vehicleFieldList.removeChild(vehicleItem);
        });
    }
});

editStaffFieldBtn.addEventListener('click', () => {
    const selectedStaffField = staffEditFieldSelect.value;
    if (selectedStaffField) {
        const staffFieldItem = document.createElement('div');
        staffFieldItem.className = 'flex justify-between items-center mb-1 text-gray-700';
        staffFieldItem.innerHTML = `
            <span>${selectedStaffField}</span>
            <button type="button" class="text-red-500 font-bold remove-edit-staff-field">X</button>
        `;
        editstaffFieldList.appendChild(staffFieldItem);

        // Handle removal of staff field items
        staffFieldItem.querySelector('.remove-edit-staff-field').addEventListener('click', () => {
            editstaffFieldList.removeChild(staffFieldItem);
        });
    }
});

editVehicleFieldBtn.addEventListener('click', () => {
    const selectedVehicle = editfieldvehicle.value;
    if (selectedVehicle) {
        const vehicleFieldItem = document.createElement('div');
        vehicleFieldItem.className = 'flex justify-between items-center mb-1 text-gray-700';
        vehicleFieldItem.innerHTML = `
            <span>${selectedVehicle}</span>
            <button type="button" class="text-red-500 font-bold remove-edit-vehicle-field">X</button>
        `;
        editvehicleFieldList.appendChild(vehicleFieldItem);

        // Handle removal of vehicle field items
        vehicleFieldItem.querySelector('.remove-edit-vehicle-field').addEventListener('click', () => {
            editvehicleFieldList.removeChild(vehicleFieldItem);
        });
    }
});