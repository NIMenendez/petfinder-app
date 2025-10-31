import express, { Response } from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url'
import * as dotenv from "dotenv"

// Cargar variables de entorno PRIMERO, antes de importar los controllers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { createAuthUser, authenticateUser, verifyToken, verifyTokenAndOwnership, AuthenticatedRequest, checkUserOwnership } from "./controllers/auth.js";
import { getUserById, getUserPets, updateUserPassword, updateUserName } from "./controllers/users.js";
import { createLostPet, deleteLostPet, updatePetStatusToFound, updatePetData, getPetsNearby, verifyPetOwnership } from "./controllers/pets.js";
import { reportPetSighting, sendEmailNotification } from "./controllers/reports.js";

const app = express();
const PORT = process.env.PORT || 3000;


(async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

// Configurar CORS primero, antes que otros middleware
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}
app.use(cors(corsOptions))

// Luego configurar express.json con límite aumentado para imágenes
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../dist')));

//Registro de usuario (Sign up)(nuevo usuario y auth)
app.post("/auth", async (req, res) => {
  try {
    console.log("=== POST /auth ===");
    const { email, password, name } = req.body
    console.log("Datos recibidos:", { email, name, passwordLength: password?.length });

    if (!email || !password || !name) {
      console.log("❌ Faltan parámetros requeridos");
      return res.status(400).json({ error: "Email, password y name son requeridos" })
    }

    console.log("📝 Creando usuario...");
    const { user, created, authCreated } = await createAuthUser(email, password, name)
    console.log("✅ Usuario creado:", { created, authCreated, userId: user.get("id") });

    if (created && authCreated) {
      res.status(201).json({ message: "Usuario creado exitosamente", userId: user.get("id") })
    } else {
      res.status(409).json({ error: "El email ya está registrado" })
    }
  } catch (error: any) {
    console.error("❌ Error en POST /auth:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({ error: "Error interno del servidor", details: error.message })
  }
})

//Login de usuario (Sign in)
app.post("/auth/token", async (req, res) => {

  const { email, password } = req.body
  
  await authenticateUser(email, password)
    .then(({ token, userId }) => {
      res.status(200).json({ token: token, userId: userId })
    })
    .catch((error) => {
      res.status(401).json({ error: error.message })
    })

});

//Acceder a los datos del usuario
app.get("/users/:id", verifyTokenAndOwnership, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const authenticatedUserId = req.user?.id;

    // Verificar que el usuario solo acceda a sus propios datos
    if (!checkUserOwnership(authenticatedUserId, userId)) {
      return res.status(403).json({ 
        error: "Acceso denegado. Solo puedes acceder a tus propios datos." 
      });
    }

    const user = await getUserById(parseInt(userId));
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Editar nombre de usuario
app.patch("/users/userdata/:id", verifyTokenAndOwnership, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const { name } = req.body;

    // Verificar que el usuario solo edite sus propios datos
    if (!checkUserOwnership(req.user?.id, userId)) {
      return res.status(403).json({ 
        error: "Acceso denegado. Solo puedes editar tus propios datos." 
      });
    }

    await updateUserName(parseInt(userId), name);
    
    res.json({ message: "Datos actualizados exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Editar contraseña de usuario
app.patch("/users/password/:id", verifyTokenAndOwnership, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    await updateUserPassword(parseInt(userId), oldPassword, newPassword);
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error: any) {
    if (error.message === "Contraseña antigua incorrecta") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

//Crear mascota perdida
app.post("/pets", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, lat, lng, imageURL } = req.body;
    const userId = req.user?.id;
    
    console.log("POST /pets recibido con:", { name, lat, lng, imageURL: imageURL ? "presente" : "NULL", userId });
    
    // Validar que todos los campos requeridos estén presentes
    if (!name || !lat || !lng || !userId) {
      return res.status(400).json({ 
        error: "Faltan campos requeridos: name, lat, lng son obligatorios" 
      });
    }

    if (!imageURL) {
      return res.status(400).json({ 
        error: "La imagen es requerida" 
      });
    }

    const result = await createLostPet(userId, name, lat, lng, imageURL);
    res.status(201).json({
      message: "Mascota perdida reportada exitosamente",
      petId: result.get("id")
    });
  } catch (error: any) {
    console.error("Error al crear mascota perdida:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Actualizar un reporte de mascota perdida
app.patch("/pets/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const petId = req.params.id;
    const userId = req.user?.id;
    const { name, lat, lng, imageUrl } = req.body;

    console.log("=== PATCH /pets/:id ===");
    console.log("petId:", petId);
    console.log("userId:", userId);
    console.log("Datos recibidos:", { name, lat, lng, imageUrl: imageUrl ? `(presente, ${imageUrl.substring(0, 50)}...)` : 'vacío' });

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Construir objeto de updates solo con los campos proporcionados
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (lat !== undefined) updates.lat = lat;
    if (lng !== undefined) updates.lng = lng;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    console.log("Updates a aplicar:", { ...updates, imageUrl: updates.imageUrl ? `(presente, ${updates.imageUrl.substring(0, 50)}...)` : 'vacío' });

    // Verificar que al menos un campo fue proporcionado
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: "Se debe proporcionar al menos un campo para actualizar (name, lat, lng, imageUrl)" 
      });
    }

    await updatePetData(parseInt(petId), userId, updates);
    
    const updatedFields = Object.keys(updates).join(', ');
    console.log("✓ Mascota actualizada correctamente. Campos:", updatedFields);
    console.log("=== FIN PATCH /pets/:id ===");
    
    res.json({ 
      message: "Datos de la mascota actualizados exitosamente",
      updatedFields: updatedFields
    });
    
  } catch (error: any) {
    console.error("❌ Error en PATCH /pets/:id:", error.message);
    if (error.message === "Mascota no encontrada") {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }
    if (error.message === "No tienes permisos para modificar esta mascota") {
      return res.status(403).json({ error: "No tienes permisos para modificar esta mascota" });
    }
    console.error("Error actualizando mascota:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Acceder a los reportes de un usuario
app.get("/users/:id/pets", verifyTokenAndOwnership, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const authenticatedUserId = req.user?.id;
    // Verificar que el usuario solo acceda a sus propias mascotas
    if (!checkUserOwnership(authenticatedUserId, userId)) {
      return res.status(403).json({ 
        error: "Acceso denegado. Solo puedes ver tus propias mascotas." 
      });
    }

    const pets = await getUserPets(parseInt(userId));
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Marcar una mascota como encontrada
app.patch("/pets/:id/found", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const petId = req.params.id;
    const userId = req.user?.id;
    
    // Verificar que la mascota pertenece al usuario
    const isOwner = await verifyPetOwnership(parseInt(petId), userId);
    if (!isOwner) {
      return res.status(403).json({ 
        error: "No tienes permisos para modificar esta mascota" 
      });
    }
    
    await updatePetStatusToFound(parseInt(petId), false);
    res.json({ message: "Mascota marcada como encontrada" });
  } catch (error: any) {
    if (error.message === "Mascota no encontrada") {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }
    console.error("Error marcando mascota como encontrada:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Acceder a todos los reportes de mascotas perdidas de la zona
app.get("/pets", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    // Validar parámetros de geolocalización
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: "Se requieren parámetros de ubicación: lat y lng" 
      });
    }
    
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    
    // Validar que las coordenadas sean números válidos
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ 
        error: "Las coordenadas deben ser números válidos" 
      });
    }
    
    const pets = await getPetsNearby(latitude, longitude);
    res.json({
      message: `Se encontraron ${pets.length} mascotas perdidas cerca de la ubicación`,
      pets: pets
    });
  } catch (error: any) {
    console.error("Error obteniendo mascotas cercanas:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Eliminar un reporte de mascota perdida
app.delete("/pets/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const petId = req.params.id;
    const userId = req.user?.id;

    // Verificar que la mascota pertenece al usuario
    const isOwner = await verifyPetOwnership(parseInt(petId), userId);
    if (!isOwner) {
      return res.status(403).json({ error: "No tienes permisos para modificar esta mascota" });
    }

    await deleteLostPet(parseInt(petId));
    res.json({ message: "Reporte de mascota perdida eliminado exitosamente" });
  } catch (error: any) {
    console.error("Error eliminando reporte de mascota perdida:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Enviar un reporte de avistamiento de mascota perdida
app.post("/reports", async (req, res) => {
  try {
    const { petId, reporterPhone, reporterName, description } = req.body;
    await reportPetSighting(petId, reporterPhone, reporterName, description);
    await sendEmailNotification(petId, reporterPhone, reporterName, description);
    res.status(201).json({ message: "Reporte de avistamiento enviado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Catch-all para SPA - servir index.html para todas las rutas no-API
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

