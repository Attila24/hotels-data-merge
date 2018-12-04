import {Router, Request, Response} from 'express';
import {HotelRequest} from "./dto/hotel-request";

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
	const body = req.body as HotelRequest;

	if (body.ids) {

	}

	if (body.destination) {

	}
	return res.status(200);
});

export default router;
