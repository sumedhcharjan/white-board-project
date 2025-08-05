import mongoose from 'mongoose';
const UserSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true,
    },
    savedDrawings:[
        {
            title:String,
            url:String,
            roomid:String,
            date:Date
        }
    ]
});

const User=mongoose.model('User',UserSchema);
export default User;