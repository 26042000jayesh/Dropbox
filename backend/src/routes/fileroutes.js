const express = require("express");
const router = express.Router();
const fileController = require("../controllers/filecontroller");

router.post("/get-upload-url", fileController.getUploadUrl);
router.post("/get-download-url", fileController.getDownloadUrl);

module.exports = router;
