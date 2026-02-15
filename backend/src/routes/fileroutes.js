const express = require("express");
const router = express.Router();
const fileController = require("../controllers/filecontroller");

router.post("/get-upload-url", fileController.getUploadUrl);
router.post("/get-download-url", fileController.getDownloadUrl);
router.post("/confirm-upload", fileController.confirmUpload);
router.post("/list-files", fileController.listFiles);
router.post("/delete-file", fileController.deleteFile);
router.post("/rename-file", fileController.renameFile);

module.exports = router;
