import express from "express";
import pool from "../dbConfig.js"; // Ruta relativa al archivo dbConfig.mjs

const router = express.Router();

// Endpoint para obtener todos los invoices
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("CALL sp_GetInvoices()");
    connection.release();
    if (rows.length > 0) {
      res.status(200).json({ invoice: rows[0] });
    } else {
      res.status(200).json({ invoice: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ statusCode: 500, message: "Error en el servidor" });
  }
});

router.get("/voucher-details", async (req, res) => {
  res.status(200).json({ user: [] });
});

router.post("/products-details", async (req, res) => {
  const { invoice_pk } = req.body;
  if (invoice_pk) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query("CALL sp_GetProductsDetails(?)", [
        invoice_pk,
      ]);
      connection.release();
      if (rows.length > 0) {
        res.status(200).json({ products_details: rows[0] });
      } else {
        res.status(200).json({ products_details: [] });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ statusCode: 500, message: "Error en el servidor" });
    }
  } else {
    res.status(401).send({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
});

router.post("/create-invoice", async (req, res) => {
  const { other_data, products_data, subTotal, discount, total } = req.body;

  if (other_data && products_data) {
    try {
      // Extraer solo las propiedades `product_pk` y `quantity` de cada objeto
      const simplified_products_data = products_data.map((product) => ({
        product_pk: product.product_pk,
        quantity: product.quantity,
      }));

      const voucher = "ruta desconocida";

      const connection = await pool.getConnection();
      const [invoice_created] = await connection.query(
        "INSERT INTO invoice (client_fk, date, subtotal, discount , total, voucher) VALUES ( ?, ?, ?, ?, ?, ?)",
        [
          other_data.client_pk,
          other_data.date,
          subTotal,
          discount,
          total,
          voucher,
        ]
      );
      connection.release();

      // Obtener el PK / id del nuevo invoice
      const newInvoicePK = invoice_created.insertId;

      try {
        // Insertar los detalles de la factura
        for (const product of simplified_products_data) {
          await connection.query(
            "INSERT INTO invoice_details (invoice_fk, product_fk, quantity) VALUES (?, ?, ?)",
            [newInvoicePK, product.product_pk, product.quantity]
          );
        }
        connection.release();

        res.status(200).send({ statusCode: 200, message: "Se ha creado exitosamente el invoice con sus productos" });

      } catch (error) {
        console.log("Error insertar los productos: ", error);
        res
          .status(500)
          .send({ statusCode: 500, message: "Error en el servidor" });
      }
    } catch (error) {
      console.log("Error insertar un nuevo invoice: ", error);
      res
        .status(500)
        .send({ statusCode: 500, message: "Error en el servidor" });
    }
  } else {
    res.status(401).send({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
});

export default router;
