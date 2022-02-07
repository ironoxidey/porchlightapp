const fs = require('fs');

const util = require('util');
const multer = require('multer');
const maxSize = 4 * 1024 * 1024;

// var uploadFolder = '../porchlight-uploads/';

// if (!fs.existsSync(uploadFolder)){
//     fs.mkdirSync(uploadFolder);

//     console.log('Folder Created Successfully.');
// }

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const { artistSlug, artistID } = req;
		const uploadDir = `../porchlight-uploads/${artistID}`;

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);

			console.log(uploadDir + ' Created Successfully.');
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		console.log('upload.js: ' + file.originalname);
		cb(null, file.originalname);
	},
});

let uploadFile = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).single('file');

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
