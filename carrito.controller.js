const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");

const createCarrito = async (req, res) => {
    const { id_producto, token } = req.body;
    const cantidad = 1;
    const estado = 1;

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                message: "Token inválido",
                auth: false,
                token: null,
            });
        }

        const id_usuario = decoded.id;

        // Insertar el producto en el carrito
        connection.query(
            "INSERT INTO ProductosEnCarrito (CarritoID, ProductoID, Cantidad) VALUES (?, ?, ?)",
            [id_usuario, id_producto, cantidad],
            async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json({
                        message: "Producto agregado al carrito",
                    });
                }
            }
        );
    });
};

const editCarrito = async (req, res) => {
    const { id_producto, cantidad, estado } = req.body;
    const { id_carrito } = req.params;

    if (!id_carrito) {
        res.json({
            message: "Faltan datos",
        });
    }

    // Actualizar el producto en el carrito
    connection.query(
        `UPDATE ProductosEnCarrito SET ProductoID = ?, Cantidad = ? WHERE ProductoEnCarritoID = ?`,
        [id_producto, cantidad, id_carrito],
        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.json({
                    message: "Producto en el carrito actualizado",
                });
            }
        }
    );
};

const deleteCarrito = async (req, res) => {
    const { id_carrito } = req.params;

    // Eliminar el producto del carrito
    connection.query(
        `DELETE FROM ProductosEnCarrito WHERE ProductoEnCarritoID = ?`,
        [id_carrito],
        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.json({
                    message: "Producto eliminado del carrito",
                });
            }
        }
    );
};

const getCarrito = async (req, res) => {
    const { token } = req.body;

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                message: "Token inválido",
                auth: false,
                token: null,
            });
        }

        // Obtener los productos en el carrito
        connection.query(
            `SELECT pc.ProductoEnCarritoID, pc.CarritoID, pc.ProductoID, p.Nombre, p.Precio, pc.Cantidad, (p.Precio * pc.Cantidad) AS Total
            FROM ProductosEnCarrito pc
            INNER JOIN Productos p ON pc.ProductoID = p.ProductoID
            WHERE pc.CarritoID = ? AND pc.Estado = 1`,
            [decoded.id],
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json(results);
                }
            }
        );
    });
};

module.exports = {
    createCarrito,
    editCarrito,
    deleteCarrito,
    getCarrito
};
