import mongoose from "mongoose"

const foodPost = new mongoose.Schema({
    name:String ,  artist:String, new_Date:String,bupload: String,audio:String
})
const Itempost = new mongoose.model("Food", foodPost)


export default  Itempost;

