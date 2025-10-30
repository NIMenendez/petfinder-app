class ReportForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }

  render() {
    const petName = this.getAttribute("pet-name") || "esta mascota";
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
        
        .report-form {
          background: var(--secondary-color);
          padding: 2rem;
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
          margin: 1rem
        }
        
        .close-button {
          position: relative;
          top: -8px;
          left: 95%;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .close-button:hover {
          color: #000;
        }
        
        h2 {
          color: #ffffffff;
          margin-bottom: 1.5rem;
          font-size: 2rem
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #ffffffff;
          font-weight: bold;
        }
        
        input, textarea {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 2px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          box-sizing: border-box;
          color: #ffffff
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #646cff;
        }
        
        textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        button[type="submit"] {
          background-color: var(--green-button-color);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
        }
        
        button[type="submit"]:hover {
          opacity: 0.9;
        }
      </style>
      
      <form class="report-form">
        <button type="button" class="close-button">&times;</button>
        <h2>Reportar info de ${petName}</h2>
        
        <label for="reporter-name">Nombre:</label>
        <input type="text" id="reporter-name" name="reporter-name" required />
        
        <label for="reporter-contact">Teléfono:</label>
        <input type="tel" id="reporter-contact" name="reporter-contact" required />

        <label for="report-location">¿Dónde lo viste?:</label>
        <textarea id="report-location" name="report-location" placeholder="Describe la ubicación donde viste a la mascota..." required></textarea>

        <button type="submit">Enviar reporte</button>
      </form>
    `;
    
    // Event listeners
    const closeButton = this.shadowRoot!.querySelector('.close-button');
    const form = this.shadowRoot!.querySelector('form');
    
    closeButton?.addEventListener('click', () => {
      this.remove();
    });
    
    // Cerrar al hacer click en el fondo (overlay)
    this.addEventListener('click', (e) => {
      // Solo cerrar si el click fue en el host element, no en el formulario
      if (e.target === this && e.composedPath()[0] === this) {
        this.remove();
      }
    });
    
    // Prevenir que los clicks dentro del formulario cierren el modal
    form?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const reportData = {
        petId: sessionStorage.getItem('reporting-pet-id'),
        reporterName: formData.get('reporter-name'),
        reporterPhone: formData.get('reporter-contact'),
        reportLocation: formData.get('report-location'),
      };

      const response = await fetch(`http://localhost:3000/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({
            petId: reportData.petId,
            reporterName: reportData.reporterName,
            reporterPhone: reportData.reporterPhone,
            description: reportData.reportLocation
          })
      })

      if (!response.ok) {
        alert('Error al enviar el reporte. Intenta nuevamente.');
        return;
      }

      alert('Formulario enviado para: ' + petName);
      this.remove();
    });
  }
}

customElements.define("report-form", ReportForm);

export default ReportForm;