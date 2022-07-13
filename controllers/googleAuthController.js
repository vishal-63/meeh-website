const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_OATH_CLIENT_ID);
// const { google } = require("googleapis");

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

module.exports.googleSignUp = async (req, res) => {
  const token = req.body.token;

  async function verify() {
    // verify token recieved
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OATH_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // get the user from email
    let user = await User.findOne({ email: payload["email"] });

    // if user exists send the response, if not create new user
    if (user) {
      console.log("existing user", user);
      const jwtToken = createJWT(user._id);
      res.cookie("jwt", jwtToken, { httpOnly: true });
      res.json({ user });
    } else {
      user = new User();
      user.first_name = payload["given_name"];
      user.last_name = payload["family_name"];
      user.email = payload["email"];
      user.googleId = payload["sub"];
      user
        .save()
        .then((user) => {
          console.log("New user created", user);
          const jwtToken = createJWT(user._id);
          res.cookie("jwt", jwtToken, { httpOnly: true });
          res.sendStatus(201);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ err });
        });
    }
  }
  verify().catch((err) => {
    console.log(err);
    res.status(401).send("Unauthorized");
  });
};

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_OAUTH_CLIENT_ID,
//   process.env.GOOGLE_OAUTH_SECRET_KEY,
//   "http://localhost:5000/auth/google/get-user"
// );

// module.exports.getGoogleAuthUrl = async (req, res) => {
//   const scopes = [
//     "https://www.googleapis.com/auth/userinfo.email",
//     "https://www.googleapis.com/auth/userinfo.profile",
//     "https://www.googleapis.com/auth/user.phonenumbers.read",
//   ];

//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: scopes,
//   });

//   res.json({ url });
// };

// oauth2Client.on("tokens", (tokens) => {
//   if (tokens.refresh_token) {
//     // store the refresh_token in my database!
//     console.log("refresh token", tokens.refresh_token);
//   }
//   console.log("access token", tokens.access_token);
// });

// module.exports.getGoogleUser = async (req, res) => {
//   const code = req.query.code;

//   const { tokens } = await oauth2Client.getToken(code);
//   console.log("tokens", tokens);
//   oauth2Client.setCredentials(tokens);

//   const people = google.people({
//     version: "v1",
//     auth: oauth2Client,
//   });

//   const data = await people.people.get({
//     personFields: ["names", "emailAddresses", "phoneNumbers"],
//     resourceName: "people/me",
//   });

//   //   const names = await data.data.names[0].unstructuredName;
//   //   const emailAddresses = await data.data.emailAddresses[0].value;
//   //   const phoneNumbers = await data.data.phoneNumbers[0].value;
//   //   console.log(names, emailAddresses, phoneNumbers);
//   res.render("test", { data: data.data });
// };
