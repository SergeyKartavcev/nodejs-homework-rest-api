const { register, login, logout, getCurrent, uploadAvatar } = require("../../controller/auth_controllers");
const { auth, upload  } = require("../../middlewares/index");
const express = require("express");
const { tryCatchWrapper } = require("../../helpers/helpers");
const router = express.Router();
const { validateBody } = require("../../middlewares/index");
const { userSchema} = require("../../middlewares/validate/schemas");

router.post("/register", validateBody(userSchema), tryCatchWrapper(register));
router.post("/login", validateBody(userSchema), tryCatchWrapper(login));
router.get("/logout",tryCatchWrapper(auth), tryCatchWrapper(logout));
router.get("/current",tryCatchWrapper(auth), tryCatchWrapper(getCurrent));
router.patch("/:id/avatar", upload.single("avatar"), tryCatchWrapper(uploadAvatar));

module.exports = router;