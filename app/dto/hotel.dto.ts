import {HotelImages} from "./hotel-images.dto";
import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelLocation} from "./hotel-location.dto";

export class Hotel {
	id: string;
	destinationId: number;
	name: string;
	description: string;

	bookingConditions: string[];

	amenities: HotelAmenities;
	images: HotelImages;
	location: HotelLocation;
}