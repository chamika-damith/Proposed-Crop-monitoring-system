/*----------spa------------*/
$('#field').hide();
$('#crop-section').hide();
$('#staff-section').hide();


$('#fieldBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').show();
    $('#crop-section').hide();
    $('#staff-section').hide();

});

$('#dashboardBtn').on('click',()=>{
    $('#dashboard').show();
    $('#field').hide();
    $('#crop-section').hide();
    $('#staff-section').hide();


});

$('#cropBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').hide();
    $('#crop-section').show();
    $('#staff-section').hide();


});

$('#staffBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').hide();
    $('#crop-section').hide();
    $('#staff-section').show();

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
   
