const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");

const createPedido = async (req, res) => {
  const { token, total, detalles } = req.body;
  const id_repartidor = 1;
  const estadoPedido = "Pendiente";
  const fecha = new Date();

  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        message: "Token inválido",
        auth: false,
        token: null,
      });
    }

    const id_cliente = decoded.id;

    connection.beginTransaction((err) => {
      if (err) {
        console.log(err);
        return res.json({
          message: "Error al crear el pedido",
          auth: false,
          token: null,
        });
      }

      connection.query(
        "INSERT INTO Ventas (ClienteID, MetodoPagoID, TotalVenta, FechaVenta) VALUES (?, ?, ?, ?)",
        [id_cliente, null, total, fecha],
        (error, results) => {
          if (error) {
            connection.rollback();
            console.log(error);
            return res.json({
              message: "Error al crear la venta",
              auth: false,
              token: null,
            });
          }

          const id_pedido = results.insertId;

          const detalleValues = detalles.map((detalle) => [
            id_pedido,
            detalle.id_producto,
            detalle.cantidad,
            detalle.precio,
          ]);

          connection.query(
            "INSERT INTO DetallesVenta (VentaID, ProductoID, Cantidad, PrecioUnitario) VALUES ?",
            [detalleValues],
            (error, results) => {
              if (error) {
                connection.rollback();
                console.log(error);
                return res.json({
                  message: "Error al agregar detalles a la venta",
                  auth: false,
                  token: null,
                });
              }

              connection.query(
                "INSERT INTO TrackingVentas (VentaID, Estado) VALUES (?, ?)",
                [id_pedido, estadoPedido],
                (error, results) => {
                  if (error) {
                    connection.rollback();
                    console.log(error);
                    return res.json({
                      message: "Error al crear el tracking del pedido",
                      auth: false,
                      token: null,
                    });
                  }

                  connection.commit((err) => {
                    if (err) {
                      connection.rollback();
                      console.log(err);
                      return res.json({
                        message: "Error al confirmar la transacción",
                        auth: false,
                        token: null,
                      });
                    }

                    res.json({
                      message: "Pedido creado con detalles y tracking",
                      auth: true,
                      token: null,
                    });

                    connection.query(
                      "DELETE FROM CARRITO WHERE ID_CLIENTE = ?",
                      [id_cliente],
                      (error, results) => {
                        if (error) {
                          console.log(error);
                          return res.json({
                            message: "Error al eliminar el carrito",
                            auth: false,
                            token: null,
                          });
                        }
                      }
                    );
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};

module.exports = {
  createPedido,
};

