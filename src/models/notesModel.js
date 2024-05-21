const mongoose = require('mongoose');
var moment = require('moment');

const ObjectId = mongoose.Schema.Types.ObjectId
const NotesSchema = new mongoose.Schema({
        title:
        {
                type:String,
                required:true,
                unique:true
        },
        content:
         {
                 type:String, 
                
        }, 
        ISBN:
         {
                 type:String,
                 unique:true
        },
        category:
         {
                  type:String,
                 
         },
     
        reviews:
         {
         type:Number,
         default:0
         },
          
        deletedAt: {
                type:Date
        }, 
        isDeleted: 
        {
                type:Boolean, 
                default: false},
        releasedAt: 
        {
                type:Date, 
                required:true
        },
      

},{timestamps:true})
module.exports = mongoose.model("Notes",NotesSchema)