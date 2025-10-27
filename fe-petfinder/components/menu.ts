class Menu extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .menu {
          background-color: var(--secondary-color);
          border-radius: 10px;
          padding: 1rem;
          display: none;
        }
        .menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .menu li {
          margin: 0.5rem 0;
        }
        .menu a {
          color: white;
          text-decoration: none;
        }
        .menu a:hover {
          text-decoration: underline;
        }
      </style>
      <nav class="menu">
        <ul>
          <li><a href="#home">Inicio</a></li>
          <li><a href="#about">Acerca de</a></li>
          <li><a href="#contact">Contacto</a></li>
        </ul>
      </nav>
    `;
  }
  
}

customElements.define("app-menu", Menu);

export default Menu;
