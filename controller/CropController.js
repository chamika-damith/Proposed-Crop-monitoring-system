const openCropModalButton = document.getElementById('openCropModal');
const closeCropModalButton = document.getElementById('closeCropModal');
const addCropModal = document.getElementById('addCropModal');


// Function to open add crop modal
openCropModalButton.addEventListener('click', () => {
    addCropModal.classList.remove('hidden');
});

// Function to close add crop modal
closeCropModalButton.addEventListener('click', () => {
    addCropModal.classList.add('hidden');
});