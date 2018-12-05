import {HotelLocation} from "./location.dto";
import {HotelImages} from "./hotel-images.dto";
import {HotelAmenities} from "./hotel-amenities.dto";

export class Hotel {
	id: string;
	destinationId: string;
	name: string;
	description: string;

	bookingConditions: string[];

	amenities: HotelAmenities;
	images: HotelImages;
	location: HotelLocation;
}