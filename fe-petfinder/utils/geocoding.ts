// Caché para almacenar resultados de ambos tipos de geocoding
const reverseGeocodeCache = new Map<string, string | null>();
const forwardGeocodeCache = new Map<string, { lat: number; lng: number } | null>();

// Control de rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 segundos mínimo entre solicitudes

async function throttledFetch(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<Response> {
  // Esperar si es necesario para respetar rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  
  // Crear un controller para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Geocodificación inversa: Convierte coordenadas (lat, lng) a nombre de ciudad
 * Utiliza la API de Nominatim de OpenStreetMap con caché y fallback inteligente
 * @param lat - Latitud
 * @param lng - Longitud
 * @returns Nombre de la ciudad o formato "lat, lng", o null si no se encuentra
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  // Crear una clave de caché con las coordenadas (redondeadas a 3 decimales para agrupar coordenadas cercanas)
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;

  // Verificar si ya tenemos este resultado en caché
  if (reverseGeocodeCache.has(cacheKey)) {
    const cached = reverseGeocodeCache.get(cacheKey);
    console.log('Usando caché de geocoding para:', cacheKey, '→', cached);
    return cached || null;
  }
  
  try {
    console.log('Solicitando geocoding para:', { lat, lng });
    
    const response = await throttledFetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PetFinder-App (Pet Finder App)'
        }
      },
      8000 // 8 segundos de timeout
    );

    if (!response.ok) {
      console.warn(`API retornó estado: ${response.status}`);
      throw new Error(`Error en API: ${response.status}`);
    }

    const data = await response.json();
    
    // Intentar obtener la ciudad (city), provincia (state) o localidad (town)
    const address = data.address || {};
    const city = address.city || address.town || address.village || address.county || null;
    
    if (!city) {
      console.warn('No se encontró nombre de ciudad para las coordenadas:', { lat, lng });
      // Devolver formato "lat, lng" como fallback
      const fallback = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
      reverseGeocodeCache.set(cacheKey, fallback);
      return fallback;
    }

    // Guardar en caché
    console.log('✓ Geocoding exitoso:', city);
    reverseGeocodeCache.set(cacheKey, city);
    return city;
  } catch (error: any) {
    console.error('Error en reverseGeocode:', error.message);
    
    // Fallback: devolver coordenadas formateadas en lugar de null
    const fallback = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    console.log('Usando fallback:', fallback);
    reverseGeocodeCache.set(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Geocodificación directa: Convierte nombre de ciudad a coordenadas (lat, lng)
 * Utiliza la API de Nominatim de OpenStreetMap con caché y parámetros optimizados
 * @param cityName - Nombre de la ciudad
 * @param countryCode - Código de país opcional (ej: 'ar' para Argentina)
 * @returns Objeto con lat y lng, o null si no se encuentra
 */
export async function forwardGeocode(
  cityName: string,
  countryCode: string = 'ar'
): Promise<{ lat: number; lng: number } | null> {
  // Crear clave de caché incluyendo el país
  const cacheKey = `${cityName.toLowerCase().trim()}_${countryCode}`;

  // Verificar si ya tenemos este resultado en caché
  if (forwardGeocodeCache.has(cacheKey)) {
    const cached = forwardGeocodeCache.get(cacheKey);
    console.log('Usando caché de forwardGeocode para:', cacheKey);
    return cached || null;
  }

  try {
    console.log('Solicitando geocoding directo para:', cityName);
    
    // Construir parámetros de búsqueda optimizados
    let searchQuery = cityName;
    
    // Si es una búsqueda en Argentina, añadir el país para mayor precisión
    if (countryCode === 'ar') {
      searchQuery = `${cityName}, Argentina`;
    }

    const response = await throttledFetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json` +
      `&q=${encodeURIComponent(searchQuery)}` +
      `&countrycodes=${countryCode}` +
      `&limit=3` + // Reducido a 3 resultados
      `&addressdetails=1` +
      `&type=city,town,village,hamlet`, // Filtrar solo lugares tipo ciudad
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PetFinder-App (Pet Finder App)'
        }
      },
      8000 // 8 segundos de timeout
    );

    if (!response.ok) {
      console.warn(`API retornó estado: ${response.status}`);
      throw new Error(`Error en API: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn('No se encontraron coordenadas para:', cityName);
      forwardGeocodeCache.set(cacheKey, null);
      return null;
    }

    // Filtrar y ordenar resultados por relevancia
    let bestResult = data[0];
    
    for (const result of data) {
      const resultName = result.name?.toLowerCase() || '';
      const searchName = cityName.toLowerCase().trim();
      
      // Si hay coincidencia exacta, usar ese resultado
      if (resultName === searchName) {
        bestResult = result;
        break;
      }
      
      // Si el resultado actual tiene mejor importancia, usarlo
      if (result.importance > bestResult.importance) {
        bestResult = result;
      }
    }

    const lat = parseFloat(bestResult.lat);
    const lng = parseFloat(bestResult.lon);

    console.log('✓ Geocoding directo exitoso:', {
      city: cityName,
      name: bestResult.name,
      lat,
      lng
    });

    const result = { lat, lng };
    forwardGeocodeCache.set(cacheKey, result);
    return result;
  } catch (error: any) {
    console.error('Error en forwardGeocode:', error.message);
    forwardGeocodeCache.set(cacheKey, null);
    return null;
  }
}
