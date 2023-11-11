const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");

const createCategoria = async (req, res) => {
  const { NombreCategoria, Descripcion } = req.body;

  connection.query(
    "INSERT INTO Categorias SET ?",
    {
      NombreCategoria: NombreCategoria,
      Descripcion: Descripcion,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json({
          message: "Categoría creada",
          CategoriaID: results.insertId,
        });
      }
    }
  );
};

const editCategoria = async (req, res) => {
  const { NombreCategoria, Descripcion } = req.body;
  const { CategoriaID } = req.params;

  if (!CategoriaID) {
    res.json({
      message: "Faltan datos",
    });
  }

  connection.query(
    `UPDATE Categorias SET NombreCategoria = ?, Descripcion = ? WHERE CategoriaID = ?`,
    [NombreCategoria, Descripcion, CategoriaID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json({
          message: "Categoría actualizada",
        });
      }
    }
  );
};

const getsCategoria = async (req, res) => {
  connection.query(`SELECT * FROM Categorias`, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
};

const getCategoria = async (req, res) => {
  const { CategoriaID } = req.params;

  connection.query(
    `SELECT * FROM Categorias WHERE CategoriaID = ?`,
    [CategoriaID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};

module.exports = {
  createCategoria,
  editCategoria,
  getsCategoria,
  getCategoria
};
