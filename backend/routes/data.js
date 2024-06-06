const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data');



// wyświetla użytkowników o posającej nazwie

router.post('/people',dataController.people);

// wyświetla lub tworzy chat (pokój), pomiędzy użytkownikami
router.post('/checkRoom',dataController.checkRoom);

//informacje na temat chatu (pokoju) oraz użytkowników w nim zawartych oprócz klienta

router.post('/roomData',dataController.roomData);

// router.post('/receive',dataController.receive);

// router.post('/countNew',dataController.countNew); 

// pokazuje ostatnią wiadomość, ilość nie przeczytanych wiadomości,
// użytkowników w jednym pokoju poza klientem

router.post('/showAll',dataController.showAll);


module.exports = router;