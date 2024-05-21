
const bookModel = require("../models/notesModel")
let  moment = require('moment');
const mongoose = require('mongoose');
const notesModel = require("../models/notesModel");


const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true

}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}


const createNotes = async function (req, res) {
    try {
        data = req.body
        const {
            title,
            content,
            ISBN,
            category,
            reviews,
            deletedAt,
            isDeleted,
            releasedAt
        } = data
        
        //if(req.body.userId==req.decodedToken.userId)

        if (!isValidRequestBody(data)){
            return res.status(400).send({ status: false, msg: "please enter some data" })
        }
        if(!isValid(title)){
            return res.status(400).send({status:false, msg:"title  is required" })
        }
        const duplicateTitle = await bookModel.findOne({title:data.title})
       
        if(duplicateTitle){
            return res.status(400).send({status:false, msg:"duplicate key title"})
        }
       
        const duplicateISBN = await bookModel.findOne({ISBN:data.ISBN})
        if
        (duplicateISBN){
            return res.status(400).send({status:false, msg:"duplicate key ISBN"})
        }

        if(!isValid(releasedAt)){
            return res.status(400).send({status:false, msg:"releasedAt is required" })
        }
        //validations
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
            return res.status(400).send({ status: false, message: ' date should be "YYYY-MM-DD\" ' })
        }
        
        if(isDeleted==true){
        (/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(isDeleted)) 
            return res.status(400).send({ status: false, data: deletedAt })
        }
        const isValid1 = function(value){
            if(typeof value == undefined||value==null||value.length==0)
            return false
            if(typeof value=='string'&& value.trim().length===0) return false
            if(typeof value==='number'&&'array') return true
        }
        if(!isValid1(reviews)){
            return res.status(400).send({status:false,msg:"please enter in number"})
        }

        let saveData = await notesModel.create(data);
        res.status(201).send({ status: true, data: saveData, msg: "succefully Created" })
    }

catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
}
}
//2
const getNotes = async function (req, res) {
    try {
        // Extract query parameters
        const { title, ISBN, category, releasedAt, isDeleted } = req.query;

        // Define a filter object for the query
        let filter = {};

        // Add filters based on query parameters
        if (title) {
            filter.title = title;
        }
        if (ISBN) {
            filter.ISBN = ISBN;
        }
        if (category) {
            filter.category = category;
        }
        if (releasedAt) {
            if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
                return res.status(400).send({ status: false, message: 'releasedAt date should be "YYYY-MM-DD"' });
            }
            filter.releasedAt = releasedAt;
        }
        if (isDeleted !== undefined) {
            filter.isDeleted = isDeleted === 'true';
        }

        // Fetch notes from the database using the filter
        const notes = await notesModel.find(filter);

        // Check if notes were found
        if (notes.length === 0) {
            return res.status(404).send({ status: false, msg: "No notes found" });
        }

        // Send the found notes
        res.status(200).send({ status: true, data: notes });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}







//3
const updateNotes = async function (req, res) {
    try {
      const notesId = req.params.notesId;
      const dataForUpdation = req.body;
  
      // Validate notesId
      if (!notesId || !mongoose.Types.ObjectId.isValid(notesId)) {
        return res.status(400).send({ status: false, message: "Invalid notesId in path params" });
      }
  
      // Check if notesId exists and is not deleted
      const notes = await notesModel.findOne({ _id: notesId, isDeleted: false });
      if (!notes) {
        return res.status(404).send({ status: false, message: "Note not found or already deleted" });
      }
  
      // Validate request data
      if (!isValidRequestBody(dataForUpdation)) {
        return res.status(400).send({ status: false, message: 'Please provide data for updation' });
      }
  
      const { title, content, ISBN, releasedAt } = dataForUpdation;
  
      if (title && !isValid(title)) {
        return res.status(400).send({ status: false, message: 'Please provide a valid title' });
      }
  
      if (title) {
        const duplicateTitle = await notesModel.findOne({ title: title });
        if (duplicateTitle) {
          return res.status(400).send({ status: false, message: "This title is already in use, please provide another one" });
        }
      }
  
      if (content && !isValid(content)) {
        return res.status(400).send({ status: false, message: 'Please provide valid content' });
      }
  
      if (ISBN && !isValid(ISBN)) {
        return res.status(400).send({ status: false, message: 'Please provide a valid ISBN' });
      }
  
      if (ISBN) {
        const duplicateISBN = await notesModel.findOne({ ISBN: ISBN });
        if (duplicateISBN) {
          return res.status(400).send({ status: false, message: "This ISBN is already in use, please provide another one" });
        }
      }
  
      if (releasedAt && (!isValid(releasedAt) || !/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(releasedAt))) {
        return res.status(400).send({ status: false, message: 'Please provide a valid date in format (YYYY-MM-DD)' });
      }
  
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (ISBN) updateData.ISBN = ISBN;
      if (releasedAt) updateData.releasedAt = releasedAt;
  
      const updatedNotes = await notesModel.findOneAndUpdate({ _id: notesId }, updateData, { new: true });
      return res.status(200).send({ status: true, message: "Notes updated successfully", data: updatedNotes });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: err.message });
    }
  }

//5

const deleteNotes = async function (req, res) {
    try {
      const notesId = req.params.notesId;
  
      // Validate notesId
      if (!notesId || !mongoose.Types.ObjectId.isValid(notesId)) {
        return res.status(400).send({ status: false, message: "Invalid notesId in path params" });
      }
  
      // Find the note by ID
      const note = await notesModel.findById(notesId);
  
      if (!note) {
        return res.status(404).send({ status: false, message: "Note not found" });
      }
  
      // Check if the note is already deleted
      if (note.isDeleted) {
        return res.status(400).send({ status: false, message: "Note is already deleted" });
      }
  
      // Update the note to set isDeleted to true
      note.isDeleted = true;
      note.deletedAt = moment().toISOString(); // Ensure the date is saved in ISO format
  
      await note.save();
  
      return res.status(200).send({ status: true, message: "Note deleted successfully", data: note });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: err.message });
    }
  }
  


module.exports.createNotes = createNotes
module.exports.getNotes=getNotes
module.exports.updateNotes=updateNotes
module.exports.deleteNotes=deleteNotes
