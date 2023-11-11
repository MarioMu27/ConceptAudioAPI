const { connection } = require("../services/bd");


const addCalificacionProducto = async (req, res) => {
    const {  id_producto, id_cliente } = req.body;

    if (!id_pedido || !id_producto ) {
        res.json({
            message: "Faltan datos",
        });
    } else {
        connection.query(
            `INSERT INTO CALIFICACION_PRODUCTO (id_pedido, id_producto) VALUES (?, ?)`,
            [id_producto, id_cliente],
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json({
                        message: "Calificacion agregada",
                    });
                }
            }
        );
    }
}

const getCalificacionProducto = async (req, res) => {
    const { id_producto } = req.body;

    if (!id_producto) {
        res.json({
            message: "Faltan datos",
        });
    } else {
        connection.query(
            `SELECT * FROM CALIFICACION_PRODUCTO WHERE ID_PRODUCTO = ?`,
            [id_producto],
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

const addCalificacionRepartidor = async (req, res) => {
    const { id_repartidor, id_cliente } = req.body;

    if (!id_cliente || !id_repartidor ) {
        res.json({
            message: "Faltan datos",
        });
    } else {
        connection.query(
            `INSERT INTO CALIFICACION_REPARTIDOR (id_repartidor, id_cliente) VALUES (?, ?)`,
            [ id_repartidor, id_cliente],
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json({
                        message: "Calificacion agregada",
                    });
                }
            }
        );
    }
}

const getCalificacionRepartidor = async (req, res) => {
    const { id_repartidor } = req.params;

    if (!id_repartidor) {
        res.json({
            message: "Faltan datos",
        });
    } else {
        connection.query(
            `SELECT * FROM CALIFICACION_REPARTIDOR WHERE id_repartidor = ?`,
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

const addCalificacionRestaurante = async (req, res) => {
    const { id_restaurante, id_cliente } = req.body;

    if (!id_cliente || !id_restaurante ) {
        res.json({
            message: "Faltan datos",
        });
    } else {
        connection.query(
            `INSERT INTO CALIFICACION_REPARTIDOR (id_restaurante, id_cliente) VALUES (?, ?)`,
            [ id_restaurante, id_cliente],
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json({
                        message: "Calificacion agregada",
                    });
                }
            }
        );
    }
}

const getCalificacionRestaurante = async (req, res) => {
    const { id_restaurante } = req.params;

    if (!id_restaurante) {
        res.json({
            message: "Faltan datos",
        });
    } else {
        connection.query(
            `SELECT * FROM CALIFICACION_REPARTIDOR WHERE id_restaurante = ?`,
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
    addCalificacionProducto,
    getCalificacionProducto,
    addCalificacionRepartidor,
    getCalificacionRepartidor,
    addCalificacionRestaurante,
    getCalificacionRestaurante
    
};
