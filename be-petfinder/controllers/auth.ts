import { Auth } from "../models/auth.js";
import { User } from "../models/models.js";
import * as crypto from 'crypto';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config({ path: "../.env" });

// Interface para extender Request con información del usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: any;
}

const SECRET_KEY = process.env.SECRET_KEY;

// Verificar que la SECRET_KEY esté definida
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY no está definida en las variables de entorno");
}

export function hashPassword (password: string) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function createAuthUser(email: string, password: string, name: string) {
  
  const [user, created] = await User.findOrCreate ({
    where: { email: email},
    defaults: {
      email: email,
      name: name
    }
  })

    const [authUser, authCreated] = await Auth.findOrCreate ({
    where: { email: email},
    defaults: {
      email: email,
      password: hashPassword(password),
      userId: user.get("id")
    }
  })
  
  return {user, created, authUser, authCreated};
};

export async function authenticateUser(email: string, password: string) {
  try {
    console.log("Intentando autenticar usuario:", email);
    console.log("JWT disponible:", typeof sign === 'function' ? 'SÍ' : 'NO');
    console.log("SECRET_KEY definida:", SECRET_KEY ? 'SÍ' : 'NO');
    
    const authUser = await Auth.findOne({
      where: { 
        email: email, 
        password: hashPassword(password)
      }
    });

    if (!authUser) {
      throw new Error("Email o contraseña inválidos");
    }

    const userId = authUser.get("id");
    
    // Generar token con información adicional y expiración
    const token = sign(
      { 
        id: userId,
        email: authUser.get("email")
      }, 
      SECRET_KEY as string,
      { 
        expiresIn: '24h' // Token expira en 24 horas
      }
    );
    
    console.log("Token generado exitosamente");
    return { token, userId };
    
  } catch (error) {
    console.error("Error en authenticateUser:", error);
    throw error;
  }
};

// Función auxiliar para verificar que el usuario accede solo a sus propios datos
export function checkUserOwnership(authenticatedUserId: number, requestedUserId: string): boolean {
  return authenticatedUserId.toString() === requestedUserId;
}

// Middleware combinado: verifica token Y autorización para endpoints de usuario específico
export function verifyTokenAndOwnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Primero verificar el token
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "Formato de token inválido. Use 'Bearer <token>'" });
    }

    const decoded = verify(token, SECRET_KEY as string);
    req.user = decoded;

    // Luego verificar autorización (solo para endpoints con :id en params)
    const userId = req.params.id;
    if (userId && !checkUserOwnership(req.user.id, userId)) {
      return res.status(403).json({ 
        error: "Acceso denegado. Solo puedes acceder a tus propios datos." 
      });
    }

    next();
    
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// Middleware de Express para verificar token desde Authorization header
export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // Verificar que el header tenga el formato "Bearer token"
    const token = authHeader.split(' ')[1]; // Obtener la parte después de "Bearer "
    
    if (!token) {
      return res.status(401).json({ error: "Formato de token inválido. Use 'Bearer <token>'" });
    }

    // Verificar el token
    const decoded = verify(token, SECRET_KEY as string);
    
    // Agregar la información del usuario decodificada al request
    req.user = decoded;
    
    // Continuar al siguiente middleware/ruta
    next();
    
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}