import '../../style.css'
import '../../components/header.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function initLogin(params: { goTo: (arg: string) => void }): HTMLElement {
  const loginPage = document.createElement("div");

  loginPage.innerHTML = `
  <app-header></app-header>
  <main>
    <div class="login-main">
      <div class="login-container">
        <h2 class="login-title">Iniciar Sesión</h2>
        <p class="login-subtitle">Accede a tu cuenta para encontrar mascotas perdidas</p>
        
        <form class="login-form">
          <div class="input-group">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" required>
            <span class="error-message" id="email-error"></span>
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña" required>
            <span class="error-message" id="password-error"></span>
          </div>

          <button type="submit" class="login-button">
            <span class="button-text">Iniciar Sesión</span>
            <span class="loading-spinner" style="display: none;">Iniciando sesión...</span>
          </button>
        </form>

        <div class="signup-link">
          <p>¿No tienes una cuenta? <a href="#" class="link-to-signup">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  </main>
  
  <style>
    .login-main {
      max-width: 500px;
      margin: 7rem auto;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-container {
      width: 100%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 40px 30px;
    }

    .login-title {
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }

    .login-subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 1rem;
    }

    .login-form {
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
      border-color: var(--green-button-color, #4CAF50);
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

    .login-button {
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

    .login-button:hover {
      background-color: #455da0ff
      transform: translateY(-1px);
    }

    .login-button:active {
      transform: translateY(0);
    }

    .login-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      display: none;
    }

    .login-button.loading .button-text {
      display: none;
    }

    .login-button.loading .loading-spinner {
      display: inline;
    }

    .signup-link {
      text-align: center;
      margin-top: 20px;
    }

    .signup-link p {
      color: #666;
      font-size: 0.95rem;
    }

    .link-to-signup {
      color: var(--primary-button-color);
      text-decoration: none;
      font-weight: bold;
    }

    .link-to-signup:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .login-main {
        padding: 15px;
      }

      .login-container {
        padding: 30px 20px;
      }

      .login-title {
        font-size: 1.75rem;
      }
    }
  </style>
  `;

  // Referencias a elementos del DOM
  const form = loginPage.querySelector('.login-form') as HTMLFormElement;
  const emailInput = loginPage.querySelector('#email') as HTMLInputElement;
  const passwordInput = loginPage.querySelector('#password') as HTMLInputElement;
  const submitButton = loginPage.querySelector('.login-button') as HTMLButtonElement;
  const linkToSignup = loginPage.querySelector('.link-to-signup') as HTMLAnchorElement;

  // Funciones de validación
  function clearErrors() {
    const errorElements = loginPage.querySelectorAll('.error-message');
    const inputElements = loginPage.querySelectorAll('input');
    
    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => el.classList.remove('error'));
  }

  function showError(inputId: string, message: string) {
    const input = loginPage.querySelector(`#${inputId}`) as HTMLInputElement;
    const errorElement = loginPage.querySelector(`#${inputId}-error`) as HTMLElement;
    
    input.classList.add('error');
    errorElement.textContent = message;
  }

  function validateForm(): boolean {
    clearErrors();
    let isValid = true;

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
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          password: passwordInput.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso - guardar token
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('userEmail', emailInput.value.trim());
        // Opcional: mostrar mensaje de éxito
        alert('¡Inicio de sesión exitoso!');
        
        // Redirigir a la página principal o perfil
        params.goTo('/home/pets');
      } else {
        // Error del servidor
        if (response.status === 401) {
          showError('password', 'Email o contraseña incorrectos');
        } else {
          alert(data.error || 'Error al iniciar sesión. Intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error de conexión. Verifica tu internet e intenta nuevamente.');
    } finally {
      // Quitar loading
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  });

  // Validación en tiempo real
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

  // Limpiar errores cuando el usuario empiece a escribir
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
      clearErrors();
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('error')) {
      clearErrors();
    }
  });

  // Link para ir al signup
  linkToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    params.goTo('/signup');
  });

  return loginPage;
}
