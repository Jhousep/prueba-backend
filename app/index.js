import express from "express";
import loginRoutes from "./routes/login.js";
import signoutRoutes from "./routes/signOut.js";
import refreshToken from "./routes/refreshToken.js";
import userRoutes from "./routes/user.js";
import clientRoutes from "./routes/client.js";
import productRoutes from "./routes/product.js";
import invoiceRoutes from "./routes/invoice.js";
import dotenv from "dotenv";
import cors from "cors";
import authenticate from "./auth/authenticate.js"; //nos permite restringir el acceso a ciertos endpoints

//Levantando servidor
const app = express();
app.disable("x-powered-by"); // para de la cabecera del express, por tema de seguridad se quita

dotenv.config() //nos permite hacer uso de las variable de entorno de nuestra aplicación

app.use(cors())
// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas
app.use("/api/login", loginRoutes);
app.use("/api/signout", signoutRoutes);
app.use("/api/refresh-token", refreshToken);
app.use("/api/user", authenticate, userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/product", productRoutes);
app.use("/api/invoice", invoiceRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Hola mundo" });
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log("Servidor en el puerto", PORT);
});
