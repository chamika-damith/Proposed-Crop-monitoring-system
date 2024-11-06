const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');

loginTab.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginTab.classList.add('border-b-2', 'border-blue-500', 'text-blue-500');
    loginTab.classList.remove('text-gray-500');
    signupTab.classList.remove('border-b-2', 'border-blue-500', 'text-blue-500');
    signupTab.classList.add('text-gray-500');
});

signupTab.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signupTab.classList.add('border-b-2', 'border-blue-500', 'text-blue-500');
    signupTab.classList.remove('text-gray-500');
    loginTab.classList.remove('border-b-2', 'border-blue-500', 'text-blue-500');
    loginTab.classList.add('text-gray-500');
});


loginForm.addEventListener('submit', (event)=>{
    event.preventDefault();

    const loginEmail=document.getElementById('loginEmail').value;
    const loginPassword=document.getElementById('loginPassword').value;

    if (loginEmail === "chamikadamith9@gmail.com" && loginPassword === "2002") {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password. Please try again.");
    }
});