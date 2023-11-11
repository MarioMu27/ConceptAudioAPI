const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");

const getTracking = async (req, res) => {
    const { token } = req.body;

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                message: "Token inválido",
                auth: false,
                token: null,
            });
        }

        const id_cliente = decoded.id;

        connection.query(
            `SELECT
            TrackingVentas.Estado,
            Ventas.VentaID,
            Ventas.TotalVenta,
            DATE_FORMAT(DATE_ADD(Ventas.FechaVenta, INTERVAL 45 MINUTE), '%Y-%m-%d %H:%i') AS HORA,
            GROUP_CONCAT(Productos.Nombre SEPARATOR ', ') AS PRODUCTOS,
            SUM(DetallesVenta.Cantidad * DetallesVenta.PrecioUnitario) AS TOTAL_DETALLE
          FROM Ventas
          INNER JOIN DetallesVenta ON Ventas.VentaID = DetallesVenta.VentaID
          INNER JOIN Productos ON DetallesVenta.ProductoID = Productos.ProductoID
          INNER JOIN TrackingVentas ON Ventas.VentaID = TrackingVentas.VentaID
          WHERE Ventas.ClienteID = ? AND (TrackingVentas.Estado = 'Pendiente' OR TrackingVentas.Estado = 'En camino')
          GROUP BY Ventas.VentaID;
            `,
            [id_cliente],
            (error, results) => {
                if (error) {
                    console.log(error);
                    return res.json({
                        message: "Error al obtener el pedido",
                        auth: false,
                        token: null,
                    });
                }

                res.json(results);
            }
        );
    });
}

const getPedidosFinalizados = async (req, res) => {
    const { token } = req.body;

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                message: "Token inválido",
                auth: false,
                token: null,
            });
        }

        const id_cliente = decoded.id;

        connection.query(
            `SELECT
            Ventas.VentaID,
            TrackingVentas.Estado,
            Ventas.TotalVenta AS TOTAL_PEDIDO,
            DATE_FORMAT(Ventas.FechaVenta, '%Y-%m-%d') AS FECHA_PEDIDO,
            GROUP_CONCAT(
              CONCAT(Productos.Nombre, ' (', DetallesVenta.Cantidad, 'x', DetallesVenta.PrecioUnitario, ') = ',
              (DetallesVenta.Cantidad * DetallesVenta.PrecioUnitario)) SEPARATOR ' <br> ') AS DETALLE_PRODUCTOS
          FROM Ventas
          INNER JOIN DetallesVenta ON Ventas.VentaID = DetallesVenta.VentaID
          INNER JOIN Productos ON DetallesVenta.ProductoID = Productos.ProductoID
          INNER JOIN TrackingVentas ON Ventas.VentaID = TrackingVentas.VentaID
          WHERE Ventas.ClienteID = ? AND TrackingVentas.Estado = 'Finalizado'
          GROUP BY Ventas.VentaID, TrackingVentas.Estado, Ventas.TotalVenta, Ventas.FechaVenta;
            `,
            [id_cliente],
            (error, results) => {
                if (error) {
                    console.log(error);
                    return res.json({
                        message: "Error al obtener el pedido",
                        auth: false,
                        token: null,
                    });
                }

                res.json(results);
            }
        );
    });
}

const updatePedidos = async (req, res) => {
    const { VentaID, Estado } = req.body;

    let estado = 'Pendiente';
    if (Estado === 'Pendiente') {
        estado = 'En camino';
    } else if (Estado === 'En camino') {
        estado = 'Finalizado';
    }

    connection.query(
        `UPDATE TrackingVentas SET Estado = ? WHERE VentaID = ?`,
        [estado, VentaID],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.json({
                    message: "Error al actualizar el pedido",
                    auth: false,
                    token: null,
                });
            }

            res.json(results);
        }
    );
}

const getAllTracking = async (req, res) => {
    connection.query(
        `SELECT
        TrackingVentas.Estado,
        Ventas.VentaID,
        Ventas.TotalVenta,
        DATE_FORMAT(DATE_ADD(Ventas.FechaVenta, INTERVAL 45 MINUTE), '%Y-%m-%d %H:%i') AS HORA,
        GROUP_CONCAT(Productos.Nombre SEPARATOR ', ') AS PRODUCTOS,
        SUM(DetallesVenta.Cantidad * DetallesVenta.PrecioUnitario) AS TOTAL_DETALLE
      FROM Ventas
      INNER JOIN DetallesVenta ON Ventas.VentaID = DetallesVenta.VentaID
      INNER JOIN Productos ON DetallesVenta.ProductoID = Productos.ProductoID
      INNER JOIN TrackingVentas ON Ventas.VentaID = TrackingVentas.VentaID
      WHERE TrackingVentas.Estado = 'Pendiente' OR TrackingVentas.Estado = 'En camino'
      GROUP BY Ventas.VentaID;
        `,
        (error, results) => {
            if (error) {
                console.log(error);
                return res.json({
                    message: "Error al obtener el pedido",
                    auth: false,
                    token: null,
                });
            }

            res.json(results);
        }
    );
}

module.exports = {
    getTracking,
    getPedidosFinalizados,
    updatePedidos,
    getAllTracking
};
