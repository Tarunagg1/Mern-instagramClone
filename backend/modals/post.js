const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'dummyprofile.png'
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
        }
    ],
    comments: [
        {
            commentedby: {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
            },
            text: String
        }
    ],
    postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

module.exports = mongoose.model('post', postSchema);

