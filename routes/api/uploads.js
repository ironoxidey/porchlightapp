// const express = require('express');
// const router = express.Router();
// //const controller = require("../../controller/file.controller");

// const auth = require('../../middleware/auth');

// const Artist = require('../../models/Artist');

// const fs = require('fs');
// const uploadFile = require('../../middleware/upload');

// //Image Upload stuff - https://www.geeksforgeeks.org/node-js-image-upload-processing-and-resizing-using-sharp-package/
// //AND https://www.bezkoder.com/node-js-express-file-upload/#Define_Route_for_uploading_file

// //router.post("/upload", controller.upload);
// //router.get("/files", controller.getListFiles);
// //router.get("/files/:name", controller.download);

// // @route    POST api/uploads/upload
// // @desc     Upload File
// // @access   Private
// router.post('/upload', auth, async (req, res) => {
// 	try {
// 		//console.log("req.user.email: "+req.user.email);
// 		const artistSlug = await Artist.findOne({
// 			email: req.user.email,
// 		}).select('_id slug'); //ADD .select('-field'); to exclude [field] from the response
// 		if (!artistSlug) {
// 			return res.status(400).json({ msg: 'There is no slug for this user' });
// 		}
// 		//console.log("artistSlug: "+ artistSlug);

// 		req.artistSlug = artistSlug.slug;
// 		req.artistID = artistSlug._id;

// 		await uploadFile(req, res);

// 		if (req.file == undefined) {
// 			return res.status(400).json({ msg: 'Please upload a file!' });
// 		}

// 		res.status(200).json({
// 			msg: 'Uploaded the file successfully: ' + req.file.originalname,
// 		});
// 	} catch (err) {
// 		//console.log('Upload error: ' + err);
// 		if (err.code == 'LIMIT_FILE_SIZE') {
// 			return res.status(500).json({
// 				msg: 'File size should not be larger than 3MB.',
// 			});
// 		}

// 		res.status(500).json({
// 			msg: `Could not upload the file. ${err}`,
// 		});
// 	}
// });

// // @route    GET api/uploads/files
// // @desc     Get List of Files in User's directory
// // @access   Private
// router.get('/files', auth, async (req, res) => {
// 	const artistSlug = await Artist.findOne({
// 		email: req.user.email,
// 	}).select('slug'); //ADD .select('-field'); to exclude [field] from the response
// 	if (!artistSlug) {
// 		return res.status(400).json({ msg: 'There is no slug for this user' });
// 	}

// 	const directoryPath = `../porchlight-uploads/${artistSlug.slug}/`;

// 	//console.log(directoryPath);

// 	fs.readdir(directoryPath, function (err, files) {
// 		if (err) {
// 			res.status(500).json({
// 				msg: 'Unable to scan files!',
// 			});
// 		}

// 		let fileInfos = [];

// 		files.forEach((file) => {
// 			fileInfos.push({
// 				name: file,
// 				url: directoryPath + file,
// 			});
// 		});

// 		res.status(200).send(fileInfos);
// 	});
// });

// // @route    GET api/uploads/:slug/:name
// // @desc     Get specific file
// // @access   Public
// router.get('/:slug/:file', (req, res) => {
// 	const fileName = req.params.file;
// 	const directoryPath = `../porchlight-uploads/${req.params.slug}/`;

// 	res.download(directoryPath + fileName, fileName, (err) => {
// 		if (err) {
// 			res.status(500).json({
// 				msg: 'Could not download the file. ' + err,
// 			});
// 		}
// 	});
// });

// module.exports = router;
