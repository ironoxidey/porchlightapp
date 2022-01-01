const util = require("util");
const multer = require("multer");
const maxSize = 3 * 1024 * 1024;

var uploadFolder = '../porchlight-uploads';
  
// if (!fs.existsSync(uploadFolder)){
//     fs.mkdirSync(uploadFolder);
  
//     console.log('Folder Created Successfully.');
// }

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    console.log("upload.js: "+uploadFolder+'/'+file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;