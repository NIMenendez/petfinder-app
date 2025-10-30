import '../../style.css'
import '../../components/header.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function initSignup(params: { goTo: (arg: string) => void }): HTMLElement {
  const signupPage = document.createElement("div");

  signupPage.innerHTML = `
  <app-header></app-header>
  <main>
    <div class="signup-main">
      <div class="signup-container">
        <h2 class="signup-title">Crear Cuenta</h2>
        <p class="signup-subtitle">Únete a nuestra comunidad para encontrar mascotas perdidas</p>
        
        <form class="signup-form">
          <div class="input-group">
            <label for="name">Nombre completo</label>
            <input type="text" id="name" name="name" placeholder="Ingresa tu nombre completo" required>
            <span class="error-message" id="name-error"></span>
          </div>

          <div class="input-group">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" required>
            <span class="error-message" id="email-error"></span>
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" placeholder="Mínimo 6 caracteres" required>
            <span class="error-message" id="password-error"></span>
          </div>

          <div class="input-group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repite tu contraseña" required>
            <span class="error-message" id="confirm-password-error"></span>
          </div>

          <button type="submit" class="signup-button">
            <span class="button-text">Crear Cuenta</span>
            <span class="loading-spinner" style="display: none;">Creando cuenta...</span>
          </button>
        </form>

        <div class="login-link">
          <p>¿Ya tienes una cuenta? <a href="#" class="link-to-login">Inicia sesión</a></p>
        </div>
      </div>
    </div>
  </main>
  
  <style>
    .signup-main {
      max-width: 500px;
      margin: 1rem auto;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .signup-container {
      width: 100%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 40px 30px;
    }

    .signup-title {
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }

    .signup-subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 1rem;
    }

    .signup-form {
      width: 100%;
    }

    .input-group {
      margin-bottom: 20px;
    }

    .input-group label {
      display: block;
      margin-bottom: 8px;
      text-align: left;
      font-weight: bold;
      font-size: 1rem;
      color: #333;
    }

    .input-group input {
      color: #333;
      background-color: #f9f9f9;
      border: 2px solid #e1e1e1;
      border-radius: 8px;
      padding: 12px 16px;
      width: 100%;
      box-sizing: border-box;
      height: 50px;
      font-size: 1rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .input-group input:focus {
      outline: none;
      border-color: var(--green-button-color);
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }

    .input-group input.error {
      border-color: #e74c3c;
      background-color: #ffeaea;
    }

    .error-message {
      display: block;
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 4px;
      min-height: 20px;
    }

    .signup-button {
      display: block;
      width: 100%;
      padding: 15px 16px;
      background-color: var(--primary-button-color);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: bold;
      text-align: center;
      margin: 30px 0 20px 0;
      transition: background-color 0.3s ease, transform 0.2s ease;
      position: relative;
    }

    .signup-button:hover {
      background-color: #26369150;
      transform: translateY(-1px);
    }

    .signup-button:active {
      transform: translateY(0);
    }

    .signup-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      display: none;
    }

    .signup-button.loading .button-text {
      display: none;
    }

    .signup-button.loading .loading-spinner {
      display: inline;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
    }

    .login-link p {
      color: #666;
      font-size: 0.95rem;
    }

    .link-to-login {
      color: var(--primary-button-color, #4CAF50);
      text-decoration: none;
      font-weight: bold;
    }

    .link-to-login:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .signup-main {
        padding: 15px;
      }

      .signup-container {
        padding: 30px 20px;
      }

      .signup-title {
        font-size: 1.75rem;
      }
    }
  </style>
  `;

  // Referencias a elementos del DOM
  const form = signupPage.querySelector('.signup-form') as HTMLFormElement;
  const nameInput = signupPage.querySelector('#name') as HTMLInputElement;
  const emailInput = signupPage.querySelector('#email') as HTMLInputElement;
  const passwordInput = signupPage.querySelector('#password') as HTMLInputElement;
  const confirmPasswordInput = signupPage.querySelector('#confirmPassword') as HTMLInputElement;
  const submitButton = signupPage.querySelector('.signup-button') as HTMLButtonElement;
  const linkToLogin = signupPage.querySelector('.link-to-login') as HTMLAnchorElement;

  // Funciones de validación
  function clearErrors() {
    const errorElements = signupPage.querySelectorAll('.error-message');
    const inputElements = signupPage.querySelectorAll('input');
    
    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => el.classList.remove('error'));
  }

  function showError(inputId: string, message: string) {
    const input = signupPage.querySelector(`#${inputId}`) as HTMLInputElement;
    const errorElement = signupPage.querySelector(`#${inputId}-error`) as HTMLElement;
    
    input.classList.add('error');
    errorElement.textContent = message;
  }

  function validateForm(): boolean {
    clearErrors();
    let isValid = true;

    // Validar nombre
    if (!nameInput.value.trim()) {
      showError('name', 'El nombre es requerido');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      showError('name', 'El nombre debe tener al menos 2 caracteres');
      isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showError('email', 'El correo electrónico es requerido');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
      showError('email', 'Ingresa un correo electrónico válido');
      isValid = false;
    }

    // Validar contraseña
    if (!passwordInput.value) {
      showError('password', 'La contraseña es requerida');
      isValid = false;
    } else if (passwordInput.value.length < 6) {
      showError('password', 'La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (!confirmPasswordInput.value) {
      showError('confirmPassword', 'Debes confirmar tu contraseña');
      isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
      showError('confirmPassword', 'Las contraseñas no coinciden');
      isValid = false;
    }

    return isValid;
  }

  // Manejar envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Mostrar loading
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso
        alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        params.goTo('/login');
      } else {
        // Error del servidor
        if (response.status === 409) {
          showError('email', 'Este correo ya está registrado');
        } else {
          alert(data.error || 'Error al crear la cuenta. Intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error('Error en signup:', error);
      alert('Error de conexión. Verifica tu internet e intenta nuevamente.');
    } finally {
      // Quitar loading
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  });

  // Validación en tiempo real
  nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim() && nameInput.classList.contains('error')) {
      validateForm();
    }
  });

  emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim() && emailInput.classList.contains('error')) {
      validateForm();
    }
  });

  passwordInput.addEventListener('blur', () => {
    if (passwordInput.value && passwordInput.classList.contains('error')) {
      validateForm();
    }
  });

  confirmPasswordInput.addEventListener('blur', () => {
    if (confirmPasswordInput.value && confirmPasswordInput.classList.contains('error')) {
      validateForm();
    }
  });

  // Link para ir al login
  linkToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    params.goTo('/login');
  });

  return signupPage;
}
