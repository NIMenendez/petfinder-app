/**
 * Geocodificación: Convierte coordenadas (lat, lng) a nombre de ciudad
 * Utiliza la API de Nominatim de OpenStreetMap
 * @param lat - Latitud
 * @param lng - Longitud
 * @returns Nombre de la ciudad o null si no se encuentra
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept': 'application/json',
          // Nominatim requiere un User-Agent
          'User-Agent': 'PetFinder-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error en API: ${response.status}`);
    }

    const data = await response.json();
    
    // Intentar obtener la ciudad (city), provincia (state) o localidad (town)
    const address = data.address || {};
    const city = address.city || address.town || address.village || address.county || null;
    
    if (!city) {
      console.warn('No se encontró nombre de ciudad para las coordenadas:', { lat, lng });
      return null;
    }

    return city;
  } catch (error) {
    console.error('Error en reverseGeocode:', error);
    return null;
  }
}

/**
 * Geocodificación inversa: Convierte nombre de ciudad a coordenadas (lat, lng)
 * Utiliza la API de Nominatim de OpenStreetMap
 * @param cityName - Nombre de la ciudad
 * @returns Objeto con lat y lng, o null si no se encuentra
 */
export async function forwardGeocode(cityName: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`,
      {
        headers: {
          'Accept': 'application/json',
          // Nominatim requiere un User-Agent
          'User-Agent': 'PetFinder-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error en API: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn('No se encontraron coordenadas para la ciudad:', cityName);
      return null;
    }

    const result = data[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    return { lat, lng };
  } catch (error) {
    console.error('Error en forwardGeocode:', error);
    return null;
  }
}

/**
 * Ejemplo de uso de geocodificación inversa
 * reverseGeocode(40.7128, -74.0060).then(city => {
 *   console.log('Ciudad:', city); // "New York" o similar
 * });
 */

/**
 * Ejemplo de uso de geocodificación
 * forwardGeocode('Madrid').then(coords => {
 *   console.log('Coordenadas:', coords); // { lat: 40.4168, lng: -3.7038 }
 * });
 */
