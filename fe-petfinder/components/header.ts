class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    //implementar que el link a /home redirija correctamente dependiendo del Auth
    this.innerHTML = `

   <style>
    .menu-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .menu-profile-footer {
      position: absolute;
      bottom: 5rem;
    }
    .menu-profile-footer a {
      color: var(--primary-button-color);
      text-decoration: none;
      font-weight: bold;
      font-size: 1rem;
    }
    .menu-profile-footer p {
      color: white;
    }
   </style>

    <header class="main-header">
      <a href="/home"><img src="/61788357c19ead6c7eecf06b3b1ac2dfd5631d44 (1).png" alt="Petfinder Logo" width="60" /></a>
      <button class="menu-button"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg></button>
    </header>
    <div class="menu-container">
      <div class="close-button"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg></div>
      <nav class="menu-items">
        <a class="menu-item" href="/profile">Mis datos</a>
        <a class="menu-item" href="/my-reports">Mis mascotas reportadas</a>
        <a class="menu-item" href="/report-lost-pet">Reportar Mascota</a>
        <div class="menu-profile-footer">
          <p class="user-email" data-email=""></p>
          <a class="loginout-link" href="#"></a>
        </div>
      </nav>
    </div>
    `;

  const userEmailElement = this.querySelector('.user-email') as HTMLElement;
  
  userEmailElement.dataset.email = sessionStorage.getItem("userEmail") || "";

  const loginoutLink = this.querySelector('.loginout-link') as HTMLAnchorElement;
  
  const emailFromDataset = userEmailElement?.dataset.email;
  
  if (emailFromDataset) {
    loginoutLink.textContent = "Cerrar sesión";
    loginoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userId");
      window.location.href = "/home";
    });
  } else {
    loginoutLink.textContent = "Iniciar sesión";
    loginoutLink.href = "/login";
  };

  if (emailFromDataset) {
    userEmailElement.textContent = emailFromDataset;
  } else {
    userEmailElement.textContent = "Sesión no iniciada";
  }
    
    const menuButton = this.querySelector(".menu-button");
    const closeButton = this.querySelector(".close-button");
    
    closeButton?.addEventListener("click", () => {
      const menu = this.querySelector(".menu-container") as HTMLElement;
      menu.style.display = ""
    })

    menuButton?.addEventListener("click", () => {
      const menu = this.querySelector(".menu-container") as HTMLElement;
      menu.style.display = "inherit";  
    });
  }
}

customElements.define("app-header", Header);

export default Header;