const openLogModalBtn = document.getElementById('openLogModal');
const closeLogModelBtn = document.getElementById('closeLogModel');
const addLogModal = document.getElementById('addLogModal');
const addLogForm = document.getElementById('addLogForm');
const logTableBody = document.getElementById('logTableBody');

const openLogEditModalBtn = document.getElementById('openLogEditModal');
const closeEditLogModalBtn = document.getElementById('closeEditLogModal');
const editLogForm = document.getElementById('editLogForm');
const editLogModal = document.getElementById('editLogModal');

let currentRow;


// Open modal when the add log button is clicked
openLogModalBtn.addEventListener('click', () => {
    addLogModal.classList.remove('hidden');
});

// Close modal when the cancel button is clicked
closeLogModelBtn.addEventListener('click', () => {
    addLogModal.classList.add('hidden');
});

addLogForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const logCode = document.getElementById('logCode').value;
    const logDate = document.getElementById('logDate').value;
    const observation = document.getElementById('observation').value;
    const observedImage = document.getElementById('observedImage').files[0];
    const relevantFields = document.getElementById('relevantFields').value;
    const relevantCrops = document.getElementById('relevantCrops').value;
    const staffMember = document.getElementById('staffMember').value;

    const row = document.createElement('tr');
    row.classList.add('border-b');
    row.innerHTML = `
        <td class="p-4 text-center">${logCode}</td>
        <td class="p-4 text-center">${logDate}</td>
        <td class="p-4 text-center">${observation}</td>
        <td class="p-4 text-center flex justify-center">
            <img src="${URL.createObjectURL(observedImage)}" alt="Observation Image" class="w-12 h-12 object-cover">
        </td>
        <td class="p-4 text-center">${relevantFields}</td>
        <td class="p-4 text-center">${relevantCrops}</td>
        <td class="p-4 text-center">${staffMember}</td>
        <td class="p-4 text-center space-x-3">
            <button class="text-blue-500 px-1 editLogBtn" id="openLogEditModal">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="text-red-500 border-2 border-red-400 rounded-full px-1 delete-log-btn">
                <i class="fa-solid fa-times"></i>
            </button>
        </td>
    `;

    logTableBody.appendChild(row);
    addLogModal.classList.add('hidden');
    addLogForm.reset();

    row.querySelector('.editLogBtn').addEventListener('click', function () {
        editLog(this);
    });

    row.querySelector('.delete-log-btn').addEventListener('click', function () {
        deleteLog(this);
    });
});

// Function to edit log data
function editLog(button) {
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
editLogForm.addEventListener('submit', (event) => {
    event.preventDefault();

    currentRow.children[0].innerText = document.getElementById('editLogCode').value;
    currentRow.children[1].innerText = document.getElementById('editLogDate').value;
    currentRow.children[2].innerText = document.getElementById('editObservation').value;
    currentRow.children[4].innerText = document.getElementById('editRelevantFields').value;
    currentRow.children[5].innerText = document.getElementById('editRelevantCrops').value;
    currentRow.children[6].innerText = document.getElementById('editStaffMember').value;

    const newImageFile = document.getElementById('editObservedImage').files[0];

    if (newImageFile) {
        const newImageURL = URL.createObjectURL(newImageFile);
        currentRow.children[3].querySelector('img').src = newImageURL;
    }

    closeEditLogModalBtn.click();
});


// Function to delete log
function deleteLog(button) {
    const row = button.closest('tr');
    const confirmation = confirm('Are you sure you want to delete this log?');
    
    if (confirmation) {
        row.remove();
    }
}