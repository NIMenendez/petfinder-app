import '../../style.css'
import '../../components/header.ts'


export function initProfile(params: { goTo: (arg: string) => void }): HTMLElement {
  const profilePage = document.createElement("div");

  profilePage.innerHTML = `
  <style>
    .profile-data-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      max-width: 400px;
      margin: 0 auto;
      height: 60vh;
      justify-content: center;
    }
    
    .user-email{
      color: black;
    }
  </style>
  <app-header></app-header>
  <main>
    <div class="main-subtitle">
      <h2 class="subtitle">Mis datos</h2>
    </div>
    <div class="profile-data-container">
      <button class="edit-profile-button">Modificar tus datos</button>
      <button class="change-password-button">Modificar tu contraseña</button>
    </div>
    <div class="profile-footer">
      <p class="user-email" data-email="soyunemail@test.com"></p>
      <a class="logout-link" href="#">Cerrar sesión</a>
    </div>
  </main>
`
  

  const userEmailElement = profilePage.querySelector('.user-email') as HTMLElement;
  const emailFromDataset = userEmailElement?.dataset.email;

  if (emailFromDataset) {
    userEmailElement.textContent = emailFromDataset;
  } else {
    userEmailElement.textContent = "Sesión no iniciada";
  }

  profilePage.querySelector(".profile-data-container")?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("edit-profile-button")) {
      params.goTo("/edit-profile");
    } else if (target.classList.contains("change-password-button")) {
      params.goTo("/change-password");
    }
  });

  return profilePage;
}
