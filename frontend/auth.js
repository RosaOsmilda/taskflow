// Si ya hay una sesión activa, mandar directo al dashboard
if (localStorage.getItem("taskflow_token")) {
  window.location.href = "dashboard.html";
}

const tabLoginBtn = document.getElementById("tabLoginBtn");
const tabRegisterBtn = document.getElementById("tabRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

// Cambiar entre pestañas de Login / Registro
tabLoginBtn.addEventListener("click", () => {
  tabLoginBtn.classList.add("active");
  tabRegisterBtn.classList.remove("active");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

tabRegisterBtn.addEventListener("click", () => {
  tabRegisterBtn.classList.add("active");
  tabLoginBtn.classList.remove("active");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = "form-message " + type;
}

// ---------- LOGIN ----------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  showMessage(loginMessage, "Iniciando sesión...", "");

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage(loginMessage, data.error || "Error al iniciar sesión", "error");
      return;
    }

    localStorage.setItem("taskflow_token", data.token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));
    window.location.href = "dashboard.html";
  } catch (err) {
    showMessage(loginMessage, "No se pudo conectar con el servidor. ¿Está corriendo el backend?", "error");
  }
});

// ---------- REGISTRO ----------
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  showMessage(registerMessage, "Creando cuenta...", "");

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage(registerMessage, data.error || "Error al registrar usuario", "error");
      return;
    }

    showMessage(registerMessage, "Cuenta creada. Ahora inicia sesión.", "success");
    registerForm.reset();
    setTimeout(() => tabLoginBtn.click(), 1200);
  } catch (err) {
    showMessage(registerMessage, "No se pudo conectar con el servidor. ¿Está corriendo el backend?", "error");
  }
});
