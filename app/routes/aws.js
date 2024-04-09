import express from "express";
import s3 from "../aws/awsConfig.js";

const router = express.Router();

// Endpoint para obtener todos los clientes
router.get("/", (req, res) => {
  const params = {
    Bucket: "nombre_de_tu_bucket",
    Key: "ruta/de/la/imagen.jpg", // Cambia esto con la ruta de tu imagen en S3
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al obtener la imagen desde S3");
    }

    res.header("Content-Type", "image/jpeg"); // Cambia el tipo de contenido según el tipo de imagen que estés usando
    res.send(data.Body);
  });

  
});

export default router;
