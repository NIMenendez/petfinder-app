import '../style.css'
import '../components/header.ts'
import '../components/cards.ts'
import { reverseGeocode } from '../utils/geocoding.ts'


interface PetData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  status_lost: boolean;
  createdAt: string;
  owner?: any;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export async function initHomePets(params: { goTo: (arg: string) => void }): Promise<HTMLElement> {
  const homePagePets = document.createElement("div");
  
  // Función para obtener mascotas perdidas cerca de la ubicación
  const getPetsNearLocation = async (userLocation?: UserLocation): Promise<PetData[]> => {
    
    try {
      if (!userLocation) {
        console.warn('No user location available');
        return [];
      }

      const url = `https://petfinder-app-tc1a.onrender.com/pets?lat=${userLocation.latitude}&lng=${userLocation.longitude}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 200));
        throw new Error('API returned non-JSON response');
      }
      
      const data = await response.json();
      return data.pets || [];
    } catch (error) {
      console.error('Error fetching pets:', error);
      return [];
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

  const userLocationCoords = getUserLocation();
  let nearbyPets: PetData[] = [];
  let userLocation: string | null = null;
  
  // Obtener mascotas cercanas
  try {
    nearbyPets = await getPetsNearLocation(userLocationCoords || undefined);
    console.log("Mascotas obtenidas del servidor:", nearbyPets);
  } catch (error) {
    console.error('Error getting nearby pets:', error);
    nearbyPets = [];
  }
  
  // Obtener nombre de ubicación
  if (userLocationCoords) {
    try {
      userLocation = await reverseGeocode(userLocationCoords.latitude, userLocationCoords.longitude);
    } catch (error) {
      console.error('Error getting location name:', error);
      userLocation = null;
    }
  }
  
  // Determinar el título basado en si tenemos ubicación del usuario
  const locationTitle = userLocation 
    ? `Mascotas perdidas cerca de ${userLocation}`
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
          id="${pet.id}"
          data-name="${pet.name}" 
          data-lat="${pet.lat}"
          data-lng="${pet.lng}"
          ${pet.imageUrl ? `data-imageurl="${pet.imageUrl}"` : ''}
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



