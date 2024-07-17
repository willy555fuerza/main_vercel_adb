/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/ingresos_controller')


// Ruta para obtener todas las medidas
router.get('/ingreso',Users.getAll)
// Ruta para cambiar el estado de un usuario
router.put('/ingreso/:userId/state', Users.changeState);
// Ruta para crear un nuevo usuario
router.post('/create_ingreso', Users.createUser);
// Ruta para actualizar un usuario existente
router.put('/ingreso/:id_ingreso', Users.updateUser); 
// Ruta para eliminar un usuario
router.delete('/ingreso_delete/:userId', Users.deleteUser);
// Ruta para obtener los datos del cliente
/* router.post('/bustipo_ingreso',Users.buscliente)
// Ruta para obtener los datos del producto
router.post('/busmiembro',Users.busproducto) */
// Ruta para obtener los datos del producto
/* router.post('/geneingreso',Users.geneventa) */

 
module.exports = router 