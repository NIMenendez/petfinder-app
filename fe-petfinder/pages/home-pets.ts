import '../style.css'
import '../components/header.ts'
import '../components/cards.ts'


interface PetData {
  id: string;
  name: string;
  lastLocation: string;
  imageDataURL?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export function initHomePets(params: { goTo: (arg: string) => void }): HTMLElement {
  const homePagePets = document.createElement("div");
  
  // Función para obtener mascotas perdidas cerca de la ubicación
  const getPetsNearLocation = (userLocation?: UserLocation): PetData[] => {
    // Datos de prueba hardcodeados para Santo Tomé, Santa Fe, Argentina
    // Coordenadas aproximadas: -31.6633, -60.7633
    const testPets: PetData[] = [
      {
        id: "pet-1",
        name: "Max",
        lastLocation: "Santo Tomé, Santa Fe",
        imageDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bbjbqvkdjocVZzmtX2nQXz/W4xCsAe+cuvG9W/8AdMXEgP8Asq+8wgA0tVDtOD4YpBL6rM9gQUzzrrzWQWUd9Vh1gJp2vSjOvl5KbWHJKjtOlGWZFjG/e+gcpL4BN7S9XXEczF+5m4p7wPa/hP8AGcNi2rU1UHv9bjBKwFrB6lWFqpBZwu0LrOOtnWQ1HavdKODu4aq6w4ZdrKbKRjhfT7OJVdMzQdbjGNjnA=",
        coordinates: { latitude: -31.6633, longitude: -60.7633 }
      },
      {
        id: "pet-2", 
        name: "Luna",
        lastLocation: "Centro, Santo Tomé",
        imageDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gODAK/9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/8AAEQgAAQABAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A5qikFPIpgNqOq4D/2Q==",
        coordinates: { latitude: -31.6643, longitude: -60.7643 }
      },
      {
        id: "pet-3",
        name: "Rocky",
        lastLocation: "Barrio Norte, Santo Tomé",
        coordinates: { latitude: -31.6623, longitude: -60.7623 }
      },
      {
        id: "pet-4",
        name: "Bella",
        lastLocation: "Av. San Martín, Santo Tomé",
        imageDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bbjbqvkdjocVZzmtX2nQXz/W4xCsAe+cuvG9W/8AdMXEgP8Asq+8wgA0tVDtOD4YpBL6rM9gQUzzrrzWQWUd9Vh1gJp2vSjOvl5KbWHJKjtOlGWZFjG/e+gcpL4BN7S9XXEczF+5m4p7wPa/hP8AGcNi2rU1UHv9bjBKwFrB6lWFqpBZwu0LrOOtnWQ1HavdKODu4aq6w4ZdrKbKRjhfT7OJVdMzQdbjGNjnA=",
        coordinates: { latitude: -31.6613, longitude: -60.7613 }
      },
      {
        id: "pet-5",
        name: "Toby",
        lastLocation: "Plaza Central, Santo Tomé",
        coordinates: { latitude: -31.6653, longitude: -60.7653 }
      }
    ];

    // TODO: En el futuro, aquí se implementará la lógica para:
    // 1. Hacer petición a la API con las coordenadas del usuario
    // 2. Filtrar mascotas por proximidad geográfica
    // 3. Ordenar por distancia más cercana
    
    if (userLocation) {
      console.log(`Buscando mascotas cerca de: ${userLocation.latitude}, ${userLocation.longitude}`);
      // Por ahora retornamos las mascotas de prueba para cualquier ubicación
      return testPets;
    } else {
      console.log("Usando ubicación por defecto: Santo Tomé, Santa Fe");
      return testPets;
    }
  };

  // Obtener ubicación del usuario desde localStorage
  const getUserLocation = (): UserLocation | null => {
    const stored = localStorage.getItem('userLocation');
    if (stored) {
      try {
        const location = JSON.parse(stored);
        // Verificar que la ubicación no sea muy antigua (más de 1 hora)
        if (Date.now() - location.timestamp < 3600000) {
          return location;
        } else {
          localStorage.removeItem('userLocation');
        }
      } catch (error) {
        console.error('Error parsing user location:', error);
        localStorage.removeItem('userLocation');
      }
    }
    return null;
  };

  const userLocation = getUserLocation();
  const nearbyPets = getPetsNearLocation(userLocation || undefined);
  
  // Determinar el título basado en si tenemos ubicación del usuario
  const locationTitle = userLocation 
    ? "Mascotas perdidas cerca de tu ubicación" 
    : "Mascotas perdidas cerca";

  homePagePets.innerHTML = `
  <app-header></app-header>
  <main>
    <div class="main-subtitle">
      <h2 class="subtitle">${locationTitle}</h2>
      ${userLocation ? `
        <p class="location-info">
          Mostrando resultados cerca de tu ubicación
        </p>
      ` : `
        <p class="location-info">
          Ubicación: Santo Tomé, Santa Fe (ubicación por defecto)
          <br>
          <small>Para ver mascotas cerca de ti, regresa al inicio y comparte tu ubicación</small>
        </p>
      `}
    </div>
    
    <div class="pet-cards-container">
      ${nearbyPets.map(pet => `
        <pet-card 
          data-name="${pet.name}" 
          data-lastlocation="${pet.lastLocation}"
          ${pet.imageDataURL ? `data-image="${pet.imageDataURL}"` : ''}
        ></pet-card>
      `).join('')}
    </div>
    
    ${nearbyPets.length === 0 ? `
      <div class="no-pets-message">
        <h3>No hay mascotas perdidas reportadas en esta área</h3>
        <p>Intenta buscar en otra ubicación o reporta una mascota perdida.</p>
      </div>
    ` : ''}
  </main>
  
  <style>
    .location-info {
      color: #666;
      margin: 10px 0 20px 0;
      font-size: 16px;
      text-align: center;
    }
    
    .location-info small {
      color: #888;
      font-size: 14px;
    }
    
    .no-pets-message {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }
    
    .no-pets-message h3 {
      margin-bottom: 10px;
      color: #333;
    }
    
    @media (max-width: 768px) {
      .pet-cards-container {
        grid-template-columns: 1fr;
        gap: 15px;
        padding: 15px;
      }
      
      .location-info {
        font-size: 14px;
        padding: 0 10px;
      }
    }
  </style>
`
  const misDatosBtn = homePagePets.querySelector(".menu-item[href='/profile']");
  misDatosBtn?.addEventListener("click", () => {
    params.goTo("/profile");
  });

  return homePagePets;
}



