import '../../style.css'
import '../../components/header.ts'
import Dropzone from 'dropzone';


interface ExistingReport {
  id?: string;
  petName: string;
  lastLocation: string;
  imageDataURL?: string;
}

export function initEditReport(params: { 
  goTo: (arg: string) => void;
  reportData?: ExistingReport;
}): HTMLElement {
  const editReportPage = document.createElement("div");
  
  // Obtener datos existentes desde localStorage o parámetros
  let currentData = params.reportData;
  
  // Si no hay datos en parámetros, intentar obtener desde localStorage
  if (!currentData) {
    const storedData = localStorage.getItem('editReportData');
    console.log('Stored data from localStorage:', storedData);
    if (storedData) {
      try {
        currentData = JSON.parse(storedData);
        console.log('Parsed currentData:', currentData);
        // Limpiar localStorage después de usar los datos
        localStorage.removeItem('editReportData');
      } catch (error) {
        console.error('Error parsing stored report data:', error);
      }
    }
  }
  
  // Usar valores por defecto si no hay datos
  if (!currentData) {
    currentData = {
      id: undefined,
      petName: "",
      lastLocation: "",
      imageDataURL: undefined
    };
  }
  
  console.log('Final currentData before template:', currentData);

  editReportPage.innerHTML = `
  <style>

    .edit-report-main {
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
      background-color: var(--primary-button-color);
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
      margin-bottom: 0.5rem;
    }
    
    .report-found-button {
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
      margin-bottom: 0.5rem;
    }
    
    .delete-button {
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
      margin-bottom: 0.5rem;
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
  <main class="edit-report-main">
    <h2 class="subtitle">Editar reporte de mascota perdida</h2>
    <p style="color: #666">Actualiza el siguiente formulario para modificar el reporte de tu mascota perdida.</p>
    <form class="edit-report-form">
      <div class="pet-name-container">
        <label style="display: block;" for="pet-name">Nombre de la mascota:</label>
        <input type="text" id="pet-name" name="pet-name" value="${currentData.petName}">
      </div>

      <div class="pet-image-container">
        <label style="display: block;" for="pet-image">Foto de la mascota:</label>
        <div class="dropzone">
          <div class="dz-message">
            Arrastra una imagen aquí o haz clic para seleccionar una nueva imagen
          </div>
        </div>
        <button type="button" class="confirm-image-button" id="confirm-image-btn">
          ✓ Confirmar nueva imagen
        </button>
      </div>

      <div class="last-seen-location-container">
        <label style="display: block;" for="last-seen-location">Última ubicación conocida:</label>
        <input type="text" id="last-seen-location" name="last-seen-location" value="${currentData.lastLocation}">
      </div>

      <div class="button-container">
        <button type="submit" class="report-button">Guardar cambios</button>
        <button type="button" class="report-found-button">Reportar como encontrado</button>
        <button type="button" class="delete-button">Eliminar reporte</button>
        <button type="button" class="cancel-button">Cancelar</button>
      </div>
    </form>
  </main>
`

  // Inicializar Dropzone
  const dropzoneElement = editReportPage.querySelector('.dropzone') as HTMLElement;
  const confirmButton = editReportPage.querySelector('#confirm-image-btn') as HTMLButtonElement;

  // Variable para almacenar el dataURL de la imagen (inicializar con imagen existente si la hay)
  let imageDataURL: string | null = currentData.imageDataURL || null;
  
  const myDropzone = new Dropzone(dropzoneElement, {
    url: "/upload", // URL temporal, se configurará más tarde
    autoProcessQueue: false, // No subir automáticamente
    acceptedFiles: "image/*", // Solo imágenes
    maxFiles: 1, // Solo una imagen
    addRemoveLinks: true, // Mostrar enlace para eliminar
    dictDefaultMessage: "Arrastra una imagen aquí o haz clic para seleccionar una nueva imagen",
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
      
      // Si hay imagen existente, mostrarla
      if (currentData.imageDataURL) {
        console.log('Showing existing image:', currentData.imageDataURL.substring(0, 50) + '...');
        const mockFile: any = { 
          name: "imagen-actual.jpg", 
          size: 12345,
          dataURL: currentData.imageDataURL
        };
        this.emit("addedfile", mockFile);
        this.emit("thumbnail", mockFile, currentData.imageDataURL);
        this.emit("complete", mockFile);
        this.files.push(mockFile);
      } else {
        console.log('No imageDataURL found in currentData');
      }
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
  confirmButton.addEventListener('click', () => {
    if (myDropzone.files.length > 0) {
      const file = myDropzone.files[0];
      console.log("Imagen confirmada:", file);
      
      // Convertir archivo a dataURL
      const reader = new FileReader();
      reader.onload = function(e) {
        imageDataURL = e.target?.result as string;
        console.log("DataURL generado:", imageDataURL);
      };
      reader.readAsDataURL(file);
    }
  });

  // Manejar el envío del formulario
  const form = editReportPage.querySelector('.edit-report-form') as HTMLFormElement;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Obtener datos del formulario
    const petNameInput = editReportPage.querySelector('#pet-name') as HTMLInputElement;
    const lastLocationInput = editReportPage.querySelector('#last-seen-location') as HTMLInputElement;

    const formData = {
      id: currentData.id, // ID del reporte para identificarlo en la actualización
      petName: petNameInput.value || currentData.petName, // Usar valor actual si no se cambió
      lastLocation: lastLocationInput.value || currentData.lastLocation, // Usar valor actual si no se cambió
      imageDataURL: imageDataURL || currentData.imageDataURL // Usar imagen actual si no se cambió
    };
    
    console.log("Datos actualizados del reporte:", formData);
    
    // Aquí puedes agregar la lógica para enviar los datos actualizados al servidor
    // Por ejemplo: 
    // fetch(`/api/reports/${formData.id}`, { 
    //   method: 'PUT', 
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData) 
    // })
    
    alert("¡Reporte actualizado exitosamente!");
    params.goTo('/my-reports'); // Regresar a la lista de reportes
  });

  // Manejar el botón cancelar
  const cancelButton = editReportPage.querySelector('.cancel-button') as HTMLButtonElement;
  cancelButton.addEventListener('click', () => {
    params.goTo('/my-reports'); // Regresar a mis reportes en lugar de profile
  });

  // Manejar el botón "Reportar como encontrado"
  const foundButton = editReportPage.querySelector('.report-found-button') as HTMLButtonElement;
  foundButton.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres marcar esta mascota como encontrada?')) {
      console.log("Mascota reportada como encontrada:", currentData);
      
      // Aquí puedes agregar la lógica para marcar como encontrada en el servidor
      // Por ejemplo:
      // fetch(`/api/reports/${currentData.id}/found`, { 
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'found' })
      // })
      
      alert("¡Excelente! Tu mascota ha sido marcada como encontrada.");
      params.goTo('/my-reports');
    }
  });

  // Manejar el botón "Eliminar reporte"
  const deleteButton = editReportPage.querySelector('.delete-button') as HTMLButtonElement;
  deleteButton.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer.')) {
      console.log("Reporte eliminado:", currentData);
      
      // Aquí puedes agregar la lógica para eliminar el reporte del servidor
      // Por ejemplo:
      // fetch(`/api/reports/${currentData.id}`, { 
      //   method: 'DELETE'
      // })
      
      alert("El reporte ha sido eliminado exitosamente.");
      params.goTo('/my-reports');
    }
  });

  return editReportPage;

}