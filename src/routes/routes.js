const express = require('express');
const router = express.Router();
const notesController = require('../Controllers/notesController');


//Book 
router.post("/createNotes" ,notesController.createNotes)
router.get("/getNotes",notesController.getNotes)

router.put("/updateNotes/:notesId",notesController.updateNotes)
router.put("/deleteNotes/:notesId",notesController.deleteNotes)


module.exports = router;
