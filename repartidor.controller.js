const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { transporter } = require("../services/nodemailer.services");

const createRepartidor = async (req, res) => {
  const { nombre, apellido, telefono, email, password } = req.body;

  let passwordHash = await bcryptjs.hash(password, 10);

  const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (
    !nombre.trim().length ||
    !apellido.trim().length ||
    !email.trim().length ||
    !password.trim().length ||
    !nombre.trim().length
  ) {
    res.json({
      message: "Faltan datos",
      auth: false,
      token: null,
    });
  } else if (!emailregex.test(email)) {
    res.json({
      message: "El correo electronico no es valido",
      auth: false,
      token: null,
    });
  } else {
    connection.query(
      "SELECT * FROM REPARTIDORES WHERE CORREO = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          if (results.length > 0) {
            res.json({
              message: "Este repartidor ya esta registrado",
              auth: false,
              token: null,
            });
          } else if (!passregex.test(password)) {
            res.json({
              message: "La contraseña no es valida",
              auth: false,
              token: null,
            });
          } else {
            connection.query(
              "INSERT INTO REPARTIDORES SET ?",
              {
                NOMBRE: nombre,
                APELLIDO: apellido,
                TELEFONO: telefono,
                CORREO: email,
                PASSWORD: passwordHash,
              },
              async (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  try {
                    const mail = await transporter.sendMail({
                      from: process.env.EMAIL,
                      to: email,
                      subject: "Gracias por su registro",
                      html: `<h1>Bienvenid@ ${nombre}</h1>
                                                <p>HOLI</p>`,
                    });
                    console.log("Email enviado");
                  } catch (error) {
                    console.log(error);
                  }
                  res.json({
                    message: "Se ha enviado un correo de confirmacion",
                    auth: true,
                    token: jwt.sign({ email: email }, process.env.SECRET, {
                      expiresIn: 60 * 60 * 24 * 30,
                    }),
                  });
                }
              }
            );
          }
        }
      }
    );
  }
};

const editRepartidor = async (req, res) => {
  const { nombre, apellido, telefono, foto } = req.body;
  const { id_repartidor } = req.params;

  if (!id_cliente) {
    res.json({
      message: "Faltan datos",
    });
  }

  connection.query(
    `UPDATE REPARTIDORES SET NOMBRE = ?, APELLIDO = ?, TELEFONO = ?, FOTO = ? WHERE ID = ?`,
    [nombre, apellido, telefono, foto, id_repartidor],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json({
          message: "Cliente actualizado",
        });
      }
    }
  );
};

const getRepartidor = async (req, res) => {
  const { id_repartidor } = req.params;

  if (!id_cliente) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `SELECT * FROM REPARTIDORES WHERE ID = ?`,
      [id_repartidor],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json(results);
        }
      }
    );
  }
};

const createUbicacionRepatidor = async (req, res) => {
  const {id_repartidor, departamento, municipio, zona, direccion, ubicacion} = req.body;
  if (!id_repartidor || !departamento || !municipio || !zona || !direccion || !ubicacion) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `INSERT INTO UBICACION_REPARTIDOR SET ?`,
      {
        ID_REPARTIDOR: id_repartidor,
        DEPARTAMENTO: departamento,
        MUNICIPIO: municipio,
        ZONA: zona,
        DIRECCION: direccion,
        UBICACION: ubicacion
      },
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json({
            message: "Ubicacion creada",
          });
        }
      }
    );
  }
}

const editUbicacionRepartidor = async (req, res) => {
  const {id_repartidor, departamento, municipio, zona, direccion, ubicacion} = req.body;
  if (!id_repartidor || !departamento || !municipio || !zona || !direccion || !ubicacion) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `UPDATE UBICACION_REPARTIDOR SET DEPARTAMENTO = ?, MUNICIPIO = ?, ZONA = ?, DIRECCION = ?, UBICACION = ? WHERE ID_CLIENTE = ?`,
      [departamento, municipio, zona, direccion, ubicacion, id_repartidor],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json({
            message: "Ubicacion actualizada",
          });
        }
      }
    );
  }
}

const allUbicacionRepartidor = async (req, res) => {
  const {id_repartidor} = req.params;
  if (!id_repartidor) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `SELECT * FROM UBICACION_REPARTIDOR WHERE ID_REPARTIDOR = ?`,
      [id_repartidor],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json(results);
        }
      }
    );
  }
}

const getUbicacionRepartidor = async (req, res) => {
  const {id_repartidor} = req.params;
  if (!id_repartidor) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `SELECT * FROM UBICACION_REPARTIDOR WHERE ID_REPARTIDOR = ? LIMIT 3`,
      [id_repartidor],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json(results);
        }
      }
    );
  }
}

module.exports = {
  createRepartidor,
  editRepartidor,
  getRepartidor,
  createUbicacionRepatidor,
  editUbicacionRepartidor,
  allUbicacionRepartidor,
  getUbicacionRepartidor
};
