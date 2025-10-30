import { reverseGeocode } from '../utils/geocoding'

class EditPetCard extends HTMLElement {
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
      <article class="edit-pet-card">
          <img src="${imageUrl}" alt="Mascota perdida">
          <div class="pet-info">
            <div class="name-location">
              <h3 class="pet-name" data-name="">${name}</h3>
              <small class="pet-lastlocation" data-lastlocation="">Cargando ubicación...</small>
            </div>
            <button class="edit-button">Editar
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5" /><path d="M18 9l-1.5 -1.5" /></svg>
            </button>
          </div>
        </article>
    `;
  }

  async updateLocation() {
    const lat = parseFloat(this.dataset.lat || '0');
    const lng = parseFloat(this.dataset.lng || '0');
    
    let location = 'Ubicación desconocida';
    try {
      if (lat !== 0 && lng !== 0) {
        const geoLocation = await reverseGeocode(lat, lng);
        location = geoLocation || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
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
}

customElements.define('edit-pet-card', EditPetCard);

export default EditPetCard;
