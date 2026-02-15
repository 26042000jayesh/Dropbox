const express = require("express");
const router = express.Router();
const fileController = require("../controllers/filecontroller");

router.post("/get-upload-url", fileController.getUploadUrl);
router.post("/get-download-url", fileController.getDownloadUrl);
router.post("/confirm-upload", fileController.confirmUpload);

module.exports = router;
