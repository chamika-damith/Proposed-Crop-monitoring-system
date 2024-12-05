const openCropModalButton = document.getElementById('openCropModal');
const closeCropModalButton = document.getElementById('closeCropModal');
const addCropModal = document.getElementById('addCropModal');
const addCropForm = document.getElementById('addCropForm');
const cropTableBody = document.getElementById('cropTableBody');
const cropField = document.getElementById('cropField');
const cropEditField = document.getElementById('cropEditField');

let currentRow;

document.addEventListener('DOMContentLoaded', () => {
    $("#cropSearchId").on("keyup", function () {
        const searchValue = $(this).val().toLowerCase();

        $("#cropTableBody tr").each(function () {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.includes(searchValue));
        });
    });
    getAllCrops();
});

// Define constants for edit crop elements
const openCropEditModalBtn = document.getElementById('openCropEditModal');
const closeCropEditModalBtn = document.getElementById('closeCropEditModal');
const editCropForm = document.getElementById('editCropForm');
const editCropModal = document.getElementById('editCropModal');

// Open modal when the add crop button is clicked
openCropModalButton.addEventListener('click', () => {
    generateCropId(function (response) {
        document.getElementById('cropCode').value = response;
    });
    loadFieldOptions();
    addCropModal.classList.remove('hidden');
});

// Close modal when the cancel button is clicked
closeCropModalButton.addEventListener('click', () => {
    addCropModal.classList.add('hidden');
});

// Add new crop to the table
addCropForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cropCode = document.getElementById('cropCode').value;
    const cropName = document.getElementById('cropName').value;
    const cropScientificName = document.getElementById('cropSceintificName').value;
    const cropCategory = document.getElementById('cropCategory').value;
    const cropSeason = document.getElementById('cropSeason').value;
    const cropField = document.getElementById('cropField').value;
    const cropImage = document.getElementById('cropImage').files[0];

    if (!cropCode || !cropName || !cropScientificName || !cropCategory || !cropSeason || !cropField || !cropImage) {
        alert("Please fill out all fields and select an image.");
        return;
    }

    if (isAddCropValidate()) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result.split(',')[1];

            // Fetch field information
            fetchField(cropField, (field) => {
                const requestData = {
                    cropCode,
                    commonName: cropName,
                    scientificName: cropScientificName,
                    category: cropCategory,
                    season: cropSeason,
                    fieldDTO: field,
                    image: base64Image,
                };

                saveCrop(requestData);
            });
        };

        reader.readAsDataURL(cropImage);
    }
});

// Fetch Field Data
function fetchField(fieldId, callback) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: `http://localhost:8080/api/v1/fields/${fieldId}`,
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        success: callback,
        error: (error) => {
            console.error("Error loading field:", error);
            alert("Failed to load field data. Please try again.");
        },
    });
}

//Save Crop
function saveCrop(data) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: "http://localhost:8080/api/v1/crops",
        method: "POST",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(data),
    })
        .done((response) => {
            if (response.statusCode == 201) {
                console.log("Crop saved successfully:", response);
                getAllCrops();
                addCropModal.classList.add('hidden');
                addCropForm.reset();
            } else {
                console.error("Error saving crop:", response.statusMessage);
                alert("Failed to save crop -> " + response.statusMessage);
            }
        })
        .fail((error) => {
            if (error.status === 403) {
                alert("Access Denied: You do not have permission to perform this action.");
            } else {
                console.error("Error saving crop:", error);
                alert("Failed to save crop. Please try again.");
            }

        });
}




// Function to edit crop
function editCrop(button) {
    loadEditFieldOptions();
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    // Populate form fields with data from the row
    document.getElementById('cropEditCode').value = cells[0].querySelector('span').innerText;
    document.getElementById('cropEditName').value = cells[1].innerText;
    document.getElementById('cropEditSceintificName').value = cells[2].innerText;
    document.getElementById('cropEditCategory').value = cells[3].innerText;
    document.getElementById('cropEditSeason').value = cells[4].innerText;
    document.getElementById('cropEditField').value = cells[5].innerText;

    const currentImage = cells[0].querySelector('img').src;
    document.getElementById('editCropImagePreview').src = currentImage;

    // Show the edit modal
    editCropModal.classList.remove('hidden');
}

document.getElementById('editCropImage').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('editCropImagePreview').src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});


// Attach event listener to edit buttons
document.querySelectorAll('.editbtn').forEach(button => {
    button.addEventListener('click', function () {
        editCrop(this);
    });
});

// Function to close edit modal
closeCropEditModalBtn.addEventListener('click', () => {
    editCropModal.classList.add('hidden');
});


editCropForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cropCode = document.getElementById('cropEditCode').value;
    const cropName = document.getElementById('cropEditName').value;
    const cropScientificName = document.getElementById('cropEditSceintificName').value;
    const cropCategory = document.getElementById('cropEditCategory').value;
    const cropSeason = document.getElementById('cropEditSeason').value;
    const cropField = document.getElementById('cropEditField').value;
    const cropImageInput = document.getElementById('editCropImage').files[0];

    if (isEditCropValidate()) {
        const updateData = {
            cropCode,
            commonName: cropName,
            scientificName: cropScientificName,
            category: cropCategory,
            season: cropSeason,
        };

        if (cropImageInput) {
            const reader = new FileReader();
            reader.onload = () => {
                updateData.image = reader.result.split(',')[1];

                fetchField(cropField, (field) => {
                    updateData.fieldDTO = field;
                    cropUpdate(updateData);
                });
            };
            reader.readAsDataURL(cropImageInput);
        } else {
            const currentImageSrc = document.getElementById('editCropImagePreview').src;
            updateData.image = currentImageSrc.split(',')[1];

            fetchField(cropField, (field) => {
                updateData.fieldDTO = field;
                cropUpdate(updateData);
            });
        }
    }
});

// Helper Function: Update Crop
function cropUpdate(data) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: `http://localhost:8080/api/v1/crops/${data.cropCode}`,
        method: "PUT",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(data),
    })
        .done((response) => {
            if (response.statusCode == 200) {
                console.log("Crop updated successfully:", response);
                getAllCrops();
                editCropModal.classList.add('hidden');
                editCropForm.reset();
            } else {
                console.error("Error updating crop:", response.statusMessage);
                alert("Failed to update crop -> " + response.statusMessage);
            }

        })
        .fail((error) => {
            if (error.status === 403) {
                alert("Access Denied: You do not have permission to perform this action.");
            } else {
                console.error("Error updating crop:", error);
                alert("Failed to update crop. Please try again.");
            }

        });
}


// Function to delete field
function deleteCrop(button, cropCode) {
    console.log(cropCode)
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this crop?');

    if (confirmation) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found. Please log in.");
            return;
        }
        $.ajax({
            url: `http://localhost:8080/api/v1/crops/${cropCode}`,
            method: 'DELETE',
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                console.log("Crop deleted successfully:", response);
                getAllCrops();
            },
            error: function (error) {
                if (error.status === 403) {
                    alert("Access Denied: You do not have permission to perform this action.");
                } else {

                    console.error("Error deleting crop:", error);
                    alert("Failed to delete crop. Please try again.");
                }

            }
        });
    }
}

function generateCropId(callback) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    var request = {
        "url": "http://localhost:8080/api/v1/crops/generateId",
        "method": "GET",
        "timeout": 0,
        headers: {
            'Authorization': 'Bearer ' + token
        },
    };

    $.ajax(request).done(function (response) {
        if (callback) {
            callback(response);
        }
    }).fail(function (error) {
        console.error("Error fetching crop ID:", error);
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
            const cropFieldDropdown = document.getElementById('cropField');

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
            const cropEditFieldDropdown = document.getElementById('cropEditField');

            cropEditFieldDropdown.innerHTML = '<option value="">Select Field</option>';

            fields.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode;
                option.textContent = field.fieldCode;
                cropEditFieldDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
            alert("Failed to load fields. Please try again later.");
        }
    });
}


cropField.addEventListener("change", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    const selectedFieldCode = cropField.value;

    if (selectedFieldCode) {
        $.ajax({
            url: `http://localhost:8080/api/v1/fields/${selectedFieldCode}`,
            method: "GET",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            success: function (field) {
                document.getElementById('cropFieldName').textContent = field.fieldName;
            },
            error: function (error) {
                console.error("Error loading field:", error);
                alert("Failed to load field details. Please try again later.");
            }
        });
    } else {
        document.getElementById('cropFieldName').textContent = '';
    } 
});

function getAllCrops() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    $.ajax({
        url: "http://localhost:8080/api/v1/crops",
        method: "GET",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
    })
        .done(function (crops) {
            cropTableBody.innerHTML = '';

            crops.forEach((crop) => {
                const row = document.createElement('tr');
                row.classList.add('border-b');
                row.innerHTML = `
                <td class="p-4 flex items-center space-x-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                    <img src="data:image/jpeg;base64,${crop.image}" alt="${crop.cropCode}" class="w-12 h-12 rounded-lg border border-gray-200 shadow-sm">
                    <span class"font-semibold text-gray-800>${crop.cropCode}</span>
                </td>
                <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${crop.commonName}</td>
                <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${crop.scientificName}</td>
                <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${crop.category}</td>
                <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${crop.season}</td>
                <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${crop.fieldDTO.fieldCode}</td>
                <td class="p-4 text-center bg-gray-50 hover:bg-gray-100 text-gray-500 space-x-3">
                    <button class="text-blue-500 hover:text-blue-600 px-2 py-1 rounded transition-all duration-200 ease-in-out edit-btn"><i class="fa-solid fa-pen"></i></button>
                    <button class="text-red-500 hover:text-red-600 border-2 border-red-400 hover:border-red-500 rounded-full px-2 py-1 transition-all duration-200 ease-in-out  delete-btn"><i class="fa-solid fa-times"></i></button>
                </td>
            `;

                cropTableBody.appendChild(row);

                row.querySelector('.edit-btn').addEventListener('click', function () {
                    editCrop(this, crop.cropCode);
                });

                row.querySelector('.delete-btn').addEventListener('click', function () {
                    deleteCrop(this, crop.cropCode);
                });
            });
        })
        .fail(function (error) {
            console.error("Error fetching crops:", error);
            alert("Failed to fetch crops. Please try again later.");
        });
}

cropEditField.addEventListener("change", () => {
    const selectedFieldCode = cropEditField.value;

    if (selectedFieldCode) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found. Please log in.");
            return;
        }
        $.ajax({
            url: `http://localhost:8080/api/v1/fields/${selectedFieldCode}`,
            method: "GET",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            success: function (field) {
                document.getElementById('editcCropFieldName').textContent = field.fieldName;
            },
            error: function (error) {
                console.error("Error loading field:", error);
                alert("Failed to load field details. Please try again later.");
            }
        });
    } else {
        document.getElementById('editcCropFieldName').textContent = '';
    }
});

function isAddCropValidate() {
    var isValid = true;

    // Validate Crop Name
    if (!/^.{3,50}$/.test($('#cropName').val())) {
        isValid = false;
        $('#cropName').css('border', '2px solid red');
        $('.errorMessageName').show();
    } else {
        $('#cropName').css('border', '1px solid #ccc');
        $('.errorMessageName').hide();
    }

    // Validate Crop Scientific Name
    if (!/^.{5,100}$/.test($('#cropSceintificName').val())) {
        isValid = false;
        $('#cropSceintificName').css('border', '2px solid red');
        $('.errorMessageScientificName').show();
    } else {
        $('#cropSceintificName').css('border', '1px solid #ccc');
        $('.errorMessageScientificName').hide();
    }

    // Validate Category Selection
    if ($('#cropCategory').val() === "") {
        isValid = false;
        $('#cropCategory').css('border', '2px solid red');
        $('.errorMessageCategory').show();
    } else {
        $('#cropCategory').css('border', '1px solid #ccc');
        $('.errorMessageCategory').hide();
    }

    // Validate Field Selection
    if ($('#cropField').val() === "") {
        isValid = false;
        $('#cropField').css('border', '2px solid red');
        $('.errorMessageField').show();
    } else {
        $('#cropField').css('border', '1px solid #ccc');
        $('.errorMessageField').hide();
    }

    // Validate Season Selection
    if ($('#cropSeason').val() === "") {
        isValid = false;
        $('#cropSeason').css('border', '2px solid red');
        $('.errorMessageSeason').show();
    } else {
        $('#cropSeason').css('border', '1px solid #ccc');
        $('.errorMessageSeason').hide();
    }

    // Alert the user if there are validation errors
    if (!isValid) {
        alert('Please correct the highlighted fields before submitting.');
    }

    return isValid;
}

function isEditCropValidate() {
    var isValid = true;

    // Validate Crop Name
    if (!/^.{3,50}$/.test($('#cropEditName').val())) {
        isValid = false;
        $('#cropEditName').css('border', '2px solid red');
        $('.errorMessageEditCropName').show();
    } else {
        $('#cropEditName').css('border', '1px solid #ccc');
        $('.errorMessageEditCropName').hide();
    }

    // Validate Crop Scientific Name
    if (!/^.{5,100}$/.test($('#cropEditSceintificName').val())) {
        isValid = false;
        $('#cropEditSceintificName').css('border', '2px solid red');
        $('.errorMessageEditCropScientificName').show();
    } else {
        $('#cropEditSceintificName').css('border', '1px solid #ccc');
        $('.errorMessageEditCropScientificName').hide();
    }

    // Alert the user if there are validation errors
    if (!isValid) {
        alert('Please correct the highlighted fields before submitting.');
    }

    return isValid;
}