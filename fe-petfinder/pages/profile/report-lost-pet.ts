import '../../style.css'
import '../../components/header.ts'
import Dropzone from 'dropzone';
import { forwardGeocode } from '../../utils/geocoding';
import { compressImage } from '../../utils/image-compressor';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';



export function initReportLostPet(params: { goTo: (arg: string) => void }): HTMLElement {
  const reportLostPetPage = document.createElement("div");

  reportLostPetPage.innerHTML = `
  <style>

    .report-lost-pet-main {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    input {
      color: black;
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
      height: 2.5rem;
      font-size: 1rem;
      margin-bottom: 16px;
    }
    .report-lost-pet-main label {
      display: block;
      margin-bottom: 8px;
      text-align: left;
      font-weight: bold;
      font-size: 1.2rem;
      color: black;
    }
    .report-button {
      display: inline-block;
      width: 100%;
      padding: 12px 16px;
      background-color: var(--green-button-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      text-align: center;
      margin-bottom: 1rem;
    }
    .cancel-button {
      display: inline-block;
      width: 100%;
      padding: 12px 16px;
      background-color: var(--red-button-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      text-align: center;
    }
    
    /* Estilos para Dropzone */
    .dropzone {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 0;
      text-align: center;
      cursor: pointer;
      margin-bottom: 16px;
      min-height: 200px;
      max-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9f9f9;
      transition: border-color 0.3s;
      overflow: hidden;
      position: relative;
      z-index: 0;
    }
    
    .dropzone:hover {
      border-color: #999;
    }
    
    .dropzone.dz-drag-hover {
      border-color: var(--green-button-color);
      background-color: #f0fff0;
    }
    
    .dropzone .dz-message {
      font-size: 1rem;
      color: #666;
      padding: 20px;
    }
    
    .dropzone .dz-preview {
      margin: 0 !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 200px;
      position: absolute;
      top: 0;
      left: 0;
    }
    
    .dropzone .dz-preview .dz-image {
      width: 100% !important;
      height: 100% !important;
      border-radius: 8px;
    }
    
    .dropzone .dz-preview .dz-image img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      border-radius: 8px;
    }
    
    /* Ocultar mensaje cuando hay archivo */
    .dropzone.dz-started .dz-message {
      display: none !important;
    }
    
    /* Evitar que se muestre área para más archivos */
    .dropzone.dz-max-files-reached {
      cursor: default !important;
    }
    
    .dropzone.dz-max-files-reached:hover {
      border-color: #ccc !important;
      background-color: #f9f9f9 !important;
    }
    
    .dropzone .dz-preview .dz-remove {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 0, 0, 0.8);
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .confirm-image-button {
      display: none;
      width: 100%;
      padding: 12px 16px;
      background-color: var(--primary-button-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      text-align: center;
      margin-bottom: 16px;
    }
    
    .confirm-image-button.show {
      display: block;
    }
  </style>
  <app-header></app-header>
  <main class="report-lost-pet-main">
    <h2 class="subtitle">Reportar mascota perdida</h2>
    <p style="color: #666">Completa el siguiente formulario para reportar a tu mascota perdida.</p>
    <form class="report-lost-pet-form">
      <div class="pet-name-container">
        <label style="display: block;" for="pet-name">Nombre de la mascota:</label>
        <input type="text" id="pet-name" name="pet-name" required>
      </div>

      <div class="pet-image-container">
        <label style="display: block;" for="pet-image">Foto de la mascota:</label>
        <div class="dropzone">
          <div class="dz-message">
            Arrastra una imagen aquí o haz clic para seleccionar
          </div>
        </div>
        <button type="button" class="confirm-image-button" id="confirm-image-btn">
          ✓ Confirmar imagen
        </button>
      </div>

      <div class="last-seen-location-container">
        <label style="display: block;" for="last-seen-location">Última ubicación conocida:</label>
        <input type="text" id="last-seen-location" name="last-seen-location" required>
      </div>

      <div class="button-container">
        <button type="submit" class="report-button">Reportar</button>
        <button type="button" class="cancel-button">Cancelar</button>
      </div>
    </form>
  </main>
`

  // Inicializar Dropzone
  const dropzoneElement = reportLostPetPage.querySelector('.dropzone') as HTMLElement;
  const confirmButton = reportLostPetPage.querySelector('#confirm-image-btn') as HTMLButtonElement;
  
  // Variable para almacenar el dataURL de la imagen
  let imageDataURL: string | null = null;
  
  const myDropzone = new Dropzone(dropzoneElement, {
    url: "/upload", // URL temporal, se configurará más tarde
    autoProcessQueue: false, // No subir automáticamente
    acceptedFiles: "image/*", // Solo imágenes
    maxFiles: 1, // Solo una imagen
    addRemoveLinks: true, // Mostrar enlace para eliminar
    dictDefaultMessage: "Arrastra una imagen aquí o haz clic para seleccionar",
    dictRemoveFile: "×", // Símbolo para eliminar
    dictMaxFilesExceeded: "Solo se permite una imagen",
    previewTemplate: `
      <div class="dz-preview dz-file-preview">
        <div class="dz-image">
          <img data-dz-thumbnail />
        </div>
        <a class="dz-remove" href="javascript:undefined;" data-dz-remove>×</a>
      </div>
    `,
    init: function(this: Dropzone) {
      this.on("maxfilesexceeded", (file: any) => {
        this.removeFile(file);
        alert("Solo se permite una imagen. Elimina la imagen actual si deseas cambiarla.");
      });
    }
  });
  
  myDropzone.on("addedfile", function(file: any) {
    console.log("Archivo agregado:", file);
    // Mostrar botón de confirmación
    confirmButton.classList.add('show');
  });
  
  myDropzone.on("removedfile", function(file: any) {
    console.log("Archivo eliminado:", file);
    // Ocultar botón de confirmación si no hay archivos
    if (myDropzone.files.length === 0) {
      confirmButton.classList.remove('show');
      imageDataURL = null; // Limpiar dataURL cuando se elimina la imagen
    }
  });
  
  // Manejar el botón de confirmación de imagen
  confirmButton.addEventListener('click', async () => {
    if (myDropzone.files.length > 0) {
      const file = myDropzone.files[0];
      console.log("Imagen confirmada:", file);
      
      try {
        // Comprimir imagen antes de convertir a DataURL
        imageDataURL = await compressImage(file, 800, 800, 0.7);
        console.log("Imagen comprimida. Tamaño:", imageDataURL.length, "caracteres");
        confirmButton.disabled = true;
        confirmButton.textContent = "✓ Imagen confirmada";
      } catch (error) {
        console.error("Error al comprimir imagen:", error);
        alert("Error al procesar la imagen. Por favor, intenta nuevamente.");
      }
    }
  });

  // Manejar el envío del formulario
  const form = reportLostPetPage.querySelector('.report-lost-pet-form') as HTMLFormElement;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Obtener datos del formulario
    const petNameInput = reportLostPetPage.querySelector('#pet-name') as HTMLInputElement;
    const lastLocationInput = reportLostPetPage.querySelector('#last-seen-location') as HTMLInputElement;

    const lastLocation = lastLocationInput.value;

    const lastLocationCoords = await forwardGeocode(lastLocation);
    
    const lat = lastLocationCoords ? lastLocationCoords.lat : null;
    const lng = lastLocationCoords ? lastLocationCoords.lng : null;
    
    // Validar que todos los campos estén completos
    if (!petNameInput.value.trim() || !lastLocation.trim()) {
      alert("Por favor, completa todos los campos del formulario.");
      return;
    }
    
    // Si no hay imagen confirmada, intentar comprimir la del Dropzone
    if (!imageDataURL && myDropzone.files.length > 0) {
      try {
        console.log("Comprimiendo imagen...");
        imageDataURL = await compressImage(myDropzone.files[0], 800, 800, 0.7);
        console.log("Imagen comprimida automáticamente. Tamaño:", imageDataURL.length, "caracteres");
      } catch (error) {
        console.error("Error al comprimir imagen:", error);
        alert("Error al procesar la imagen. Por favor, haz clic en 'Confirmar imagen' y vuelve a intentar.");
        return;
      }
    }
    
    if (!imageDataURL) {
      alert("Por favor, selecciona y confirma una imagen de la mascota.");
      return;
    }
    
    console.log("Enviando datos:", {
      name: petNameInput.value,
      lat: lat,
      lng: lng,
      imageURLLength: imageDataURL ? imageDataURL.length : "NULL"
    });

    try {
      console.log("imageDataURL en el momento del envío:", imageDataURL ? `presente (${imageDataURL.length} caracteres)` : "NULL");

      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("authToken") || ""}`
        },
        body: JSON.stringify({
          name: petNameInput.value.trim(),
          lat: lat,
          lng: lng,
          imageURL: imageDataURL
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("¡Reporte enviado exitosamente!");
        params.goTo('/my-reports');
      } else {
        alert(data.error || "Error al enviar el reporte. Por favor, intenta nuevamente.");
      }
    } catch(error){
      console.error("Error al enviar el formulario:", error);
      alert("Ocurrió un error al enviar el reporte. Por favor, intenta nuevamente.");
    }
  });
  // Manejar el botón cancelar
  const cancelButton = reportLostPetPage.querySelector('.cancel-button') as HTMLButtonElement;
  cancelButton.addEventListener('click', () => {
    params.goTo('/my-reports');
  });

  return reportLostPetPage;
}