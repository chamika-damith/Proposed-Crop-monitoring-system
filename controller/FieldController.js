// Define constants for modal and form elements
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const addFieldForm = document.getElementById("addFieldForm");
const fieldTableBody = document.getElementById("fieldTableBody");
const addFieldModal = document.getElementById("addFieldModal");

// Define constants for edit modal elements
const openEditModalBtn = document.getElementById("openEditModal");
const closeEditModalBtn = document.getElementById("closeEditModal");
const editFieldForm = document.getElementById("editFieldForm");
const editFieldModal = document.getElementById("editModal");

const addeditStaffBtn = document.getElementById("addeditStaffBtn");
const editfieldStaff = document.getElementById("editfieldStaff");
const editstaffList = document.getElementById("editstaffList");


document.addEventListener("DOMContentLoaded", () => {
   $("#fieldSearchId").on("keyup", function () {
        const searchValue = $(this).val().toLowerCase();

        $("#fieldTableBody tr").each(function () {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.includes(searchValue));
        });
    });
  getAllFields();
});

let currentRow;


// Function to open add field modal
openModalButton.addEventListener("click", () => {
  generateFieldId(function (response) {
    document.getElementById("fieldCode").value = response;
  });
  addFieldModal.classList.remove("hidden");
});

// Function to close add field modal
closeModalButton.addEventListener("click", () => {
  addFieldModal.classList.add("hidden");
});

// Function to add field
addFieldForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fieldCode = document.getElementById("fieldCode").value;
  const fieldName = document.getElementById("fieldName").value;
  const fieldLocation = document.getElementById("fieldLocation").value;
  const fieldSize = document.getElementById("fieldSize").value;
  const fieldImage = document.getElementById("fieldImage").files[0];
  const fieldImage2 = document.getElementById("fieldImage2").files[0];

  if (!fieldCode || !fieldName || !fieldLocation || !fieldSize || !fieldImage || !fieldImage2) {
    alert("Please fill out all fields and select both images.");
    return;
  }

  if (isAddFieldValidate()) {
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onloadend = () => {
      const base64Image1 = reader1.result.split(",")[0];
      reader2.onloadend = () => {
        const base64Image2 = reader2.result.split(",")[1];

        const requestData = {
          fieldCode: fieldCode,
          fieldName: fieldName,
          fieldLocation: fieldLocation,
          fieldSize: fieldSize,
          fieldImage: base64Image1,
          fieldImage2: base64Image2,
        };

        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        $.ajax({
          url: "http://localhost:8080/api/v1/fields",
          method: "POST",
          timeout: 0,
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token,
          },
          data: JSON.stringify(requestData),
        })
          .done(function (response) {
            if (response.statusCode === 201) {
              console.log("Field saved successfully:", response);

              getAllFields();
              addFieldModal.classList.add("hidden");
              addFieldForm.reset();
            } else {
              console.error("Error saving field:", response.statusMessage);
              alert("Failed to save field -> " + response.statusMessage);
            }
          })
          .fail(function (error) {
            if (error.status === 403) {
              alert("Access Denied: You do not have permission to perform this action.");
            } else {
              console.error("Error saving field:", error);
              alert("Failed to save field. Please try again.");
            }
          });
      };

      reader2.readAsDataURL(fieldImage2);
    };

    reader1.readAsDataURL(fieldImage);
  }
});


// Function to edit field
function editField(button) {
  currentRow = button.closest("tr");
  const cells = currentRow.children;

  document.getElementById("editfieldCode").value =
    cells[0].querySelector("span").innerText;
  document.getElementById("editfieldName").value = cells[1].innerText;
  document.getElementById("editfieldLocation").value = cells[2].innerText;
  document.getElementById("editfieldSize").value = cells[3].innerText;


  const images = cells[0].querySelectorAll("img");

  if (images.length > 0) {
    document.getElementById("editImagePreview").src = images[0].src;
  } else {
    console.error("First image not found in cells[0].");
  }

  if (images.length > 1) {
    document.getElementById("editImagePreview2").src = images[1].src;
  } else {
    console.error("Second image not found in cells[0].");
  }


  editFieldModal.classList.remove("hidden");
}

document.getElementById("editfieldImage").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("editImagePreview").src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("editfieldImage2").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("editImagePreview2").src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Attach event listener to edit buttons
document.querySelectorAll(".edit-btn").forEach((button) => {
  button.addEventListener("click", function () {
    editField(this);
  });
});

// Function to delete field
function deleteField(button, fieldCode) {
  const row = button.closest("tr");
  const confirmation = confirm("Are you sure you want to delete this field?");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  if (confirmation) {
    $.ajax({
      url: `http://localhost:8080/api/v1/fields/${fieldCode}`,
      method: "DELETE",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
      },

      success: function (response) {
        console.log("Field deleted successfully:", response);
        getAllFields();
      },
      error: function (error) {
        if (error.status === 403) {
          alert("Access Denied: You do not have permission to perform this action.");
        } else {
          console.error("Error deleting field:", error);
          alert("Failed to delete field. Please try again.");
        }
     
      },
    });
  }
}

// Function to close edit modal
closeEditModalBtn.addEventListener("click", () => {
  editFieldModal.classList.add("hidden");
});

// Handle form submission for editing
editFieldForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fieldCode = document.getElementById("editfieldCode").value;
  const fieldName = document.getElementById("editfieldName").value;
  const fieldLocation = document.getElementById("editfieldLocation").value;
  const fieldSize = document.getElementById("editfieldSize").value;
  const fieldImageInput = document.getElementById("editfieldImage").files[0];
  const fieldImageInput2 = document.getElementById("editfieldImage2").files[0];

  if (isUpdateFieldValidate()) {
    const updateData = {
      fieldCode,
      fieldName,
      fieldLocation,
      fieldSize,
    };

    const handleUpdateRequest = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      $.ajax({
        url: `http://localhost:8080/api/v1/fields/${fieldCode}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(updateData),
      })
        .done((response) => {
          console.log("Field updated successfully:", response);
          getAllFields();
          editFieldModal.classList.add("hidden");
          editFieldForm.reset();
        })
        .fail((error) => {
          if (error.status === 403) {
            alert("Access Denied: You do not have permission to perform this action.");
          } else {
            console.error("Error updating field:", error);
            alert("Failed to update field. Please try again.");
          }
        });
    };

    if (fieldImageInput) {
      const reader1 = new FileReader();
      reader1.onloadend = () => {
        updateData.fieldImage = reader1.result.split(",")[1];

        if (fieldImageInput2) {
          const reader2 = new FileReader();
          reader2.onloadend = () => {
            updateData.fieldImage2 = reader2.result.split(",")[1];
            handleUpdateRequest();
          };
          reader2.readAsDataURL(fieldImageInput2);
        } else {
          const currentImageSrc2 = document.getElementById("editImagePreview2").src;
          updateData.fieldImage2 = currentImageSrc2.split(",")[1];
          handleUpdateRequest();
        }
      };
      reader1.readAsDataURL(fieldImageInput);
    } else {
      const currentImageSrc1 = document.getElementById("editImagePreview").src;
      updateData.fieldImage = currentImageSrc1.split(",")[1];

      if (fieldImageInput2) {
        const reader2 = new FileReader();
        reader2.onloadend = () => {
          updateData.fieldImage2 = reader2.result.split(",")[1];
          handleUpdateRequest();
        };
        reader2.readAsDataURL(fieldImageInput2);
      } else {
        const currentImageSrc2 = document.getElementById("editImagePreview2").src;
        updateData.fieldImage2 = currentImageSrc2.split(",")[1];
        handleUpdateRequest();
      }
    }
  }
});


function sendUpdateRequest(updateData) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in.");
    return;
  }
  $.ajax({
    url: `http://localhost:8080/api/v1/fields/${updateData.fieldCode}`,
    method: "PUT",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
    data: JSON.stringify(updateData),
  })
    .done(function (response) {
      if (response.statusCode === 200) {
        console.log("Field updated successfully:", response);
        getAllFields();
        editFieldModal.classList.add("hidden");
        editFieldForm.reset();
      } else {
        console.error("Error updating field:", response.statusMessage);
        alert("Failed to update field -> " + response.statusMessage);
      }

    })
    .fail(function (error) {
      if (error.status === 403) {
        alert("Access Denied: You do not have permission to perform this action.");
      }else{
        console.error("Error updating field:", error);
      alert("Failed to update field. Please try again.");
      }
      
    });
}

function viewCropDetails(button, code) {
  const cropDetailsContent = document.getElementById("cropDetailsContent");
  cropDetailsContent.innerHTML = "";

  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  $.ajax({
    url: `http://localhost:8080/api/v1/crops/field/${code}`,
    method: "GET",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
  })
    .done(function (response) {
      response.forEach((crop) => {
        const cropDetail = document.createElement("p");
        cropDetail.className = "text-gray-700";
        cropDetail.innerHTML = `<strong>Crop Name:</strong> ${crop.commonName}`;
        cropDetailsContent.appendChild(cropDetail);
      });
    })
    .fail(function (error) {
      alert("Failed to get field details. Please try again.");
    });

  document.getElementById("cropDetailModal").classList.remove("hidden");
}

document
  .getElementById("closecropDetailModal")
  .addEventListener("click", function () {
    document.getElementById("cropDetailModal").classList.add("hidden");
  });

function viewStaffDetails(button, code) {
  const fieldStaffDetailsContent = document.getElementById(
    "fieldStaffDetailsContent"
  );
  fieldStaffDetailsContent.innerHTML = "";

  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  $.ajax({
    url: `http://localhost:8080/api/v1/staff/field/${code}`,
    method: "GET",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
  })
    .done(function (response) {
      response.forEach((staff) => {
        const staffDetail = document.createElement("p");
        staffDetail.className = "text-gray-700";
        staffDetail.innerHTML = `<strong>Staff Member Name:</strong> ${staff.firstName}`;
        fieldStaffDetailsContent.appendChild(staffDetail);
      });
    })
    .fail(function (error) {
      alert("Failed to get staff details. Please try again.");
    });

  document.getElementById("fieldStaffDetailModal").classList.remove("hidden");
}

document
  .getElementById("closefieldStaffDetailModal")
  .addEventListener("click", function () {
    document.getElementById("fieldStaffDetailModal").classList.add("hidden");
  });

function generateFieldId(callback) {

  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  var request = {
    url: "http://localhost:8080/api/v1/fields/generateId",
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
      console.error("Error fetching field ID:", error);
    });
}

function getAllFields() {
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
      'Authorization': 'Bearer ' + token
    },
  })
    .done(function (fields) {
      fieldTableBody.innerHTML = "";

      fields.forEach((field) => {
        const row = document.createElement("tr");
        row.classList.add("border-b");
        row.innerHTML = `
            <td class="p-4 flex items-center space-x-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                <img src="data:image/jpeg;base64,${field.fieldImage}" alt="${field.fieldCode}" class="w-12 h-12 rounded-lg border border-gray-200 shadow-sm">
                <img src="data:image/jpeg;base64,${field.fieldImage2}" alt="${field.fieldCode}" class="w-12 h-12 rounded-lg border border-gray-200 shadow-sm">
                <span class="font-semibold text-gray-800">${field.fieldCode}</span>
            </td>
            <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.fieldName}</td>
            <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.fieldLocation}</td>
            <td class="p-4 text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">${field.fieldSize}</td>
            <td class="p-4 text-center bg-gray-50 hover:bg-gray-100">
                <button class="bg-green-200 text-green-800 py-1 px-2 rounded-md shadow hover:bg-green-300 focus:ring focus:ring-green-300 cropDetail">
                    Crops
                </button>
            </td>
            <td class="p-4 text-center bg-gray-50 hover:bg-gray-100">
                <button class="bg-red-200 text-red-800 py-1 px-2 rounded-md shadow hover:bg-red-300 focus:ring focus:ring-red-300 fieldStaffDetail">
                    Staff
                </button>
            </td>
            <td class="p-4 text-center bg-gray-50 hover:bg-gray-100 text-gray-500 space-x-3">
                <button class="text-blue-500 hover:text-blue-600 px-2 py-1 rounded transition-all duration-200 ease-in-out edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="text-red-500 hover:text-red-600 border-2 border-red-400 hover:border-red-500 rounded-full px-2 py-1 transition-all duration-200 ease-in-out delete-btn">
                    <i class="fa-solid fa-times"></i>
                </button>
            </td>
          `;


        // Append the row to the table body
        fieldTableBody.appendChild(row);

        // Add event listeners for buttons
        row.querySelector(".edit-btn").addEventListener("click", function () {
          editField(this, field.fieldCode);
        });

        row.querySelector(".delete-btn").addEventListener("click", function () {
          deleteField(this, field.fieldCode);
        });

        row.querySelector(".cropDetail").addEventListener("click", function () {
          viewCropDetails(this, field.fieldCode);
        });

        row
          .querySelector(".fieldStaffDetail")
          .addEventListener("click", function () {
            viewStaffDetails(this, field.fieldCode);
          });
      });
    })
    .fail(function (error) {
      console.error("Error fetching fields:", error);
      alert("Failed to fetch fields. Please try again later.");
    });
}


function isAddFieldValidate() {
  var isValid = true;

  // Validate Field Name
  if (!/^\s*\S.{3,18}\S\s*$/.test($('#fieldName').val())) {
    isValid = false;
    $('#fieldName').css('border', '2px solid red');
    $('.errorMessageFieldName').show();
  } else {
    $('#fieldName').css('border', '1px solid #ccc');
    $('.errorMessageFieldName').hide();
  }

  // Validate Field Location
  if (!/^.{7,}$/.test($('#fieldLocation').val())) {
    isValid = false;
    $('#fieldLocation').css('border', '2px solid red');
    $('.errorMessageFieldAddress').show();
  } else {
    $('#fieldLocation').css('border', '1px solid #ccc');
    $('.errorMessageAddress').hide();
  }

  // Validate Field Size
  if ($('#fieldSize').val() <= 0 || isNaN($('#fieldSize').val())) {
    isValid = false;
    $('#fieldSize').css('border', '2px solid red');
    $('.errorMessageFieldSize').show();
  } else {
    $('#fieldSize').css('border', '1px solid #ccc');
    $('.errorMessageSize').hide();
  }

  // Alert the user if there are validation errors
  if (!isValid) {
    alert('Please correct the highlighted fields before submitting.');
  }

  return isValid;
}


function isUpdateFieldValidate() {
  var isValid = true;

  if (!/^\s*\S.{3,18}\S\s*$/.test($('#editfieldName').val())) {
    isValid = false;
    $('#editfieldName').css('border', '2px solid red');
    $('.errorMessageEditFieldName').show();
  }

  if (!/^.{7,}$/.test($('#editfieldLocation').val())) {
    isValid = false;
    $('#editfieldLocation').css('border', '2px solid red');
    $('.errorMessageEditFieldAddress').show();
  }

  if ($('#editfieldSize').val() <= 0 || isNaN($('#editfieldSize').val())) {
    isValid = false;
    $('#editfieldSize').css('border', '2px solid red');
    $('.errorMessageEditFieldSize').show();
  }

  if (!isValid) {
    alert('Please correct the highlighted fields before submitting.');
    return isValid;
  }

  return isValid;
}
