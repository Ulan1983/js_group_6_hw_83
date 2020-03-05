const express = require('express');

const User = require('../models/User');
const Track = require('../models/Track');
const TrackHistory = require('../models/TrackHistory');

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const authorizationHeader = req.get('Authorization');

		if (!authorizationHeader) {
			return res.status(401).send({error: "No authorization header!"});
		}

		const [type, token] = authorizationHeader.split(' ');

		if (type !== 'Token' || !token) {
			return res.status(401).send({error: "Authorization type is not correct or token is not present!"});
		}

		const user = await User.findOne({token});

		if (!user) {
			return res.status(401).send({error: "Token is incorrect!"});
		}

		const track = await Track.findOne({_id: req.body.track});

		if (!track) {
			return res.status(404).send({error: "Track is not found!"});
		}

		const trackHistoryData = {
			user: user._id,
			track: track._id
		};

		const trackHistory = new TrackHistory(trackHistoryData);

		await trackHistory.save();

		return res.send(trackHistory);
	} catch (error) {
		return res.status(400).send(error);
	}
});

module.exports = router;
