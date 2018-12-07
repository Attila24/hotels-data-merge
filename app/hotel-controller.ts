import {Router, Request, Response} from 'express';
import {HotelRequest} from "./dto/hotel-request";
import * as cache from 'memory-cache';
import {Hotel} from './dto/hotel.dto';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
	const body = req.body as HotelRequest;

	if (body.ids && body.ids.length > 0) {
		const hotels = body.ids.map(id => cache.get(id)).filter(hotel => !!hotel);
		res.status(200).send(hotels);
	} else if (body.destination) {
		const hotels = cache.keys()
			.map(key => cache.get(key))
			.filter((hotel: Hotel) => hotel.destinationId === body.destination);
		res.status(200).send(hotels);
	} else {
		res.status(400).send({error: 'Either ids or destination parameters are required!'});
	}
});

export default router;
