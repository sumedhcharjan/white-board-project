import User from "../models/Users.model.js";
import cloudinary from "../lib/cloudinary.js";

export const saveDrawing = async (req, res) => {
    const { userid, title, imgurl, roomid } = req.body;
    try {
        const result = await cloudinary.uploader.upload(imgurl);
        const iurl = result.secure_url;
        const user = await User.findOne({ userid });
        if (!user) {
            const newuser = new User({
                userid,
                savedDrawings: [
                    {
                        roomid,
                        title,
                        url: iurl,
                        date: new Date()
                    }
                ]
            });
            await newuser.save();
        } else {
            user.savedDrawings.push({
                roomid,
                title,
                url: iurl,
                date: new Date()
            });
            await user.save();
            console.log(user.savedDrawings);
        }

        res.status(201).json({ success: true, image: iurl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const sendSavedDrawings = async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findOne({ userid });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, drawings: user.savedDrawings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const deleteDrawing = async (req, res) => {
    try {
        const { id, roomid } = req.query;
        const { userid } = req.params;
        console.log('ddd',id);
        const user = await User.findOne({ userid });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        user.savedDrawings = user.savedDrawings.filter(drawing => !(drawing._id.toString() === id && drawing.roomid===roomid));
        await user.save();
        console.log(user.savedDrawings);
        res.status(200).json({ success: true, drawings: user.savedDrawings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }

}