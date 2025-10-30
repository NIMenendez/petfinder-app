import '../../style.css'
import '../../components/header.ts'
import '../../components/saved-popup.ts'
import { API_BASE_URL } from '../../utils/api-url.ts'

export function initEditPassword(params: { goTo: (arg: string) => void }): HTMLElement {
  const editPasswordPage = document.createElement("div");

  editPasswordPage.innerHTML = `
  <style>
    main {
      min-height: calc(100vh - 120px);
      padding: 1rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    
    .main-subtitle {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .main-subtitle h2 {
      font-size: 1.75rem;
      word-wrap: break-word;
      hyphens: auto;
      line-height: 1.2;
    }
    
    .profile-data-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      max-width: 400px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      flex: 1;
      justify-content: space-between;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    label {
      display: block; 
      color: black;
      font-weight: bold;
      text-align: left;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    input {
      display: block;
      background-color: #ffffff;
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      color: black;
      font-size: 1.2rem;
      box-sizing: border-box;
      margin-bottom: 1rem;
    }
    
    input:focus, textarea:focus {
      outline: none;
      border-color: #646cff;
    }
    
    .save-changes-button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      width: 100%;
      margin-top: auto;
    }
    
  </style>
  <app-header></app-header>
  <main>
    <div class="main-subtitle">
      <h2 class="subtitle">Modificar Contraseña</h2>
    </div>
    <div class="profile-data-container">
      <div class="form-group">
        <form>
          <label for="current-password">Contraseña actual:</label>
          <input type="password" id="current-password" name="current-password" required>
          <label for="new-password">Nueva contraseña:</label>
          <input type="password" id="new-password" name="new-password" required>
          <button type="submit" class="save-changes-button">Guardar cambios</button>
        </form>
      </div>
    </div>
  </main>
`

  const form = editPasswordPage.querySelector("form");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      alert('No se encontró el ID de usuario. Por favor, inicia sesión nuevamente.');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/password/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("authToken") || ""}`
        },
        body: JSON.stringify({
          oldPassword: data['current-password'],
          newPassword: data['new-password'],
        }),
      });

      const resdata = await response.json();

      if (response.ok) {
        showSavedPopup();
      } else {
        // Error del servidor
        if (response.status === 403) {
          alert(resdata.error || 'No tienes permiso para realizar esta acción.');
        } else {
          alert(resdata.error || 'Error al guardar los cambios. Intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error('Error en actualizar los datos:', error);
      alert('Error de conexión. Verifica tu internet e intenta nuevamente.');
    }
  });

  function showSavedPopup() {
    const savedPopup = document.createElement("saved-popup");
    
    // Escuchar evento personalizado del popup
    savedPopup.addEventListener("popup-closed", () => {
      params.goTo("/profile");
    });
    
    document.body.appendChild(savedPopup);
  }

  return editPasswordPage;
}
