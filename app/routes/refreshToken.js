import express from "express";
import getTokenFromHeader from "../auth/getTokenFromHeader.js";
import pool from "../dbConfig.js"; // Ruta relativa al archivo dbConfig.mjs
import { verifyAccessToken, verifyRefreshToken } from "../auth/verifyToken.js";
import { generateAccessToken } from "../auth/generateTokens.js";

const router = express.Router();

// Endpoint para obtener todos los clientes
router.post("/", async (req, res) => {
  const refreshToken = getTokenFromHeader(req.headers);

  if (refreshToken) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM token WHERE token = ?",
        [refreshToken]
      );

      connection.release();
      if (rows.length > 0) {
        const data = rows[0];
        const payload = verifyRefreshToken(data.token)
        if (payload) {
          const accessToken = generateAccessToken(payload);
          return res
            .status(200)
            .send({ statusCode: 200, accessToken: accessToken  });
        } else {
          return res
            .status(401)
            .send({ statusCode: 401, message: "Unauthorized" });
        }
      } else {
        return res
          .status(401)
          .send({ statusCode: 401, message: "Unauthorized" });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(401).send({ statusCode: 401, message: "Unauthorized" });
    }
  } else {
    return res.status(401).send({ statusCode: 401, message: "Unauthorized" });
  }
});

export default router;
