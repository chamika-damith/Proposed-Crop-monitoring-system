// Define constants for modal and form elements
const openStaffModalbtn = document.getElementById('openStaffModal');
const closeStaffModalbtn = document.getElementById('closeStaffModal');
const addStaffForm = document.getElementById('addStaffForm');
const staffTableBody = document.getElementById('staffTableBody');
const addStaffModal = document.getElementById('addStaffModal');


document.addEventListener('DOMContentLoaded', () => {
    getAllStaff();
});

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
    generateStaffId(function (response) {
        document.getElementById('staffId').value = response;
    });
    loadFieldOptions();
    addStaffModal.classList.remove('hidden');
});

// Function to close add staff modal
closeStaffModalbtn.addEventListener('click', () => {
    addStaffModal.classList.add('hidden');
});

// Function to add staff
addStaffForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const staffFieldsList = getAllStaffFields();
    if (staffFieldsList.length === 0) {
        console.warn("No fields found to fetch.");
        return;
    }

    const fieldList = await Promise.all(
        staffFieldsList.map((fieldId) =>
            fetchField(fieldId).catch((error) => {
                console.error(`Error fetching field ${fieldId}:`, error);
                return null;
            })
        )
    );

    const validFields = fieldList.filter((field) => field !== null);

    const id = document.getElementById('staffId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const designation = document.getElementById('designation').value;
    const gender = document.getElementById('gender').value.toUpperCase();
    const joinedDate = document.getElementById('joinedDate').value;
    const dob = document.getElementById('dob').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contactNo').value;
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value;
    const fields = validFields;

    if (!id || !firstName || !lastName || !designation || !gender || !joinedDate || !dob || !address || !contact || !role || !email || fields.length === 0) {
        alert("Please fill out all fields and select an image.");
        return;
    }

    if (isAddStaffValidate()) {
        const staffData = {
            id,
            firstName,
            lastName,
            designation,
            gender,
            joinedDate,
            dob,
            address,
            contact,
            role,
            email,
            fields
        };
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found. Please log in.");
            return;
        }

        $.ajax({
            url: 'http://localhost:8080/api/v1/staff',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(staffData),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        })
            .done((response) => {
                if (response.statusCode == 201) {
                    console.log('Staff saved successfully:', response);
                    getAllStaff();
                    addStaffModal.classList.add('hidden');
                    addStaffForm.reset();
                } else {
                    console.error('Error saving staff:', response.statusMassage);
                    alert('Failed to save staff -> ' + response.statusMassage);
                }
            })
            .fail((error) => {
                console.error('Error saving staff:', error);
                alert(error.responseJSON?.message || 'Failed to save staff. Please try again.');
            });
    }
});


function getAllStaffFields() {
    const staffFieldListDiv = document.getElementById('staffFieldList');
    const staffFields = [];

    for (let child of staffFieldListDiv.children) {
        const field = child.textContent.trim();
        const match = field.match(/^F-[\w-]+/);
        if (match) {
            staffFields.push(match[0]);
        }
    }

    return staffFields;
}

function getAllEditStaffFields() {
    const staffFieldListDiv = document.getElementById('editstaffFieldList');
    const staffFields = [];

    for (let child of staffFieldListDiv.children) {
        const field = child.textContent.trim();
        const match = field.match(/^F-[\w-]+/);
        if (match) {
            staffFields.push(match[0]);
        }
    }

    return staffFields;
}

function fetchField(fieldId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `http://localhost:8080/api/v1/fields/${fieldId}`,
            method: "GET",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            success: resolve,
            error: (error) => {
                console.error("Error loading field:", error);
                reject(error);
            },
        });
    });
}

function getAllStaff() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/staff',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
        .done((staffList) => {
            const staffTableBody = document.getElementById('staffTableBody');
            staffTableBody.innerHTML = '';

            staffList.forEach((staff) => {
                const row = document.createElement('tr');
                row.classList.add('border-b');
                row.innerHTML = `
                    <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${staff.id}</td>
                    <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${staff.firstName}</td>
                    <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${staff.lastName}</td>
                    <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${staff.designation}</td>
                    <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 space-x-3">
                        <button class="text-green-500 px-1 viewStaffDetailbtn" data-id="${staff.id}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="text-blue-500 hover:text-blue-600 px-2 py-1 rounded transition-all duration-200 ease-in-out editStaffbtn" id="openStaffEditModal">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="text-red-500 hover:text-red-600 border-2 border-red-400 hover:border-red-500 rounded-full px-2 py-1 transition-all duration-200 ease-in-out  delete-staff-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </td>
                `;

                staffTableBody.appendChild(row);

                // Add event listener for the 'View Details' button
                row.querySelector('.viewStaffDetailbtn').addEventListener('click', function () {
                    viewStaffDetail(staff);
                });

                // Add event listener for the 'Edit' button
                row.querySelector('.editStaffbtn').addEventListener('click', function () {
                    editStaff(this, staff);
                });

                // Add event listener for the 'Delete' button
                row.querySelector('.delete-staff-btn').addEventListener('click', function () {
                    deleteStaff(this, staff.id);
                });
            });
        })
        .fail((error) => {
            console.error('Error fetching staff:', error);
            alert('Failed to fetch staff. Please try again later.');
        });
}



// Function to view staff detail
function viewStaffDetail(staff) {
    // Generate fields dynamically if available
    const fieldsHtml = staff.fields
        ? staff.fields.map(field => `
            <li>
                <strong>Field Name:</strong> ${field.fieldName}
            </li>
          `).join('')
        : '<li>No fields available.</li>';

    // Generate vehicles dynamically if available
    const vehiclesHtml = staff.vehicles
        ? staff.vehicles.map(vehicle => `
            <li>
                <strong>Vehicle Name:</strong> ${vehicle.name}
            </li>
          `).join('')
        : '<li>No vehicles available.</li>';

    // Update modal content dynamically
    document.getElementById('staffDetailsContent').innerHTML = `
        <p class="flex items-center text-gray-700">
            <i class="fas fa-user-circle mr-2"></i><strong>First Name:</strong> <span class="font-medium ml-2">${staff.firstName || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-user-circle mr-2"></i><strong>Last Name:</strong> <span class="font-medium ml-2">${staff.lastName || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-id-badge mr-2"></i><strong>Designation:</strong> <span class="font-medium ml-2">${staff.designation || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-venus-mars mr-2"></i><strong>Gender:</strong> <span class="font-medium ml-2">${staff.gender || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-calendar-alt mr-2"></i><strong>Joined Date:</strong> <span class="font-medium ml-2">${staff.joinedDate || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-birthday-cake mr-2"></i><strong>DOB:</strong> <span class="font-medium ml-2">${staff.dob || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-map-marker-alt mr-2"></i><strong>Address:</strong> <span class="font-medium ml-2">${staff.address || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-phone-alt mr-2"></i><strong>Contact No:</strong> <span class="font-medium ml-2">${staff.contact || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-envelope mr-2"></i><strong>Email:</strong> <span class="font-medium ml-2">${staff.email || 'N/A'}</span>
        </p>
        <p class="flex items-center text-gray-700">
            <i class="fas fa-user-tag mr-2"></i><strong>Role:</strong> <span class="font-medium ml-2">${staff.role || 'N/A'}</span>
        </p>

        <!-- Fields -->
        <p class="flex items-center text-gray-700 mt-4">
            <i class="fas fa-briefcase mr-2"></i><strong>Fields:</strong>
        </p>
        <ul id="staffFields" class="ml-6 list-disc text-gray-600">
            ${fieldsHtml}
        </ul>

        <!-- Vehicles -->
        <p class="flex items-center text-gray-700 mt-4">
            <i class="fas fa-car mr-2"></i><strong>Vehicles:</strong>
        </p>
        <ul id="staffVehicles" class="ml-6 list-disc text-gray-600">
            ${vehiclesHtml}
        </ul>
    `;

    // Show modal
    const modal = document.getElementById('staffDetailModal');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}


document.getElementById('closeStaffDetailModal').addEventListener('click', function () {
    document.getElementById('staffDetailModal').classList.add('hidden');
});

// Function to edit staff
function editStaff(button, staff) {
    loadEditFieldOptions();
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    document.getElementById('editStaffId').value = staff.id;
    document.getElementById('editfirstName').value = staff.firstName;
    document.getElementById('editlastName').value = staff.lastName;
    document.getElementById('editdesignation').value = staff.designation;
    document.getElementById('editgender').value = staff.gender;
    document.getElementById('editjoinedDate').value = staff.joinedDate;
    document.getElementById('editdob').value = staff.dob;
    document.getElementById('editaddress').value = staff.address;
    document.getElementById('editcontactNo').value = staff.contact;
    document.getElementById('editemail').value = staff.email;
    document.getElementById('editrole').value = staff.role;

    staff.fields.map(field => {
        const fieldItem = document.createElement('div');
        fieldItem.className = 'flex justify-between items-center mb-1 text-gray-700';
        fieldItem.innerHTML = `
            <span>${field.fieldCode}</span>
            <button type="button" class="text-red-500 font-bold remove-edit-field">X</button>
        `;
        editstaffFieldList.appendChild(fieldItem);

        // Handle removal of field items
        fieldItem.querySelector('.remove-edit-field').addEventListener('click', () => {
            editstaffFieldList.removeChild(fieldItem);
        });
    })



    // Open the edit modal
    document.getElementById('editStaffModal').classList.remove('hidden');
}


// Function to close edit modal
closeStaffEditModal.addEventListener('click', () => {
    editstaffFieldList.innerHTML = '';
    editStaffModal.classList.add('hidden');
});

document.querySelectorAll('.editStaffbtn').forEach(button => {
    button.addEventListener('click', function () {
        editStaff(this);
    });
});


// Submit edit form and update the view
editStaffForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const staffFieldsList = getAllEditStaffFields();
    if (staffFieldsList.length === 0) {
        console.warn("No fields found to fetch.");
        return;
    }

    const fieldList = await Promise.all(
        staffFieldsList.map((fieldId) =>
            fetchField(fieldId).catch((error) => {
                console.error(`Error fetching field ${fieldId}:`, error);
                return null;
            })
        )
    );

    const validFields = fieldList.filter((field) => field !== null);

    const id = document.getElementById('editStaffId').value;
    const firstName = document.getElementById('editfirstName').value;
    const lastName = document.getElementById('editlastName').value;
    const designation = document.getElementById('editdesignation').value;
    const gender = document.getElementById('editgender').value.toUpperCase();
    const joinedDate = document.getElementById('editjoinedDate').value;
    const dob = document.getElementById('editdob').value;
    const address = document.getElementById('editaddress').value;
    const contact = document.getElementById('editcontactNo').value;
    const role = document.getElementById('editrole').value;
    const email = document.getElementById('editemail').value;
    const fields = validFields;

    if (isUpdateStaffValidate()) {
        const updatedStaff = {
            id,
            firstName,
            lastName,
            designation,
            gender,
            joinedDate,
            dob,
            address,
            contact,
            role,
            email,
            fields
        };

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found. Please log in.");
            return;
        }
        $.ajax({

            url: `http://localhost:8080/api/v1/staff/${updatedStaff.id}`,
            method: "PUT",
            contentType: "application/json",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: JSON.stringify(updatedStaff),
            success: function (response) {
                if (response.statusCode == 200) {
                    console.log("Staff updated successfully:", response);
                    getAllStaff();
                    document.getElementById('editStaffModal').classList.add('hidden');
                } else {
                    console.error("Error updating staff:", response.statusMassage);
                    alert("Failed to update staff -> " + response.statusMassage);
                }

            },
            error: function (error) {
                console.error("Error updating staff:", error);
                alert("Failed to update staff. Please try again later.");
            }
        });

        editstaffFieldList.innerHTML = '';

        // Close the edit modal
        editStaffModal.classList.add('hidden');
    }
});



// Function to delete staff
function deleteStaff(button, staffId) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this staff?');
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    if (confirmation) {
        $.ajax({
            url: `http://localhost:8080/api/v1/staff/${staffId}`,
            method: 'DELETE',
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                console.log("Staff deleted successfully:", response);
                getAllStaff();
            },
            error: function (error) {
                console.error("Error deleting staff:", error);
                alert("Failed to delete staff. Please try again.");
            }
        });
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

function generateStaffId(callback) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    var request = {
        "url": "http://localhost:8080/api/v1/staff/generateId",
        "method": "GET",
        "timeout": 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
    };

    $.ajax(request).done(function (response) {
        if (callback) {
            callback(response);
        }
    }).fail(function (error) {
        console.error("Error fetching staff ID:", error);
    });
}

function loadFieldOptions() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/fields",
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        success: function (fields) {
            const cropFieldDropdown = document.getElementById('staffFieldSelect');

            cropFieldDropdown.innerHTML = '<option value="">Select Field</option>';

            fields.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode;
                option.textContent = field.fieldCode;
                cropFieldDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
            alert("Failed to load fields. Please try again later.");
        }
    });
}

function loadEditFieldOptions() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/fields",
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        success: function (fields) {
            const cropFieldDropdown = document.getElementById('staffEditFieldSelect');

            cropFieldDropdown.innerHTML = '<option value="">Select Field</option>';

            fields.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode;
                option.textContent = field.fieldCode;
                cropFieldDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
            alert("Failed to load fields. Please try again later.");
        }
    });
}

function isAddStaffValidate() {
    let isValid = true;

    // Validate First Name
    if (!/^\s*\S.{2,48}\S\s*$/.test($('#firstName').val())) {
        isValid = false;
        $('#firstName').css('border', '2px solid red');
        $('.errorMessageStaffFistName').show();
    } else {
        $('#firstName').css('border', '1px solid #ccc');
        $('.errorMessageStaffFistName').hide();
    }

    // Validate Last Name
    if (!/^\s*\S.{2,48}\S\s*$/.test($('#lastName').val())) {
        isValid = false;
        $('#lastName').css('border', '2px solid red');
        $('.errorMessageStaffLastName').show();
    } else {
        $('#lastName').css('border', '1px solid #ccc');
        $('.errorMessageStaffLastName').hide();
    }

    // Validate Designation
    if (!/^.{7,}$/.test($('#designation').val())) {
        isValid = false;
        $('#designation').css('border', '2px solid red');
        $('.errorMessageStaffDesignation').show();
    } else {
        $('#designation').css('border', '1px solid #ccc');
        $('.errorMessageStaffDesignation').hide();
    }

    // Validate Address
    if (!/^.{7,}$/.test($('#address').val())) {
        isValid = false;
        $('#address').css('border', '2px solid red');
        $('.errorMessageStaffAddress').show();
    } else {
        $('#address').css('border', '1px solid #ccc');
        $('.errorMessageStaffAddress').hide();
    }

    // Validate Contact Number
    if (!/^\d{10}$/.test($('#contactNo').val())) {
        isValid = false;
        $('#contactNo').css('border', '2px solid red');
        $('.errorMessageStaffContact').show();
    } else {
        $('#contactNo').css('border', '1px solid #ccc');
        $('.errorMessageStaffContact').hide();
    }

    // Validate Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#email').val())) {
        isValid = false;
        $('#email').css('border', '2px solid red');
        $('.errorMessageStaffEmail').show();
    } else {
        $('#email').css('border', '1px solid #ccc');
        $('.errorMessageStaffEmail').hide();
    }

    // Alert the user if there are validation errors
    if (!isValid) {
        alert('Please correct the highlighted fields before submitting.');
    }

    return isValid;
}

function isUpdateStaffValidate() {
    let isValid = true;

    // Validate First Name
    if (!/^\s*\S.{2,48}\S\s*$/.test($('#editfirstName').val())) {
        isValid = false;
        $('#editfirstName').css('border', '2px solid red');
        $('.errorMessageEditStaffFistName').show();
    } else {
        $('#editfirstName').css('border', '1px solid #ccc');
        $('.errorMessageEditStaffFistName').hide();
    }

    // Validate Last Name
    if (!/^\s*\S.{2,48}\S\s*$/.test($('#editlastName').val())) {
        isValid = false;
        $('#editlastName').css('border', '2px solid red');
        $('.errorMessageEditStaffLastName').show();
    } else {
        $('#editlastName').css('border', '1px solid #ccc');
        $('.errorMessageEditStaffLastName').hide();
    }

    // Validate Designation
    if (!/^.{7,}$/.test($('#editdesignation').val())) {
        isValid = false;
        $('#editdesignation').css('border', '2px solid red');
        $('.errorMessageEditStaffDesignation').show();
    } else {
        $('#editdesignation').css('border', '1px solid #ccc');
        $('.errorMessageEditStaffDesignation').hide();
    }

    // Validate Address
    if (!/^.{7,}$/.test($('#editaddress').val())) {
        isValid = false;
        $('#editaddress').css('border', '2px solid red');
        $('.errorMessageEditStaffAddress').show();
    } else {
        $('#editaddress').css('border', '1px solid #ccc');
        $('.errorMessageEditStaffAddress').hide();
    }

    // Validate Contact Number
    if (!/^\d{10}$/.test($('#editcontactNo').val())) {
        isValid = false;
        $('#editcontactNo').css('border', '2px solid red');
        $('.errorMessageEditStaffContact').show();
    } else {
        $('#editcontactNo').css('border', '1px solid #ccc');
        $('.errorMessageEditStaffContact').hide();
    }

    // Validate Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#editemail').val())) {
        isValid = false;
        $('#editemail').css('border', '2px solid red');
        $('.errorMessageEditStaffEmailtext').show();
    } else {
        $('#editemail').css('border', '1p6x solid #ccc');
        $('.errorMessageEditStaffEmailtext').hide();
    }

    // Alert the user if there are validation errors
    if (!isValid) {
        alert('Please correct the highlighted fields before submitting.');
    }

    return isValid;
}
