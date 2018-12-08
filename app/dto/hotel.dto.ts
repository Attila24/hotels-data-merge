import {HotelImages} from "./hotel-images.dto";
import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelLocation} from "./hotel-location.dto";

/**
 * Represents the hotel which is returned using the HotelController's endpoint.
 */
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