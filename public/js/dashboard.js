const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (!token || !userId) {
  alert("Session expired. Please login again.");
  window.location.href = "login.html";
}

async function fetchUserData() {
  const response = await fetch(`http://localhost:3000/api/user/${userId}`);
  const data = await response.json();

  if (response.ok) {
    document.getElementById("username").textContent = data.username;
    document.getElementById("chips").textContent = data.chips + " 🪙";
    document.getElementById("wallet").textContent = data.walletAddress;
  } else {
    alert("Error loading dashboard. Try again.");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

fetchUserData();
