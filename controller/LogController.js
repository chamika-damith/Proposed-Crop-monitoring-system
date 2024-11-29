const openLogModalBtn = document.getElementById('openLogModal');
const closeLogModelBtn = document.getElementById('closeLogModel');
const addLogModal = document.getElementById('addLogModal');
const addLogForm = document.getElementById('addLogForm');
const logTableBody = document.getElementById('logTableBody');
const relevantFields = document.getElementById('relevantFields');
const relevantCrops = document.getElementById('relevantCrops');
const logStaffMember = document.getElementById('logStaffMember');

const openLogEditModalBtn = document.getElementById('openLogEditModal');
const closeEditLogModalBtn = document.getElementById('closeEditLogModal');
const editLogForm = document.getElementById('editLogForm');
const editLogModal = document.getElementById('editLogModal');
const editRelevantFields = document.getElementById('editRelevantFields');
const editRelevantCrops = document.getElementById('editRelevantCrops');
const editStaffMember = document.getElementById('editStaffMember');

let currentRow;

document.addEventListener('DOMContentLoaded', () => {
    getAllLog();
});
// Open modal when the add log button is clicked
openLogModalBtn.addEventListener('click', () => {
    generateLogId(function (response) {
        document.getElementById("logCode").value = response;
    });
    loadFieldOptions();
    loadCropOptions();
    loadStaffOptions();
    addLogModal.classList.remove('hidden');
});

// Close modal when the cancel button is clicked
closeLogModelBtn.addEventListener('click', () => {
    addLogModal.classList.add('hidden');
});

addLogForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    const logCode = document.getElementById('logCode').value;
    const logDate = document.getElementById('logDate').value;
    const observation = document.getElementById('observation').value;
    const observedImage = document.getElementById('observedImage').files[0];
    const relevantFields = document.getElementById('relevantFields').value;
    const relevantCrops = document.getElementById('relevantCrops').value;
    const staffMember = document.getElementById('logStaffMember').value;


    let newFieldDTO = null;
    let newCropDTO = null;
    let newStaffDTO = null;

    const fetchData = async (url) => {
        try {
            const response = await $.ajax({
                url,
                method: "GET",
                timeout: 0,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                }
            });
            return response;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            alert(`Failed to load data from . Please try again later.`);
            return null;
        }
    };

    if (relevantFields != null && relevantFields !== '') {
        newFieldDTO = await fetchData(`http://localhost:8080/api/v1/fields/${relevantFields}`);
    }

    if (relevantCrops != null && relevantCrops !== '') {
        newCropDTO = await fetchData(`http://localhost:8080/api/v1/crops/${relevantCrops}`);
    }

    if (staffMember != null && staffMember !== '') {
        newStaffDTO = await fetchData(`http://localhost:8080/api/v1/staff/${staffMember}`);
    }

    const readImageAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    let base64Image = null;
    if (observedImage) {
        try {
            base64Image = await readImageAsBase64(observedImage);
        } catch (error) {
            console.error("Error reading image file:", error);
            alert("Failed to process image. Please try again.");
            return;
        }
    }

    const requestData = {
        logCode: logCode,
        date: logDate,
        observation: observation,
        observationImage: base64Image,
        fieldDTO: newFieldDTO,
        staffDTO: newStaffDTO,
        cropDTO: newCropDTO
    };

    try {
        const response = await $.ajax({
            url: "http://localhost:8080/api/v1/log",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token,
            },
            data: JSON.stringify(requestData),
        });

        if (response.statusCode === 201) {
            console.log("Log saved successfully:", response);
            alert("Success to save log. ");
            addLogModal.classList.add('hidden');
            addLogForm.reset();
            getAllLog();
        } else {
            console.error("Error saving log:", response.statusMessage);
            alert("Failed to save log -> " + response.statusMessage);
        }
    } catch (error) {
        console.error("Error saving log:", error);
        alert("Failed to save log. Please try again.");
    }
});



function getAllLog() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/log",
        method: "GET",
        timeout: 0,
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
        .done(function (log) {
            logTableBody.innerHTML = "";

            log.forEach((field) => {
                console.log(field)
                const row = document.createElement("tr");
                row.classList.add("border-b");
                row.innerHTML = `
                    <td class="py-2 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.logCode}</td>
                    <td class="py-2 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.date}</td>
                    <td class="py-2 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.observation}</td>
                    <td class="py-2 flex justify-center items-center space-x-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                        <img src="data:image/jpeg;base64,${field.observationImage}" alt="Observation Image" class="w-12 h-12 rounded-lg border border-gray-200 shadow-sm">
                    </td>
                    <td class="py-2 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.fieldDTO ? field.fieldDTO.fieldCode : 'N/A'}</td>
                    <td class="py-2 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.cropDTO ? field.cropDTO.cropCode    : 'N/A'}</td>
                    <td class="py-2 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.staffDTO ? field.staffDTO.id : 'N/A'}</td>
                    <td class="py-2 text-center bg-gray-50 hover:bg-gray-100 text-gray-500 space-x-3">
                        <button class="text-blue-500 hover:text-blue-600 px-2 py-1 rounded transition-all duration-200 ease-in-out editLogBtn" id="openLogEditModal">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="text-red-500 hover:text-red-600 border-2 border-red-400 hover:border-red-500 rounded-full px-2 py-1 transition-all duration-200 ease-in-out delete-log-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </td>
                `;

                logTableBody.appendChild(row);

                row.querySelector(".editLogBtn").addEventListener("click", function () {
                    editLog(this);
                });

                row.querySelector(".delete-log-btn").addEventListener("click", function () {
                    deleteLog(this);
                });
            });
        })
        .fail(function (error) {
            console.error("Error fetching log:", error);
            alert("Failed to fetch log. Please try again later.");
        });
}

// Function to edit log data
function editLog(button) {
    loadEditFieldOptions();
    loadEditCropOptions();
    loadEditStaffOptions();
    currentRow = button.closest('tr');
    const cells = currentRow.children;

    document.getElementById('editLogCode').value = cells[0].innerText;
    document.getElementById('editLogDate').value = cells[1].innerText;
    document.getElementById('editObservation').value = cells[2].innerText;
    document.getElementById('editRelevantFields').value = cells[4].innerText;
    document.getElementById('editRelevantCrops').value = cells[5].innerText;
    document.getElementById('editStaffMember').value = cells[6].innerText;

    const imageElement = cells[3].querySelector('img');
    const imageSrc = imageElement.src;
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = imageSrc;
    imagePreview.alt = "Preview Image";

    editLogModal.classList.remove('hidden');
}

// Attach event listener to edit log buttons
document.querySelectorAll('.editLogBtn').forEach(button => {
    button.addEventListener('click', function () {
        editLog(this);
    });
});

// Function to close the edit log modal
closeEditLogModalBtn.addEventListener('click', () => {
    editLogModal.classList.add('hidden');
});

// Handle form submission for editing log data
editLogForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    const logCode = document.getElementById('editLogCode').value.trim();
    const logDate = document.getElementById('editLogDate').value.trim();
    const observation = document.getElementById('editObservation').value.trim();
    const observedImage = document.getElementById('editObservedImage').files[0];
    const relevantFields = document.getElementById('editRelevantFields').value;
    const relevantCrops = document.getElementById('editRelevantCrops').value;
    const staffMember = document.getElementById('editStaffMember').value;

    // Field validation
    if (!logCode || !logDate || !observation) {
        alert("Please fill in all required fields: Log Code, Date, and Observation.");
        return;
    }

    const fetchData = async (url) => {
        try {
            return await $.ajax({
                url,
                method: "GET",
                timeout: 0,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token,
                },
            });
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            alert(`Failed to load data from ${url}. Please try again later.`);
            return null;
        }
    };

    const readImageAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    let base64Image = null;
    if (observedImage) {
        if (!["image/jpeg", "image/png"].includes(observedImage.type)) {
            alert("Please upload a valid image (JPEG or PNG).");
            return;
        }

        if (observedImage.size > 2 * 1024 * 1024) { // 2MB limit
            alert("Image size exceeds 2MB. Please upload a smaller file.");
            return;
        }

        try {
            base64Image = await readImageAsBase64(observedImage);
        } catch (error) {
            console.error("Error reading image file:", error);
            alert("Failed to process the image. Please try again.");
            return;
        }
    }

    const [newFieldDTO, newCropDTO, newStaffDTO] = await Promise.all([
        relevantFields ? fetchData(`http://localhost:8080/api/v1/fields/${relevantFields}`) : null,
        relevantCrops ? fetchData(`http://localhost:8080/api/v1/crops/${relevantCrops}`) : null,
        staffMember ? fetchData(`http://localhost:8080/api/v1/staff/${staffMember}`) : null,
    ]);

    const requestData = {
        logCode,
        date: logDate,
        observation,
        observationImage: base64Image,
        fieldDTO: newFieldDTO,
        staffDTO: newStaffDTO,
        cropDTO: newCropDTO,
    };

    try {
        const response = await $.ajax({
            url: `http://localhost:8080/api/v1/log/${logCode}`,
            method: "PUT",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token,
            },
            data: JSON.stringify(requestData),
        });

        if (response.statusCode >= 200 && response.statusCode < 300) {
            alert("Log updated successfully.");
            closeEditLogModalBtn.click();
            editLogForm.reset();
            getAllLog(); 
        } else {
            console.error("Error saving log:", response.statusMessage);
            alert("Failed to save log. " + (response.statusMessage || "Please try again later."));
        }
    } catch (error) {
        console.error("Error saving log:", error);
        alert("Failed to save log. Please try again later.");
    }
});



// Function to delete log
function deleteLog(button) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this log?');

    if (confirmation) {
        row.remove();
    }
}

function generateLogId(callback) {

    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    var request = {
        url: "http://localhost:8080/api/v1/log/generateId",
        method: "GET",
        timeout: 0,
        headers: {
            'Authorization': 'Bearer ' + token
        },
    };

    $.ajax(request)
        .done(function (response) {
            if (callback) {
                callback(response);
            }
        })
        .fail(function (error) {
            console.error("Error fetching log ID:", error);
        });
}

relevantFields.addEventListener("change", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    const selectedFieldCode = relevantFields.value;

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
                document.getElementById('logFieldName').textContent = field.fieldName;
                relevantCrops.disabled = true;
                logStaffMember.disabled = true;
            },
            error: function (error) {
                console.error("Error loading field:", error);
                alert("Failed to load field details. Please try again later.");
            }
        });
    } else {
        document.getElementById('logFieldName').textContent = '';
        relevantCrops.disabled = false;
        logStaffMember.disabled = false;
    }
});

logStaffMember.addEventListener("change", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    const selectedFieldCode = logStaffMember.value;

    if (selectedFieldCode) {
        $.ajax({
            url: `http://localhost:8080/api/v1/staff/${selectedFieldCode}`,
            method: "GET",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            success: function (field) {
                document.getElementById('logStaffName').textContent = field.firstName;
                relevantCrops.disabled = true;
                relevantFields.disabled = true;
            },
            error: function (error) {
                console.error("Error loading field:", error);
                alert("Failed to load field details. Please try again later.");
            }
        });
    } else {
        document.getElementById('logStaffName').textContent = '';
        relevantCrops.disabled = false;
        relevantFields.disabled = false;
    }
});

editRelevantFields.addEventListener("change", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    const selectedFieldCode = editRelevantFields.value;

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
                document.getElementById('editlogFieldName').textContent = field.fieldName;
                editRelevantCrops.disabled = true;
                editStaffMember.disabled = true;
            },
            error: function (error) {
                console.error("Error loading field:", error);
                alert("Failed to load field details. Please try again later.");
            }
        });
    } else {
        document.getElementById('logFieldName').textContent = '';
        editRelevantCrops.disabled = false;
        editStaffMember.disabled = false;
    }
});

editRelevantCrops.addEventListener("change", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    const selectedFieldCode = editRelevantCrops.value;

    if (selectedFieldCode) {
        $.ajax({
            url: `http://localhost:8080/api/v1/crops/${selectedFieldCode}`,
            method: "GET",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            success: function (crop) {
                document.getElementById('editlogCropName').textContent = crop.commonName;
                editRelevantFields.disabled = true;
                editStaffMember.disabled = true;
            },
            error: function (error) {
                console.error("Error loading crop:", error);
                alert("Failed to load crop details. Please try again later.");
            }
        });
    } else {
        document.getElementById('editlogCropName').textContent = '';
        editRelevantFields.disabled = false;
        editStaffMember.disabled = false;
    }
});

editStaffMember.addEventListener("change", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }
    const selectedFieldCode = editStaffMember.value;

    if (selectedFieldCode) {
        $.ajax({
            url: `http://localhost:8080/api/v1/staff/${selectedFieldCode}`,
            method: "GET",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            success: function (staff) {
                document.getElementById('editlogStaffName').textContent = staff.firstName;
                editRelevantFields.disabled = true;
                editRelevantCrops.disabled = true;
            },
            error: function (error) {
                console.error("Error loading crop:", error);
                alert("Failed to load crop details. Please try again later.");
            }
        });
    } else {
        document.getElementById('editlogStaffName').textContent = '';
        editRelevantFields.disabled = false;
        editRelevantCrops.disabled = false;
    }
});

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
            const logFieldDropdown = document.getElementById('relevantFields');

            logFieldDropdown.innerHTML = '<option value="">Select Field</option>';

            fields.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode;
                option.textContent = field.fieldCode;
                logFieldDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
            alert("Failed to load fields. Please try again later.");
        }
    });
}

function loadCropOptions() {
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
        success: function (crop) {
            const logCropDropdown = document.getElementById('relevantCrops');

            logCropDropdown.innerHTML = '<option value="">Select Crop</option>';

            crop.forEach(crop => {
                const option = document.createElement('option');
                option.value = crop.cropCode;
                option.textContent = crop.cropCode;
                logCropDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading crop:", error);
            alert("Failed to load crop. Please try again later.");
        }
    });
}

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
        success: function (staffs) {
            const logStaffDropdown = document.getElementById('logStaffMember');

            logStaffDropdown.innerHTML = '<option value="">Select staff</option>';

            staffs.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.id;
                option.textContent = staff.id;
                logStaffDropdown.appendChild(option);
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
        success: function (staffs) {
            const logStaffDropdown = document.getElementById('editStaffMember');

            logStaffDropdown.innerHTML = '<option value="">Select staff</option>';

            staffs.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.id;
                option.textContent = staff.id;
                logStaffDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading staff:", error);
            alert("Failed to load staff. Please try again later.");
        }
    });
}

function loadEditCropOptions() {
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
        success: function (crop) {
            const logCropDropdown = document.getElementById('editRelevantCrops');

            logCropDropdown.innerHTML = '<option value="">Select Crop</option>';

            crop.forEach(crop => {
                const option = document.createElement('option');
                option.value = crop.cropCode;
                option.textContent = crop.cropCode;
                logCropDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading crop:", error);
            alert("Failed to load crop. Please try again later.");
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
            const logFieldDropdown = document.getElementById('editRelevantFields');

            logFieldDropdown.innerHTML = '<option value="">Select Field</option>';

            fields.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode;
                option.textContent = field.fieldCode;
                logFieldDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
            alert("Failed to load fields. Please try again later.");
        }
    });
}
