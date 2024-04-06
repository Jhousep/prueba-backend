import express from "express";

const router = express.Router();

// Endpoint para obtener todos los clientes
router.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    user: req.user,
  });
});

export default router;
