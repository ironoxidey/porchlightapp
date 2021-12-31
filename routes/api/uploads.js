const express = require('express');
const router = express.Router();
const controller = require("../../controller/file.controller");

//Image Upload stuff - https://www.geeksforgeeks.org/node-js-image-upload-processing-and-resizing-using-sharp-package/
//AND https://www.bezkoder.com/node-js-express-file-upload/#Define_Route_for_uploading_file

router.post("/upload", controller.upload);
router.get("/files", controller.getListFiles);
router.get("/files/:name", controller.download);

module.exports = router;