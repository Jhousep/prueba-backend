import express from "express";
import pool from "../dbConfig.js"; // Ruta relativa al archivo dbConfig.mjs

const router = express.Router();

// Endpoint para obtener todos los clientes
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT client_pk, name, affiliation_date  FROM client"
    );
    connection.release();
    if (rows.length > 0) {
      res.status(200).json({user:rows});
    } else {
      res.status(200).json({ user: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ statusCode: 500, message: "Error en el servidor" });
  }
});

export default router;
