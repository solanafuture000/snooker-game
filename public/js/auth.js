const BASE_URL = "http://localhost:3000/api/auth";

async function register() {
  const username = document.getElementById("username").value;
  const email    = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const wallet   = document.getElementById("wallet").value;

  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, walletAddress: wallet })
  });

  const data = await response.json();
  if (response.ok) {
    alert("✅ Registered! Now login.");
    window.location.href = "index.html";
  } else {
    alert("❌ " + data.message);
  }
}


async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    alert("✅ Login successful");
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("username", data.user.username);
    window.location.href = "dashboard.html";
  } else {
    alert("❌ " + data.message);
  }
}

