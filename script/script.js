/*----------spa------------*/
$('#field').hide();

$('#fieldBtn').on('click',()=>{
    $('#dashboard').hide();
    $('#field').show();

});

$('#dashboardBtn').on('click',()=>{
    $('#dashboard').show();
    $('#field').hide();
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
   
