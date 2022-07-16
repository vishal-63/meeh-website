const express = require("express");
const router = express.Router();
const {requireAuth} = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/",requireAuth,userController.profile_get );
router.post("/",requireAuth,userController.profile_post );
// router.get("/changePassword",requireAuth,userController.change_password_get);
// router.post("/changePassword",requireAuth,userController.change_password_post);
router.get("/forgotPassword",userController.forgot_password_get);
router.post("/forgotPassword",userController.forgot_password_post);

module.exports = router;