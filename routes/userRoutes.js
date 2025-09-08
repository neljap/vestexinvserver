const {Router} = require('express');

const {registeruser, loginuser, createContact, getSingleUser, userReceipt, resetPassword, forgotPassword, supportfunc, withdrawfunc, updateUser, signInGoogle} = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

const router = Router();

router.post("/register", registeruser);
router.post("/login", loginuser);
router.post("/google", signInGoogle)
router.post("/contact", createContact)
router.post("/receipts", userReceipt);
router.patch("/reset-password/:token", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/support", supportfunc);
router.post("/withdraw", withdrawfunc);
router.post("/contact", createContact);
router.patch("/update/:id", updateUser);
router.get("/getuser", isAuthenticated, getSingleUser);


module.exports = router;
