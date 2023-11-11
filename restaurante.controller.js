const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { transporter } = require("../services/nodemailer.services");

const createRestaurante = async (req, res) => {
  const { nombre, horario, telefono, email, password } = req.body;

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
      "SELECT * FROM RESTAURANTE WHERE CORREO = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          if (results.length > 0) {
            res.json({
              message: "Este restaurante ya esta registrado",
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
              "INSERT INTO RESTAURANTE SET ?",
              {
                NOMBRE: nombre,
                TELEFONO: telefono,
                CORREO: email,
                PASSWORD: passwordHash,
                HORARIO: horario,
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

const editRestaurante = async (req, res) => {
  const { nombre, apellido, telefono, foto } = req.body;
  const { id_restaurante } = req.params;

  if (!id_cliente) {
    res.json({
      message: "Faltan datos",
    });
  }

  connection.query(
    `UPDATE RESTAURANTE SET NOMBRE = ?, APELLIDO = ?, TELEFONO = ?, FOTO = ? WHERE ID = ?`,
    [nombre, apellido, telefono, foto, id_restaurante],
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

const getRestaurante = async (req, res) => {
  const { id_restaurante } = req.params;

  if (!id_restaurante) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `SELECT * FROM RESTAURANTE WHERE ID = ?`,
      [id_restaurante],
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

const getsRestaurante = async (req, res) => {
  connection.query(`SELECT * FROM RESTAURANTE`, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
};


const createUbicacionRestaurante = async (req, res) => {
  const {id_restaurante, departamento, municipio, zona, direccion, ubicacion} = req.body;
  if (!id_restaurante || !departamento || !municipio || !zona || !direccion || !ubicacion) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `INSERT INTO UBICACION_RESTAURANTE SET ?`,
      {
        ID_RESTAURANTE: id_restaurante,
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

const editUbicacionRestaurante = async (req, res) => {
  const {id_restaurante, departamento, municipio, zona, direccion, ubicacion} = req.body;
  if (!id_restaurante || !departamento || !municipio || !zona || !direccion || !ubicacion) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `UPDATE UBICACION_RESTAURANTE SET DEPARTAMENTO = ?, MUNICIPIO = ?, ZONA = ?, DIRECCION = ?, UBICACION = ? WHERE ID_RESTAURANTE = ?`,
      [departamento, municipio, zona, direccion, ubicacion, id_restaurante],
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

const allUbicacionRestaurante = async (req, res) => {
  const {id_restaurante} = req.params;
  if (!id_restaurante) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `SELECT * FROM UBICACION_RESTAURANTE WHERE ID_RESTAURANTE = ?`,
      [id_restaurante],
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

const getUbicacionRestaurante = async (req, res) => {
  const {id_restaurante} = req.params;
  if (!id_restaurante) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `SELECT * FROM UBICACION_RESTAURANTE WHERE ID_RESTAURANTE = ? LIMIT 3`,
      [id_restaurante],
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
  createRestaurante,
  editRestaurante,
  getRestaurante,
  createUbicacionRestaurante,
  editUbicacionRestaurante,
  allUbicacionRestaurante,
  getUbicacionRestaurante,
  getsRestaurante
};
