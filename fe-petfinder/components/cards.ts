import './report-form.ts'
import { reverseGeocode } from '../utils/geocoding'

class PetCard extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.renderInitial();
    this.updateLocation();
  }

  renderInitial() {
    // Obtener datos del dataset
    const name = this.dataset.name || 'Mascota desconocida';
    const imageUrl = this.dataset.imageurl || '/placeholder.png';

    // Renderizar rápidamente sin esperar geocoding
    this.innerHTML = `
      <article class="pet-card">
          <img src="${imageUrl}" alt="Mascota perdida">
          <div class="pet-info">
            <div class="name-location">
              <h3 class="pet-name" data-name="">${name}</h3>
              <small class="pet-lastlocation" data-lastlocation="">Cargando ubicación...</small>
            </div>
            <button class="contact-button">Reportar
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye-exclamation"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M15.03 17.478a8.797 8.797 0 0 1 -3.03 .522c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6a20.48 20.48 0 0 1 -.258 .419" /><path d="M19 16v3" /><path d="M19 22v .01" /></svg>
            </button>
          </div>
        </article>
    `;
    
    // Añadir event listener al botón de reportar
    const reportButton = this.querySelector('.contact-button');
    reportButton?.addEventListener('click', () => {
      this.showReportForm();
    });
  }

  async updateLocation() {
    const lat = parseFloat(this.dataset.lat || '0');
    const lng = parseFloat(this.dataset.lng || '0');
    
    let location = 'Ubicación desconocida';
    try {
      if (lat !== 0 && lng !== 0) {
        const geoLocation = await reverseGeocode(lat, lng);
        location = geoLocation || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        console.log('Ubicación obtenida:', location);
      }
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      location = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    }
    
    // Actualizar solo la ubicación
    const locationElement = this.querySelector('.pet-lastlocation');
    if (locationElement) {
      locationElement.textContent = location;
    }
  }
  
  showReportForm() {
    const petName = this.querySelector('.pet-name')?.textContent || '';

    const petId = this.getAttribute('id') || '';
    
    // Remover formulario existente si lo hay
    const existingForm = document.querySelector('report-form');
    if (existingForm) {
      existingForm.remove();
    }
    
    // Crear y mostrar el formulario
    const reportForm = document.createElement('report-form');
    reportForm.setAttribute('pet-name', petName);
    reportForm.setAttribute('pet-id', petId);
    document.body.appendChild(reportForm);

    if (reportForm) {
      sessionStorage.setItem('reporting-pet-id', petId);
    }
  }
}

customElements.define('pet-card', PetCard);

export default PetCard;
