import sequelize from "./models/connection/connection"
import { Op } from "sequelize"
import express, { Request, Response, NextFunction } from "express"
import {User, Pet, Report} from "./models/models"
import { client } from "./lib/algolia"
import cors from "cors"


const app = express();
const PORT = process.env.PORT || 3000;


(async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

app.use(express.json())
const corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions))

// //Funcion auxiliar para formatear el body para Algolia
// function bodyToIndex(body:any){
//   const res : any = {};

//   if(body.nombre){
//     res.nombre = body.nombre
//   }
//   if(body.rubro){
//     res.rubro = body.rubro
//   }
//   if(body.lat && body.lng){
//     res._geoloc = {
//       lat: body.lat,
//       lng: body.lng
//     }
//   }  
//   return res
// }

// //Crear un nuevo comercio
// app.post("/comercios", async (req, res)=> {
//   const newComercio = await Comercio.create(req.body)

//   const algoliaRes = await client.saveObjects({
//     indexName: 'dev_COMERCIOS',
//     objects: [
//       {
//         objectID: newComercio.get("id"),
//         nombre: newComercio.get("nombre"),
//         rubro: newComercio.get("rubro"),
//         _geoloc: {
//           lat: newComercio.get("lat"),
//           lng: newComercio.get("lng")
//         }
//       }
//     ]
//   });

//   res.json(newComercio)
// })


// //Obtener todos los comercios
// app.get("/comercios", async (req, res)=> {
//   const allComercios = await Comercio.findAll({})
//   res.json(allComercios)
// })

// //Obtener un comercio por su ID
// app.get("/comercios/:id", async (req, res) => {
//   const comercio = await Comercio.findByPk(req.params.id)
//   res.json(comercio)
// })

// //Actualizar un comercio
// app.put("/comercios/:id", async (req, res) => {
//   const updatedComercio = Comercio.update(req.body, {
//     where: {
//       id: req.params.id
//     }
//   })

//   const indexItem = bodyToIndex(req.body)

//   const algoliaRes = await client.partialUpdateObjects({
//     indexName: 'dev_COMERCIOS',
//     objects: [
//       {
//         objectID: req.params.id,
//         nombre: indexItem.nombre,
//         rubro: indexItem.rubro,
//         _geoloc: indexItem._geoloc
//       }
//     ],
//     createIfNotExists: false
//   });

//   res.json(updatedComercio)
// })


// //Obtener los comercios cerca de una ubicacion geografica
// app.get("/comercios-cerca-de", async (req, res) => {
  
//   const {lat, lng} = req.query

//   const algoliaRes = await client.searchSingleIndex({ 
//     indexName: 'dev_COMERCIOS',
//     searchParams: {     
//       aroundLatLng: `${lat}, ${lng}`,
//       aroundRadius: 10000,
//     }
//   })

//   const results = algoliaRes.hits

//   res.json(results)
// })


