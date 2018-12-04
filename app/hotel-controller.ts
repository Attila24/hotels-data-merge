import {Router, Request, Response} from 'express';
import {HotelFilterRequest} from './dto/hotel-filter-request.dto';
import axios from 'axios';

const sources = [
	'https://api.myjson.com/bins/gdmqa',
	'https://api.myjson.com/bins/1fva3m',
	'https://api.myjson.com/bins/j6kzm'
];

const router: Router = Router();

const getJson = async (url: string): Promise<any> => {
	const resp = await axios.get(url);
};

router.post('/', async (req: Request, res: Response) => {
	const body = req.body as HotelFilterRequest;

	console.log('got request: ', body);

	if (body.ids) {

	}

	if (body.destination) {

	}

	const data = [];

	await Promise.all(sources.map(getJson));

	res.status(200);
});

export default router;
