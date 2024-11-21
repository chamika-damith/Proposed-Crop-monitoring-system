const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const signOut = document.getElementById("signOut");

loginTab.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  loginTab.classList.add("border-b-2", "border-blue-500", "text-blue-500");
  loginTab.classList.remove("text-gray-500");
  signupTab.classList.remove("border-b-2", "border-blue-500", "text-blue-500");
  signupTab.classList.add("text-gray-500");
});


signupTab.addEventListener("click", () => {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  signupTab.classList.add("border-b-2", "border-blue-500", "text-blue-500");
  signupTab.classList.remove("text-gray-500");
  loginTab.classList.remove("border-b-2", "border-blue-500", "text-blue-500");
  loginTab.classList.add("text-gray-500");
});

// Signup Form Submission
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const signupEmail = document.getElementById("signupEmail").value;
  const signupPassword = document.getElementById("signupPassword").value;
  const role = document.getElementById("role").value.toUpperCase();

  const data = {
    email: signupEmail,
    password: signupPassword,
    userRole: role,
  };

  if (!signupEmail || !signupPassword) {
    alert("Please fill in all fields.");
    return;
  }

  $.ajax({
    url: "http://localhost:8080/api/v1/users/signin",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
  })
    .done((response) => {
      console.log("User added successfully:", response);
      alert("Signup successful! Please log in.");
      toggleTab(loginTab, signupTab, loginForm, signupForm);
    })
    .fail((error) => {
      console.error("Error adding user:", error);
      alert(
        error.responseJSON?.message || "Failed to add user. Please try again."
      );
    });
});

// Login Form Submission
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;



  if (!loginEmail || !loginPassword) {
    alert("Please enter both email and password.");
    return;
  }

  $.ajax({
    url: `http://localhost:8080/api/v1/users/${loginEmail}`,
    method: "GET",
    contentType: "application/json",
  })
    .done((response) => {
      console.log("User logged in successfully:", response);
      if (response !=null) {
        window.location.href = "Dashboard.html";
      } else {
        alert("Invalid email or password. Please try again.");
      }
    })
    .fail((error) => {
      console.error("Error logging in:", error);
      alert(
        error.responseJSON?.message || "Failed to log in. Please try again."
      );
    });
});


function toggleTab(activeTab, inactiveTab, showForm, hideForm) {
  showForm.classList.remove("hidden");
  hideForm.classList.add("hidden");

  activeTab.classList.add("border-b-2", "border-blue-500", "text-blue-500");
  activeTab.classList.remove("text-gray-500");

  inactiveTab.classList.remove("border-b-2", "border-blue-500", "text-blue-500");
  inactiveTab.classList.add("text-gray-500");
}


signOut.addEventListener("click", ()=>{
  window.location.href = "index.html";
});