/*----------spa------------*/
$('#field').hide();
$('#crop-section').hide();
$('#staff-section').hide();
$('#vehicle-section').hide();
$('#equipment-section').hide();
$('#log-section').hide();


$('#fieldBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').show();
    $('#crop-section').hide();
    $('#staff-section').hide();
    $('#vehicle-section').hide();
    $('#equipment-section').hide();
    $('#log-section').hide();
    $('#chart-section').hide();
});

$('#dashboardBtn').on('click',()=>{
    $('#dashboard').show();
    $('#field').hide();
    $('#crop-section').hide();
    $('#staff-section').hide();
    $('#vehicle-section').hide();
    $('#equipment-section').hide();
    $('#log-section').hide();
    $('#chart-section').show();

});

$('#cropBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').hide();
    $('#crop-section').show();
    $('#staff-section').hide();
    $('#vehicle-section').hide();
    $('#equipment-section').hide();
    $('#log-section').hide();
    $('#chart-section').hide();
});

$('#staffBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').hide();
    $('#crop-section').hide();
    $('#staff-section').show();
    $('#vehicle-section').hide();
    $('#equipment-section').hide();
    $('#log-section').hide();
    $('#chart-section').hide();
});

$('#vehicleBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').hide();
    $('#crop-section').hide();
    $('#staff-section').hide();
    $('#vehicle-section').show();
    $('#equipment-section').hide();
    $('#log-section').hide();
    $('#chart-section').hide();
});

$('#equipmentBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').hide();
    $('#crop-section').hide();
    $('#staff-section').hide();
    $('#vehicle-section').hide();
    $('#equipment-section').show();
    $('#log-section').hide();
    $('#chart-section').hide();
});

$('#logBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').hide();
    $('#crop-section').hide();
    $('#staff-section').hide();
    $('#vehicle-section').hide();
    $('#equipment-section').hide();
    $('#log-section').show();
    $('#chart-section').hide();
});

// Toggle Mobile Menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("hidden");
}

// Toggle Profile Menu
function toggleProfileMenu() {
    const profileMenu = document.getElementById("user-menu");
    profileMenu.classList.toggle("hidden");
}
   
// Pie Chart Data
  let cropData = [
    { label: "Rice", color: "#4F46E5", value: 25 },
    { label: "Wheat", color: "#D946EF", value: 20 },
    { label: "Corn", color: "#A78BFA", value: 15 },
    { label: "Soybean", color: "#FB7185", value: 10 },
];

// Generate colors array for chart
const cropColors = cropData.map(crop => crop.color);

// Initialize the pie chart
const ctx = document.getElementById("pieChart").getContext("2d");
let pieChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: cropData.map(crop => crop.label),
        datasets: [{
            data: cropData.map(crop => crop.value),
            backgroundColor: cropColors,
        }]
    },
    options: {
        responsive: true,
    }
});

// Bar Chart Data
const barCtx = document.getElementById('barChart').getContext('2d');

// Sample log data for demonstration
const logData = {
    labels: ['Healthy Growth', 'Pest Detected', 'Watering Needed', 'Fertilizer Applied', 'Harvest Scheduled'],
    datasets: [{
        label: 'Log Observations',
        data: [10, 5, 8, 12, 6], // Replace these with the actual counts of each log type
        backgroundColor: '#4f46e5',
    }]
};

new Chart(barCtx, {
    type: 'bar',
    data: logData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#374151' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Observations',
                    color: '#6b7280'
                }
            }
        }
    }
});

