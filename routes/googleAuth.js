const express = require("express");
const router = express.Router();
const googleAuthController = require("../controllers/googleAuthController");

router.post("/sign-up", googleAuthController.googleSignUp);

// router.get("/", googleAuthController.getGoogleAuthUrl);
// router.get("/get-user", googleAuthController.getGoogleUser);

module.exports = router;
