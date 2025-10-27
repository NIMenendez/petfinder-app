import '../../style.css'
import '../../components/header.ts'
import '../../components/saved-popup.ts'


export function initEditProfile(params: { goTo: (arg: string) => void }): HTMLElement {
  const editProfilePage = document.createElement("div");

  editProfilePage.innerHTML = `
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
      <h2 class="subtitle">Mis datos personales</h2>
    </div>
    <div class="profile-data-container">
      <div class="form-group">
        <form>
          <label for="name">Nombre:</label>
          <input type="text" id="name" name="name" required>
          <button type="submit" class="save-changes-button">Guardar cambios</button>
        </form>
      </div>
    </div>
  </main>
`

  const form = editProfilePage.querySelector("form");
  
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const formDataAPI = new FormData(event.target as HTMLFormElement);
    console.log("Usando FormData API:");
    for (let [key, value] of formDataAPI.entries()) {
      console.log(`${key}: ${value}`);
    }
    showSavedPopup();
  });

  function showSavedPopup() {
    const savedPopup = document.createElement("saved-popup");
    
    // Escuchar evento personalizado del popup
    savedPopup.addEventListener("popup-closed", () => {
      params.goTo("/profile");
    });
    
    document.body.appendChild(savedPopup);
  }

  return editProfilePage;
}
