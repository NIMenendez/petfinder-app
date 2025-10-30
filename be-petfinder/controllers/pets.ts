import { Pet, User } from "../models/models.js";
import { client } from "../lib/algolia.js"

export async function createLostPet(userId: number, name: string, lat: number, lng: number, imageUrl: string) {
  try {
    console.log("=== INICIO createLostPet ===");
    console.log("Parámetros recibidos:", { userId, name, lat, lng, imageUrl });
    
    const petData = { userId, name, lat, lng, imageUrl, status_lost: true };
    console.log("Datos a insertar en Pet.create:", petData);
    
    console.log("Ejecutando Pet.create...");
    const lostPet = await Pet.create(petData);
    console.log("Pet.create exitoso, ID:", lostPet.get("id"));

    console.log("Preparando datos para Algolia...");
    
    try {
      const algoliaRes = await client.saveObjects({
        indexName: 'prod_PETS',
        objects: [
          {
            objectID: lostPet.get("id"),
            name: lostPet.get("name"),
            _geoloc: {
              lat: lostPet.get("lat"),
              lng: lostPet.get("lng")
            }
          }
        ]
      });
      console.log("Algolia guardado exitosamente:", algoliaRes);
    } catch (algoliaError: any) {
      console.warn("Error en Algolia (continuando sin índice):", algoliaError.message);
    }

  console.log("ID de la mascota perdida:", lostPet.get("id"));
  console.log("=== FIN createLostPet EXITOSO ===");

  return lostPet;
  
  } catch (error: any) {
    console.error("=== ERROR en createLostPet ===");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);
    console.error("Error SQL:", error.sql);
    console.error("Parámetros SQL:", error.parameters);
    console.error("=== FIN ERROR createLostPet ===");
    throw error;
  }
}

export async function deleteLostPet(petId: number) {
  const pet = await Pet.findByPk(petId);
  if (pet) {
    await pet.destroy();
  }
}

export async function updatePetStatusToFound(petId: number, status_lost: true | false) {
  const pet = await Pet.findByPk(petId);
  if (pet) {
    await pet.update({ status_lost: status_lost });
    return pet;
  } else {
    throw new Error("Mascota no encontrada");
  }
}

// Función para verificar que la mascota pertenece al usuario
export async function verifyPetOwnership(petId: number, userId: number): Promise<boolean> {
  const pet = await Pet.findByPk(petId);
  if (!pet) {
    return false; // Mascota no existe
  }
  return pet.get("userId") === userId;
}

export async function updatePetData(
  petId: number, 
  userId: number, 
  updates: {
    name?: string;
    lat?: number;
    lng?: number;
    imageUrl?: string;
  }
) {
  const pet = await Pet.findByPk(petId);
  
  if (!pet) {
    throw new Error("Mascota no encontrada");
  }
  
  // Verificar que la mascota pertenece al usuario
  if (pet.get("userId") !== userId) {
    throw new Error("No tienes permisos para modificar esta mascota");
  }
  // Construir objeto de actualización solo con campos proporcionados
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.lat !== undefined) dbUpdates.lat = updates.lat;
  if (updates.lng !== undefined) dbUpdates.lng = updates.lng;
  if (updates.imageUrl !== undefined) dbUpdates.imageUrl = updates.imageUrl;
  // Actualizar solo los campos proporcionados en la base de datos
  if (Object.keys(dbUpdates).length > 0) {
    await pet.update(dbUpdates);
  }
  // Actualizar Algolia solo con los campos que cambiaron
  try {
    const algoliaUpdates: any = {
      objectID: petId
    };
    // Solo agregar campos a Algolia si fueron proporcionados
    if (updates.name !== undefined) {
      algoliaUpdates.name = updates.name;
    }
    // Para geolocalización, solo actualizar si ambos lat y lng están presentes
    if (updates.lat !== undefined && updates.lng !== undefined) {
      algoliaUpdates._geoloc = {
        lat: updates.lat,
        lng: updates.lng
      };
    }
    
    // Solo hacer la petición a Algolia si hay algo que actualizar
    if (Object.keys(algoliaUpdates).length > 1) { // objectID siempre está presente
      await client.partialUpdateObjects({
        indexName: 'prod_PETS',
        objects: [algoliaUpdates]
      });
    }
  } catch (algoliaError: any) {
    console.warn("Error actualizando Algolia (continuando):", algoliaError.message);
  }

  return pet;
}

export async function getPetsNearby (lat: number, lng: number) {
  try {
    // Buscar mascotas cercanas en Algolia
    const algoliaRes = await client.searchSingleIndex({ 
      indexName: 'prod_PETS',
      searchParams: {     
        aroundLatLng: `${lat}, ${lng}`,
        aroundRadius: 1500000,
      }
    });

    // Extraer los IDs de las mascotas encontradas en Algolia
    const petIds = algoliaRes.hits.map((hit: any) => parseInt(hit.objectID));
    
    if (petIds.length === 0) {
      return []; // No hay mascotas cercanas
    }

    // Buscar en la base de datos solo las mascotas que siguen perdidas
    const lostPets = await Pet.findAll({
      where: {
        id: petIds,
        status_lost: true
      },
      include: [
        {
          model: User,
          attributes: ['name'] // Solo incluir el nombre del usuario
        }
      ]
    });

    // Mapear los resultados para incluir información útil
    const results = lostPets.map(pet => ({
      id: pet.get('id'),
      name: pet.get('name'),
      lat: pet.get('lat'),
      lng: pet.get('lng'),
      imageUrl: pet.get('imageUrl'),
      status_lost: pet.get('status_lost'),
      createdAt: pet.get('createdAt'),
      owner: pet.get('user') ? pet.get('user') : null
    }));

    return results;
    
  } catch (error: any) {
    console.error('Error en getPetsNearby:', error.message);
    
    // Fallback: si Algolia falla, buscar directamente en la BD
    // (menos eficiente pero funcional)
    try {
      const fallbackPets = await Pet.findAll({
        where: {
          status_lost: true
        },
        include: [
          {
            model: User,
            attributes: ['name']
          }
        ]
      });
      
      console.warn('Usando fallback de base de datos (sin filtro geográfico)');
      return fallbackPets.map(pet => ({
        id: pet.get('id'),
        name: pet.get('name'),
        lat: pet.get('lat'),
        lng: pet.get('lng'),
        imageUrl: pet.get('imageUrl'),
        status_lost: pet.get('status_lost'),
        createdAt: pet.get('createdAt'),
        owner: pet.get('user') ? pet.get('user') : null
      }));
      
    } catch (dbError: any) {
      console.error('Error en fallback de base de datos:', dbError.message);
      throw new Error('Error al buscar mascotas perdidas');
    }
  }
}