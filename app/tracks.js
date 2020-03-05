const express = require('express');

const Track = require('../models/Track');

const router = express.Router();

router.get('/', async (req, res) => {
	if (req.query.album) {
		try {
			const track = await Track.find({album: req.query.album});
			if (!track) {
				return res.status(404).send({message: "Not found"})
			} return res.send(track);
		} catch (e) {
			return res.status(404).send({message: "Not found", e});
		}
	} else {
		try {
			const tracks = await Track.find();

			if (!tracks) {
				return res.status(404).send({message: "Not found"});
			}
			return res.send(tracks);
		} catch (e) {
			return res.status(404).send({message: "Not found", e});
		}
	}
});

router.post('/', async (req, res) => {
	const track = new Track(req.body);
	try {
		await track.save();

		return res.send(track);
	} catch (e) {
		return res.status(400).send(e);
	}
});

module.exports = router;