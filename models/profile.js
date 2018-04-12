const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var RecipeSchema = new Schema({
//     name: String,
//     ingredients:[
//       {type: Schema.Types.ObjectId, ref: 'Ingredient'}
//     ]
// });

//module.exports = mongoose.model('Recipe', RecipeSchema);
// Profile Schema
const ProfileSchema = new Schema({
    score_c: {
        type: Number,
        default: 0
    },
    score_sql: {
        type: Number,
        default: 0
    },
    score_java: {
        type: Number,
        default: 0
    },
    user_id:
        {type: Schema.Types.ObjectId, ref: 'User'}
});

const Profile = module.exports = mongoose.model('Profile', ProfileSchema);