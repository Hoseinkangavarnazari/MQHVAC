var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const connection = require("./conn_db");

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 30,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
    },
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    } else {
        // saltround is ten
        bcrypt.hash(this.password, 10, (err, passwordHash) => {
            if (err) {
                return next(err);
            } else {
                this.password = passwordHash;
                next();
            }
        });
    }
});

userSchema.methods.comparePassword = function(password, cb) {
    console.log("at compare password")
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        } else {
            if (!isMatch) {
                return cb(null, isMatch);
            } else {
                return cb(null, this);
            }
        }
    });
};

module.exports = mongoose.model("user", userSchema);