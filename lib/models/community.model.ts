import mongoose from "mongoose";


const communitySchema = new mongoose.Schema({
    id: {type: String , required:true },
    Communityname: {type: String , required: true, unique: true},
    name: {type: String , required:true },
    image: String,
    bio: String,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread',
        }
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    members: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
    ]
});


const Community = mongoose.models.Community || mongoose.model('Community', communitySchema)

export default Community