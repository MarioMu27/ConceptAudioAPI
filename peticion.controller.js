const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");


const getsPedido = async (req, res) => {
    
    res.json({
        message: "Sesion Abierta jiji",
       
      });
      }
 

  module.exports = {

    getsPedido,

  };
  