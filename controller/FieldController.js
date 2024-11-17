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


const addeditStaffBtn = document.getElementById('addeditStaffBtn');
const editfieldStaff = document.getElementById('editfieldStaff');
const editstaffList = document.getElementById('editstaffList');

document.addEventListener('DOMContentLoaded', () => {
    getAllFields();
});

let currentRow;

// Function to open add field modal
openModalButton.addEventListener('click', () => {
    generateFieldId(function (response) {
        document.getElementById('fieldCode').value = response;
    });
    addFieldModal.classList.remove('hidden');
});

// Function to close add field modal
closeModalButton.addEventListener('click', () => {
    addFieldModal.classList.add('hidden');
});

// Function to add field
addFieldForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fieldCode = document.getElementById('fieldCode').value;
    const fieldName = document.getElementById('fieldName').value;
    const fieldLocation = document.getElementById('fieldLocation').value;
    const fieldSize = document.getElementById('fieldSize').value;
    const fieldImage = document.getElementById('fieldImage').files[0];

    if (!fieldCode || !fieldName || !fieldLocation || !fieldSize || !fieldImage) {
        alert("Please fill out all fields and select an image.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1];

        const requestData = {
            fieldCode: fieldCode,
            fieldName: fieldName,
            fieldLocation: fieldLocation,
            fieldSize: fieldSize,
            fieldImage: base64Image,
        };


        $.ajax({
            url: "http://localhost:8080/api/v1/fields",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(requestData),
        })
            .done(function (response) {
                console.log("Field saved successfully:", response);

                getAllFields();
                addFieldModal.classList.add('hidden');
                addFieldForm.reset();
            })
            .fail(function (error) {
                console.error("Error saving field:", error);
                alert("Failed to save field. Please try again.");
            });
    };

    reader.readAsDataURL(fieldImage);
});



// Function to edit field
function editField(button) {
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    document.getElementById('editfieldCode').value = cells[0].querySelector('span').innerText;
    document.getElementById('editfieldName').value = cells[1].innerText;
    document.getElementById('editfieldLocation').value = cells[2].innerText;
    document.getElementById('editfieldSize').value = cells[3].innerText;

    const currentImage = cells[0].querySelector('img').src; 
    document.getElementById('editImagePreview').src = currentImage;

    editFieldModal.classList.remove('hidden');
}

document.getElementById('editfieldImage').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('editImagePreview').src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});


// Attach event listener to edit buttons
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function () {
        editField(this);
    });
});




// Function to delete field
function deleteField(button, fieldCode) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this field?');

    if (confirmation) {
        $.ajax({
            url: `http://localhost:8080/api/v1/fields/${fieldCode}`,
            method: 'DELETE',
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
            },
            success: function(response) {
                console.log("Field deleted successfully:", response);
                getAllFields();
            },
            error: function(error) {
                console.error("Error deleting field:", error);
                alert("Failed to delete field. Please try again.");
            }
        });
    }
}



// Function to close edit modal
closeEditModalBtn.addEventListener('click', () => {
    editFieldModal.classList.add('hidden');
});

// Handle form submission for editing
editFieldForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fieldCode = document.getElementById('editfieldCode').value;
    const fieldName = document.getElementById('editfieldName').value;
    const fieldLocation = document.getElementById('editfieldLocation').value;
    const fieldSize = document.getElementById('editfieldSize').value;
    const fieldImageInput = document.getElementById('editfieldImage').files[0];

    const updateData = {
        fieldCode,
        fieldName,
        fieldLocation,
        fieldSize,
    };

    if (fieldImageInput) {
        const reader = new FileReader();
        reader.onload = () => {
            updateData.fieldImage = reader.result.split(',')[1]; 
            sendUpdateRequest(updateData);
        };
        reader.readAsDataURL(fieldImageInput);
    } else {
        const currentImageSrc = document.getElementById('editImagePreview').src;
        updateData.fieldImage = currentImageSrc.split(',')[1]; 
        sendUpdateRequest(updateData);
    }
});


function sendUpdateRequest(updateData) {
    $.ajax({
        url: `http://localhost:8080/api/v1/fields/${updateData.fieldCode}`,
        method: "PUT",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(updateData),
    })
        .done(function (response) {
            console.log("Field updated successfully:", response);
            getAllFields();
            editFieldModal.classList.add('hidden');
            editFieldForm.reset();
        })
        .fail(function (error) {
            console.error("Error updating field:", error);
            alert("Failed to update field. Please try again.");
        });
}



function viewCropDetails(button, code) {
    const cropDetailsContent = document.getElementById('cropDetailsContent');
    cropDetailsContent.innerHTML = '';

    $.ajax({
        url: `http://localhost:8080/api/v1/crops/field/${code}`, 
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
    })
    .done(function (response) {
        response.forEach(crop => {
            const cropDetail = document.createElement('p');
            cropDetail.className = 'text-gray-700';
            cropDetail.innerHTML = `<strong>Crop Name:</strong> ${crop.commonName}`;
            cropDetailsContent.appendChild(cropDetail);
        });
    })
    .fail(function (error) {
        alert("Failed to get field details. Please try again.");
    });

    document.getElementById('cropDetailModal').classList.remove('hidden');
}


document.getElementById('closecropDetailModal').addEventListener('click', function () {
    document.getElementById('cropDetailModal').classList.add('hidden');
});




function viewStaffDetails() {
    fieldStaffDetailsContent.innerHTML = '';
    const staffItems = staffList.querySelectorAll('span');

    staffItems.forEach(staff => {
        const staffDetail = document.createElement('p');
        staffDetail.className = 'text-gray-700';
        staffDetail.innerHTML = `<strong>Staff Member Name:</strong> ${staff.innerText}`;
        fieldStaffDetailsContent.appendChild(staffDetail);
    });

    document.getElementById('fieldStaffDetailModal').classList.remove('hidden');
}

document.getElementById('closefieldStaffDetailModal').addEventListener('click', function () {
    document.getElementById('fieldStaffDetailModal').classList.add('hidden');
});

function generateFieldId(callback) {
    var request = {
        "url": "http://localhost:8080/api/v1/fields/generateId",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(request).done(function (response) {
        if (callback) {
            callback(response);
        }
    }).fail(function (error) {
        console.error("Error fetching field ID:", error);
    });
}

function getAllFields() {
    $.ajax({
        url: "http://localhost:8080/api/v1/fields",
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .done(function (fields) {
            fieldTableBody.innerHTML = '';

            fields.forEach((field) => {
                const row = document.createElement('tr');
                row.classList.add('border-b');
                row.innerHTML = `
                    <td class="p-4 flex items-center space-x-4">
                        <img src="data:image/jpeg;base64,${field.fieldImage}" alt="${field.fieldCode}" class="w-12 h-12 rounded-lg">
                        <span>${field.fieldCode}</span>
                    </td>
                    <td class="p-4 text-center">${field.fieldName}</td>
                    <td class="p-4 text-center">${field.fieldLocation}</td>
                    <td class="p-4 text-center">${field.fieldSize}</td>
                    <td class="p-4 text-center"><button class="bg-green-200 py-1 px-2 rounded cropDetail">Crops</button></td>
                    <td class="p-4 text-center"><button class="bg-red-200 py-1 px-2 rounded fieldStaffDetail">Staff</button></td>
                    <td class="p-4 text-gray-500 space-x-3">
                        <button class="text-blue-500 px-1 edit-btn"><i class="fa-solid fa-pen"></i></button>
                        <button class="text-red-500 border-2 border-red-400 rounded-full px-1 delete-btn"><i class="fa-solid fa-times"></i></button>
                    </td>
                `;

                // Append the row to the table body
                fieldTableBody.appendChild(row);

                // Add event listeners for buttons
                row.querySelector('.edit-btn').addEventListener('click', function () {
                    editField(this, field.fieldCode);
                });

                row.querySelector('.delete-btn').addEventListener('click', function () {
                    deleteField(this, field.fieldCode);
                });

                row.querySelector('.cropDetail').addEventListener('click', function () {
                    viewCropDetails(this, field.fieldCode);
                });

                row.querySelector('.fieldStaffDetail').addEventListener('click', function () {
                    viewStaffDetails(this, field.fieldCode);
                });
            });
        })
        .fail(function (error) {
            console.error("Error fetching fields:", error);
            alert("Failed to fetch fields. Please try again later.");
        });
}