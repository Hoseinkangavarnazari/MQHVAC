const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./models/user.model");

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['access_token'];
    }
    return token;
};

//  Authorization : for protecting resourses
passport.use(
    new JwtStrategy({
            jwtFromRequest: cookieExtractor,
            secretOrKey: "IASBSHVAC",
        },
        (payload, done) => {
            User.findById({ _id: payload.sub }, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

// Authentication strategy using username and password : For login
passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username }, (err, user) => {
            // database error
            if (err) {
                return done(err);
            }

            //  If no user exist
            if (!user) {
                return done(null, false);
            }

            //Check the correctness of the password
            user.comparePassword(password, done);
        });
    })
);