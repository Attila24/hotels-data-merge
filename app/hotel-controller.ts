import {Router, Request, Response} from 'express';
import {HotelRequest} from "./dto/hotel-request";
import * as cache from 'memory-cache';
import * as config from 'config';
import {Hotel} from './dto/hotel.dto';
import DataLoader from "./data-loader";

const  router: Router = Router();

/**
 * @api {POST} /hotels
 * @apiName FilterHotels
 * @apiVersion 1.0.0
 * @apiGroup HotelController
 * @apiDescription Returns the hotels based on the provided hotel IDs or destination ID. If hotel ids are provided, destination ID is ignored.
 * @apiParam {String[]} ids                         Hotel uniqe IDs.
 * @apiParam {Number} destination                   Destination ID.
 *
 * @apiSuccess {Object[]} hotels                    List of hotels.
 * @apiSuccess {String} hotels.id                   Unique ID of the hotel.
 * @apiSuccess {Number} hotels.destinationId        Destination ID of the hotel.
 * @apiSuccess {String} hotels.name                 Name of the hotel.
 * @apiSuccess {String} hotels.description          Description of the hotel.
 * @apiSuccess {String[]} hotels.bookingConditions  Booking conditions of the hotel.
 * @apiSuccess {Object} hotels.amenities            Amenity lists of the hotel.
 * @apiSuccess {String[]} hotels.amenities.general  General amenity list of the hotel.
 * @apiSuccess {String[]} hotels.amenities.room     Room amenity list of the hotel.
 * @apiSuccess {Object} hotels.images               Image lists of the hotel.
 * @apiSuccess {Object[]} hotels.images.amenities   Amenity images of the hotel.
 * @apiSuccess {Object[]} hotels.images.rooms       Room images of the hotel.
 * @apiSuccess {Object[]} hotels.images.site        Site images of the hotel.
 * @apiSuccess {Object} hotels.location             Location description of the hotel.
 * @apiSuccess {String} hotels.location.address     Street address of the hotel.
 * @apiSuccess {String} hotels.location.city        The city where the hotel is located.
 * @apiSuccess {String} hotels.location.country     The country's code where the hotel is located.
 * @apiSuccess {Number} hotels.location.latitude    The latitude of the hotel's coordinates.
 * @apiSuccess {Number} hotels.location.longitute   The longitude of the hotel's coordinates.
 *
 * @apiError {String} error The error description in case something went wrong.
 */
router.post('/', (req: Request, res: Response) => {
	const body = req.body as HotelRequest;
	console.log(`Request ids: ${body.ids}, destination: ${body.destination}`);

	// If configuration is set to not to use cached data, reload data after every request
	if (!config.get('hotels.useCachedData')) {
		const dataLoader = new DataLoader();
		dataLoader.loadData().then(() => {
			sendHotelsResponse(body, res);
		}).catch(() => {
			res.status(500).send({error: 'An error occured while loading hotels data.'});
		});
	} else {
		sendHotelsResponse(body, res);
	}
});

/**
 * Sends hotels response back to the client based on the contents of the request.
 * @param body A [[HotelRequest]] object which can contain the hotel IDs and the destination ID.
 * @param res The response object that will be sent back to the client.
 */
function sendHotelsResponse(body: HotelRequest, res: Response): void {
	if (body.ids && body.ids.length > 0) {
		if (body.ids.some(id => typeof id !== 'string')) {
			res.status(400).send({error: 'Hotel IDs should all be string type!'});
			return;
		}
		sendHotelsById(body.ids, res);
	} else if (body.destination) {
		if (typeof body.destination !== 'number') {
			res.status(400).send({error: 'Destination should be a number!'});
			return;
		}
		sendHotelsByDestination(body.destination, res);
	} else {
		res.status(400).send({error: 'Either ids or destination parameters are required!'});
	}
}

/**
 * Reads the hotels from cache based on the provided ids array.
 * Filters result array so there won't be NULL values in the response.
 * @param ids The hotel IDs the request contained.
 * @param res The response that will be sent back to the client.
 */
function sendHotelsById(ids: string[], res: Response): void {
	const hotels = ids.map(id => cache.get(id)).filter(hotel => !!hotel);
	res.status(200).send(hotels);
}

/**
 * Reads the hotels with the matching destination ID from cache.
 * @param destinationId The destination ID that the request contained.
 * @param res The response that will be sent back to the client.
 */
function sendHotelsByDestination(destinationId: number, res: Response): void {
	const hotels = cache.keys()
			.map(key => cache.get(key))
			.filter((hotel: Hotel) => hotel.destinationId === destinationId);
	res.status(200).send(hotels);
}

export default router;