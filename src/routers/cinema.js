const express = require("express");
const {
    getScreen,
    addTicket
} = require('../controllers/cinema')

const router = express.Router();

router.get('/screen/:id', getScreen)
router.post('/ticket', addTicket)

module.exports = router;