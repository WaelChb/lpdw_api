import express from 'express';
import { PrismaClient } from '@prisma/client'
const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded());

// Pages statiques
app.use(express.static("publique"));

// Retourne tous les utilisateurs de la base
app.get("/devices", async (req, res) => {
  const allDevices = await prisma.device.findMany();
  res.status(200).json(allDevices);
});
//ajoute devices
app.post("/new_device", async (req,res)=>{
  const {nom, localisation}= req.body;
  const result = await prisma.device.create({
    data:{
      nom:nom,
      localisation: localisation,
    },

  });
  res.json(result);
})
//un devices avec l'id
app.get("/devices/:id", async (req, res) => {
  const {id} = req.params;
  const device = await prisma.device.findUnique({
    where:{ id : Number(id)},
  });
  res.status(200).json(device);
});
//supprimer device
app.delete("/device_delete/:id", async (req, res) => {
  const {id} = req.params;
  const device = await prisma.device.delete({
    where:{ id : Number(id)},
  });
  res.status(200).json(device);
});

//update

app.put("/device_update/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, localisation } = req.body;

    const updatedDevice = await prisma.device.update({
      where: { id: Number(id) },
      data: { nom, localisation },
    });
    res.status(200).json(updatedDevice);
  
});
// ici c'est la table data

app.get("/data/:id/:debut/:fin", async (req, res) => {
  const { id, debut, fin } = req.params;

  try {
    // Rechercher tous les enregistrements de données correspondant à l'ID de l'appareil
    // et à la plage de dates spécifiée
    const allData = await prisma.data.findMany({
      where: {
        deviceId: Number(id), // Convertir l'ID en nombre
        timestamp: { // Définir la plage de dates
          gte: new Date(debut), // Date de début
          lte: new Date(fin), // Date de fin
        },
      },
    });

    res.status(200).json(allData);
  } catch (error) {
    // Gérer les erreurs
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des données." });
  }
});


// Retourne tous les utilisateurs de la table data
app.get("/data", async (req, res) => {
  const allData = await prisma.data.findMany();
  res.status(200).json(allData);
});

//ajoute data
app.post("/new_data", async (req,res)=>{
  const {concentration, timestamp,deviceId}= req.body;
  
  const result = await prisma.data.create({
    data:{
      concentration: Number (concentration),
      timestamp: timestamp,
      deviceId:Number(deviceId),
    },

  });
  res.json(result);
})



// Lancement du serveur
app.listen(8080, () => {
  console.log("Serveur à l'écoute sur le port 8080");
});
