const path = require('path');
const express = require('express');
const nanoid = require('nanoid');
const multer = require('multer');

const config = require('../config');

const Album = require('../models/Album');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, config.uploadPath);
	},
	filename: (req, file, cb) => {
		cb(null, nanoid() + path.extname(file.originalname));
	}
});

const upload = multer({storage});

const router = express.Router();

router.get('/', async (req, res) => {
	if (req.query.artist) {
		try {
			const album = await Album.find({artist: req.query.artist});
			if (!album) {
				return res.status(404).send({message: "Not found"})
			} return res.send(album);
		} catch (e) {
			return res.status(404).send({message: "Not found", e});
		}
	} else {
		try {
			const albums = await Album.find();

			if (!albums) {
				return res.status(404).send({message: "Not found"});
			}
			return res.send(albums);
		} catch (e) {
			return res.status(404).send({message: "Not found", e});
		}
	}
});

router.get('/:id', async (req, res) => {
	try {
		const album = await Album.findById(req.params.id).populate('artist');

		if (!album) {
			return res.status(404).send({message: 'Not found'});
		}

		res.send(album);
	} catch (e) {
		res.status(404).send({message: 'Not found'});
	}
});

router.post('/', upload.single('image'), async (req, res) => {
	const albumData = req.body;

	if (req.file) {
		albumData.image = req.file.filename;
	}

	const album = new Album(albumData);

	try {
		await album.save();

		return res.send(album);
	} catch (e) {
		return res.status(400).send(e);
	}
});

module.exports = router;