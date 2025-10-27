class SavedPopup extends HTMLElement {
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

        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .saved-popup {
          width: 300px;
          height: 400px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          color: black;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: bold;
          justify-content: space-around;
          text-align: center;
          font-size: 1.2rem; 
        }
        button {
          border-radius: 8px;
          border: 1px solid transparent;
          padding: 0.6em 1.2em;
          font-size: 1em;
          font-weight: 500;
          font-family: inherit;
          background-color: var(--primary-button-color);
          cursor: pointer;
          transition: border-color 0.25s;
          width: 100%;
        }
        button:hover {
          border-color: #646cff;
        }
        button:focus,
        button:focus-visible {
          outline: 4px auto -webkit-focus-ring-color;
        }
      </style>
      <div class="saved-popup">
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="#00A884" class="icon icon-tabler icons-tabler-filled icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
        <p>¡Cambios guardados!</p>
        <button class="close-popup-button">Volver a mis datos</button>
      </div>
    `;

    // Añadir event listener al botón dentro del Shadow DOM
    const closeButton = this.shadowRoot!.querySelector(".close-popup-button");
    closeButton?.addEventListener("click", () => {
      // Emitir evento personalizado
      this.dispatchEvent(new CustomEvent("popup-closed", { bubbles: true }));
      // Remover el popup del DOM
      this.remove();
    });
  }

  showPopup() {
    this.render();
  }
}


customElements.define("saved-popup", SavedPopup);