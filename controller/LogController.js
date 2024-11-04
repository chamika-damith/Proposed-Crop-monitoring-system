const openLogModalBtn = document.getElementById('openLogModal');
const closeLogModelBtn = document.getElementById('closeLogModel');
const addLogModal = document.getElementById('addLogModal');
const addLogForm = document.getElementById('addLogForm');
const logTableBody = document.getElementById('logTableBody');


// Open modal when the add log button is clicked
openLogModalBtn.addEventListener('click', () => {
    addLogModal.classList.remove('hidden');
});

// Close modal when the cancel button is clicked
closeLogModelBtn.addEventListener('click', () => {
    addLogModal.classList.add('hidden');
});