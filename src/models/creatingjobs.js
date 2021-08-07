const mongoose = require("mongoose");


const companyJobSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    industry:{
        type:String,
        required:true
    },
    jobtype:{
        type:String,
        required:true
    },
    jobfield:{
        type:String,
        required:true
    },
    jobdescrip:{
        type:String,
        required:true
    },
    highqualification:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    jobcontact:{
        type:Number,
        required:true
    }
})

const Jobcreation = new mongoose.model("Job", companyJobSchema);

module.exports = Jobcreation;