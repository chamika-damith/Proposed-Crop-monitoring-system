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

getAllVehicles();

// Open modal when the add vehicle button is clicked
openVehicleModalBtn.addEventListener('click', () => {
    loadStaffOptions();
    generateVehicleId(function (response) {
        document.getElementById('vehicleId').value = response;
    });
    addVehicleModal.classList.remove('hidden');
});

// Close modal when the cancel button is clicked
closeVehicleModalBtn.addEventListener('click', () => {
    addVehicleModal.classList.add('hidden');
});

// Add new vehicle to the table
addVehicleForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const vehicleId = document.getElementById('vehicleId').value;
    const licensePlateNumber = document.getElementById('licensePlateNumber').value;
    const category = document.getElementById('vehicleCategory').value;
    const fuelType = document.getElementById('fuelType').value;
    const status = document.getElementById('status').value;
    const allocatedStaff = document.getElementById('allocatedStaff').value;
    const remarks = document.getElementById('remarks').value;

    if (!vehicleId || !licensePlateNumber || !category || !fuelType || !status || !allocatedStaff || !remarks) {
        alert("Please fill out all vehicle.");
        return;
    }

    if(isAddVehicleValidate()){
        fetchStaff(allocatedStaff, (staff) => {
            const vehicleData = {
                vehicleCode: vehicleId,
                licensePlateNum: licensePlateNumber,
                category: category,
                fuelType: fuelType,
                status: status,
                remarks: remarks,
                staff: staff,
            };
    
            saveVehicle(vehicleData);
        });
    }
});

function loadStaffOptions() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: "http://localhost:8080/api/v1/staff",
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        success: function (staff) {
            const staffDropdown = document.getElementById('allocatedStaff');

            staffDropdown.innerHTML = '<option value="">Select Staff</option>';

            staff.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.id;
                option.textContent = staff.id;
                staffDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading staff:", error);
            alert("Failed to load staff. Please try again later.");
        }
    });
}

function loadEditStaffOptions() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: "http://localhost:8080/api/v1/staff",
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        success: function (staff) {
            const staffDropdown = document.getElementById('allocatedEditStaff');

            staffDropdown.innerHTML = '<option value="">Select Staff</option>';

            staff.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.id;
                option.textContent = staff.id;
                staffDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading staff:", error);
            alert("Failed to load staff. Please try again later.");
        }
    });
}

function fetchStaff(staffId, callback) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: `http://localhost:8080/api/v1/staff/${staffId}`,
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        success: callback,
        error: (error) => {
            console.error("Error loading staff:", error);
            alert("Failed to load staff data. Please try again.");
        },
    });
}

function saveVehicle(data) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/vehicle',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(data),
    })
        .done((response) => {
            console.log('Vehicle added successfully:', response);

            // Refresh vehicle list
            getAllVehicles();

            // Close modal and reset form
            addVehicleModal.classList.add('hidden');
            addVehicleForm.reset();
        })
        .fail((error) => {
            console.error('Error adding vehicle:', error);
            alert(error.responseJSON?.message || 'Failed to add vehicle. Please try again.');
        });
}

function getAllVehicles() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/vehicle',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
        .done((vehicleList) => {
            vehicleTableBody.innerHTML = '';

            vehicleList.forEach((vehicle) => {
                const row = document.createElement('tr');
                row.classList.add('border-b');

                row.innerHTML = `
                    <td class="p-4 text-center">${vehicle.vehicleCode}</td>
                    <td class="p-4 text-center">${vehicle.licensePlateNum}</td>
                    <td class="p-4 text-center">${vehicle.category}</td>
                    <td class="p-4 text-center">${vehicle.fuelType}</td>
                    <td class="p-4 text-center">${vehicle.status}</td>
                    <td class="p-4 text-center">${vehicle.staff ? vehicle.staff.id : 'N/A'}</td>
                    <td class="p-4 text-center">${vehicle.remarks || ''}</td>
                    <td class="p-4 text-center space-x-3">
                        <button class="text-blue-500 px-1 editVehiclebtn">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="text-red-500 border-2 border-red-400 rounded-full px-1 delete-vehicle-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </td>
                `;

                vehicleTableBody.appendChild(row);

                row.querySelector('.editVehiclebtn').addEventListener('click', function () {
                    editVehicle(this, vehicle.vehicleCode);
                });

                row.querySelector('.delete-vehicle-btn').addEventListener('click', function () {
                    deleteVehicle(this, vehicle.vehicleCode);
                });
            });
        })
        .fail((error) => {
            console.error('Error fetching vehicles:', error);
            alert('Failed to fetch vehicles. Please try again later.');
        });
}



// Function to edit vehicle data
function editVehicle(button, vehicleCode) {
    loadEditStaffOptions();
    const currentRow = button.closest('tr');
    if (!currentRow) {
        console.error('Error: No parent row found for the button.');
        return;
    }

    const cells = currentRow.children;

    document.getElementById('editvehicleId').value = vehicleCode;
    document.getElementById('editLicensePlateNumber').value = cells[1].innerText;
    document.getElementById('editVehicleCategory').value = cells[2].innerText;
    document.getElementById('editFuelType').value = cells[3].innerText;
    document.getElementById('editStatus').value = cells[4].innerText;
    document.getElementById('allocatedEditStaff').value = cells[5].innerText;
    document.getElementById('editRemarks').value = cells[6].innerText;

    editVehicleModal.classList.remove('hidden');
}


// Attach event listener to edit buttons
document.querySelectorAll('.editbtn').forEach(button => {
    button.addEventListener('click', function () {
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

    const editvehicleId = document.getElementById('editvehicleId').value;
    const licensePlateNumber = document.getElementById('editLicensePlateNumber').value;
    const category = document.getElementById('editVehicleCategory').value;
    const fuelType = document.getElementById('editFuelType').value;
    const status = document.getElementById('editStatus').value;
    const allocatedStaff = document.getElementById('allocatedEditStaff').value;
    const remarks = document.getElementById('editRemarks').value;

    if (!editvehicleId || !licensePlateNumber || !category || !fuelType || !status || !allocatedStaff || !remarks) {
        alert("Please fill out all vehicle.");
        return;
    }

    if(isEditVehicleValidate()){
        fetchStaff(allocatedStaff, (staff) => {
            const updatedVehicle = {
                vehicleCode: editvehicleId,
                licensePlateNum: licensePlateNumber,
                category: category,
                fuelType: fuelType,
                status: status,
                remarks: remarks,
                staff: staff,
            };
    
            updateVehicle(updatedVehicle);
        });
    }

});

function updateVehicle(vehicle) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: `http://localhost:8080/api/v1/vehicle/${vehicle.vehicleCode}`,
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(vehicle),
    })
        .done((response) => {
            console.log('Vehicle updated successfully:', response);
            getAllVehicles();
            editVehicleModal.classList.add('hidden');
        })
        .fail((error) => {
            console.error('Error updating vehicle:', error);
            alert(error.responseJSON?.message || 'Failed to update vehicle. Please try again.');
        });
}

// Function to delete vehicle
function deleteVehicle(button, id) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    if (confirm('Are you sure you want to delete this vehicle?')) {
        $.ajax({
            url: `http://localhost:8080/api/v1/vehicle/${id}`,
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        })
            .done(() => {
                console.log('Vehicle deleted successfully.');
                getAllVehicles();
            })
            .fail((error) => {
                console.error('Error deleting vehicle:', error);
                alert('Failed to delete vehicle. Please try again.');
            });
    }
}

function generateVehicleId(callback) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    var request = {
        "url": "http://localhost:8080/api/v1/vehicle/generateId",
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

function isAddVehicleValidate() {
    let isValid = true;

    // Validate License Plate Number (example pattern: alphanumeric with optional dashes or spaces)
    const licensePlatePattern = /^[A-Za-z0-9\- ]{1,10}$/;
    if (!licensePlatePattern.test($('#licensePlateNumber').val())) {
        isValid = false;
        $('#licensePlateNumber').css('border', '2px solid red');
        $('.errorMessagelicensePlateNumber').show();
    } else {
        $('#licensePlateNumber').css('border', '1px solid #ccc');
        $('.errorMessagelicensePlateNumber').hide();
    }

    // Validate Vehicle Category (example pattern: non-empty alphanumeric, allowing spaces)
    const vehicleCategoryPattern = /^[A-Za-z0-9 ]{3,30}$/;
    if (!vehicleCategoryPattern.test($('#vehicleCategory').val())) {
        isValid = false;
        $('#vehicleCategory').css('border', '2px solid red');
        $('.errorMessageVehicleCategory').show();
    } else {
        $('#vehicleCategory').css('border', '1px solid #ccc');
        $('.errorMessageVehicleCategory').hide();
    }


    // Alert the user if there are validation errors
    if (!isValid) {
        alert('Please correct the highlighted fields before submitting.');
    }

    return isValid;
}

function isEditVehicleValidate() {
    let isValid = true;

    // Validate License Plate Number (example pattern: alphanumeric with optional dashes or spaces)
    const licensePlatePattern = /^[A-Za-z0-9\- ]{1,10}$/;
    if (!licensePlatePattern.test($('#editLicensePlateNumber').val())) {
        isValid = false;
        $('#editLicensePlateNumber').css('border', '2px solid red');
        $('.errorMessageEditlicensePlateNumber').show();
    } else {
        $('#editLicensePlateNumber').css('border', '1px solid #ccc');
        $('.errorMessageEditlicensePlateNumber').hide();
    }

    // Validate Vehicle Category (example pattern: non-empty alphanumeric, allowing spaces)
    const vehicleCategoryPattern = /^[A-Za-z0-9 ]{3,30}$/;
    if (!vehicleCategoryPattern.test($('#editVehicleCategory').val())) {
        isValid = false;
        $('#editVehicleCategory').css('border', '2px solid red');
        $('.errorMessageEditlicensePlateNumber').show();
    } else {
        $('#editVehicleCategory').css('border', '1px solid #ccc');
        $('.errorMessageEditlicensePlateNumber').hide();
    }


    // Alert the user if there are validation errors
    if (!isValid) {
        alert('Please correct the highlighted fields before submitting.');
    }

    return isValid;
}
