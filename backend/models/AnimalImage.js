const mongoose = require('mongoose');

const animalImageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    animalName: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the User model
        required: true
    }
});

module.exports = mongoose.model('AnimalImage', animalImageSchema);
