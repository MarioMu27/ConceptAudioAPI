const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");

// Crear un producto
const createProducto = async (req, res) => {
  const { Nombre, Descripcion, Precio, CantidadEnStock } = req.body;

  if (!Nombre || !Descripcion || !Precio || !CantidadEnStock) {
    return res.status(400).json({
      message: "Faltan datos",
    });
  }

  connection.query(
    "INSERT INTO Productos (Nombre, Descripcion, Precio, CantidadEnStock) VALUES (?, ?, ?, ?)",
    [Nombre, Descripcion, Precio, CantidadEnStock],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error al crear el producto",
        });
      }
      return res.status(201).json({
        message: "Producto creado exitosamente",
      });
    }
  );
};

// Editar un producto
const editProducto = async (req, res) => {
  const { Nombre, Descripcion, Precio, CantidadEnStock } = req.body;
  const { ProductoID } = req.params;

  if (!ProductoID) {
    return res.status(400).json({
      message: "Faltan datos",
    });
  }

  connection.query(
    "UPDATE Productos SET Nombre = ?, Descripcion = ?, Precio = ?, CantidadEnStock = ? WHERE CategoriaID = ?",
    [Nombre, Descripcion, Precio, CantidadEnStock, ProductoID],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error al actualizar el producto",
        });
      }
      return res.status(200).json({
        message: "Producto actualizado exitosamente",
      });
    }
  );
};

// Obtener todos los productos
const getsProductos = async (req, res) => {
  connection.query("SELECT * FROM Productos", (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error al obtener los productos",
      });
    }
    return res.status(200).json(results);
  });
};

// Obtener un producto por su ID
const getProducto = async (req, res) => {
  const { ProductoID } = req.params;

  if (!ProductoID) {
    return res.status(400).json({
      message: "Faltan datos",
    });
  }

  connection.query(
    "SELECT * FROM Productos WHERE ProductoID",
    [ProductoID],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error al obtener el producto",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          message: "Producto no encontrado",
        });
      }
      return res.status(200).json(results[0]);
    }
  );
};

module.exports = {
  createProducto,
  editProducto,
  getsProductos,
  getProducto
};
