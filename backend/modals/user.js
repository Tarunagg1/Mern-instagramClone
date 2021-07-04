const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:'dummyprofile.png'
    },
    password:{
        type:String,
        required:true
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            unique:true
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            unique:true
        }
    ],
    

})

module.exports = mongoose.model('user',userSchema);

