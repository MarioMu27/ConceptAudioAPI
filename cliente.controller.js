const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { transporter } = require("../services/nodemailer.services");

const createCliente = async (req, res) => {
  
  const { nombre, telefono, email, password } = req.body;

  let passwordHash = await bcryptjs.hash(password, 10);

  const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (
    !nombre.trim().length ||
    !telefono.trim().length ||
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
      "SELECT * FROM Clientes WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          if (results.length > 0) {
            res.json({
              message: " usuario registrado",
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
              "INSERT INTO Clientes SET ?",
              {
                Nombre: nombre,                
                Telefono: telefono,
                email: email,
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
                    token: jwt.sign({ CorreoElectronico: CorreoElectronico }, process.env.SECRET, {
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

const editCliente = async (req, res) => {
  const {token, nombre,  telefono } = req.body;

  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        message: "Token inválido",
        auth: false,
        token: null,
      });
    }

    id_cliente = decoded.id;

  connection.query(
    `UPDATE Clientes SET Nombre = ?,  Telefono = ? WHERE ClienteID = ?`,
    [nombre,  telefono, id_cliente],
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
}
);
}



const getCliente = async (req, res) => {
  const {token} = req.body;

  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        message: "Token inválido",
        auth: false,
        token: null,
      });
    }

    id_usuario = decoded.id;

    connection.query(
      `SELECT * FROM Clientes WHERE ClienteID = ?`,
      [id_usuario],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json(results);
        }
      }
    );
  }
  );
}

const createUbicacionCliente = async (req, res) => {
  const {token, departamento, municipio, zona, direccion, ubicacion} = req.body;
  if (!token || !departamento || !municipio || !zona || !direccion || !ubicacion) {
    res.json({
      message: "Faltan datos",
    });
  } else {

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: "Token inválido",
          auth: false,
          token: null,
        });
      }
  
      id_cliente = decoded.id;

    connection.query(
      `INSERT INTO UBICACION_CLIENTES SET ?`,
      {
        ID_CLIENTES: id_cliente,
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
  );
  }
}

const editUbicacionCliente = async (req, res) => {
  const {token, departamento, municipio, zona, direccion, ubicacion} = req.body;
  if (!token || !departamento || !municipio || !zona || !direccion || !ubicacion) {
    res.json({
      message: "Faltan datos",
    });
  } else {

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: "Token inválido",
          auth: false,
          token: null,
        });
      }
  
      id_cliente = decoded.id;

    connection.query(
      `UPDATE UBICACION_CLIENTES SET departamento = ?, municipio = ?, zona = ?, direccion = ?, ubicacion = ? WHERE ClienteID = ?`,
      [departamento, municipio, zona, direccion, ubicacion, id_cliente],
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
  );
  }
}

const allUbicacionCliente = async (req, res) => {
  const {id_cliente} = req.params;
  if (!id_cliente) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      `SELECT * FROM UBICACION_CLIENTES WHERE ClienteID = ?`,
      [id_cliente],
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

const getUbicacionCliente = async (req, res) => {
  const {token} = req.body;

  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        message: "Token inválido",
        auth: false,
        token: null,
      });
    }
    
    id_usuario = decoded.id;

    connection.query(
      `SELECT * FROM UBICACION_CLIENTES WHERE ClienteID = ? `,
      [id_usuario],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json(results);
        }
      }
    );
  }
  );
}


module.exports = {
  createCliente,
  editCliente,
  getCliente,
  createUbicacionCliente,
  editUbicacionCliente,
  allUbicacionCliente,
  getUbicacionCliente
  
};

