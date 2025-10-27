
class EditPetCard extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }

  render() {
    //insertar aqui la data dinamicamente
    this.innerHTML = `
      <article class="edit-pet-card">
          <img src="/public/eukanuba-market-image-puppy-beagle.jpg" alt="Mascota perdida">
          <div class="pet-info">
            <div class="name-location">
              <h3 class="pet-name" data-name="">${this.dataset.name}</h3>
              <small class="pet-lastlocation" data-lastlocation="">${this.dataset.lastlocation}</small>
            </div>
            <button class="edit-button">Editar
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8
            </button>
          </div>
        </article>
    `;
  }
}

customElements.define('edit-pet-card', EditPetCard);

export default EditPetCard;
