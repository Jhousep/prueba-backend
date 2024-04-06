import express from "express";
import pool from "../dbConfig.js"; // Ruta relativa al archivo dbConfig.mjs
import getTokenFromHeader from "../auth/getTokenFromHeader.js";
const router = express.Router();

// Endpoint para obtener todos los clientes
router.delete("/", async (req, res) => {
  try {
    const refreshToken = getTokenFromHeader(req.headers);
    if (refreshToken) {
      try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
          "DELETE FROM token WHERE token = ?",
          [refreshToken]
        );
        connection.release();
        res.status(200).send({ statusCode: 200, message: "Token deleted" });

      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ statusCode: 500, message: "Error en el servidor" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ statusCode: 500, message: "Error en el servidor" });
  }
});

export default router;
