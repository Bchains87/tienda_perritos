const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

const {
  DB_HOST = "db",
  DB_USER = "alumno",
  DB_PASSWORD = "alumno123",
  DB_NAME = "tienda_perritos",
  DB_PORT = 5432,
} = process.env;

app.use(cors());
app.use(express.json());

let pool;

// Inicializar pool de conexiones
async function initDb() {
  try {
    pool = new Pool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      max: 10,
    });
    console.log("Pool de conexiones PostgreSQL inicializado.");
  } catch (err) {
    console.error("Error al inicializar pool de PostgreSQL:", err);
  }
}

// Helper para manejar errores
function handleError(res, error, message = "Error interno del servidor") {
  console.error(error);
  res.status(500).json({ message });
}

// Obtener todos los productos
app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nombre, descripcion, precio, stock FROM productos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "No se pudieron obtener los productos.");
  }
});

// Obtener un producto por ID
app.get("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT id, nombre, descripcion, precio, stock FROM productos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "No se pudo obtener el producto.");
  }
});

// Crear un nuevo producto
app.post("/api/productos", async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ message: "Nombre, precio y stock son obligatorios." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4) RETURNING id, nombre, descripcion, precio, stock",
      [nombre, descripcion || null, precio, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "No se pudo crear el producto.");
  }
});

// Actualizar un producto
app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ message: "Nombre, precio y stock son obligatorios." });
  }

  try {
    const result = await pool.query(
      "UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4 WHERE id = $5 RETURNING id, nombre, descripcion, precio, stock",
      [nombre, descripcion || null, precio, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "No se pudo actualizar el producto.");
  }
});

// Eliminar un producto
app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM productos WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    res.json({ message: "Producto eliminado correctamente." });
  } catch (err) {
    handleError(res, err, "No se pudo eliminar el producto.");
  }
});

// Endpoint de salud
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend de tienda de perritos en ejecución." });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
  await initDb();
});
