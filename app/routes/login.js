import express from "express";
import pool from "../dbConfig.js";
import argon2 from "argon2";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth/generateTokens.js";
const router = express.Router();

// Endpoint para el auth del usuario
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!!!email || !!!password) {
    return res
      .status(400)
      .send({ statusCode: 400, message: "Required fields" });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT client_pk, name, role_fk, password  FROM client WHERE email = ?",
      [email]
    );
    connection.release();
    if (rows.length > 0) {
      const data = rows[0];
      // Comparar el hash almacenado con la contraseña proporcionada
      try {
        const coincide = await argon2.verify(data.password, password);

        if (coincide) {
          const user = {
            client_pk: data.client_pk,
            name: data.name,
            role: data.role_fk,
          };
          //Generar accessToken y RefreshToken
          const accessToken = generateAccessToken(user);
          const refreshToken = generateRefreshToken(user);
          try {
            await connection.query("INSERT INTO token (token) VALUES (?)", [
              refreshToken,
            ]);
            connection.release();

            res.json({ user, accessToken, refreshToken }); // Envía la respuesta exitosa solo si hay datos
          } catch (error) {
            console.log(error);
            res
              .status(500)
              .send({ statusCode: 500, message: "Server error" });
          }
        } else {
          //"email y/o password incorrecto"
          res.status(401).send({
            statusCode: 401,
            message: "Incorrect email and/or password",
          });
        }
      } catch (error) {
        console.log("Ojo aqui puede a ver error: ", error);
        //"email y/o password incorrecto"
        res.status(401).send({
          statusCode: 401,
          message: "Incorrect email and/or password",
        });
      }
    } else {
      //"email y/o password incorrecto"
      res
        .status(401)
        .send({ statusCode: 401, message: "Incorrect email and/or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ statusCode: 500, message: "Server error" });
  }
});

export default router;
