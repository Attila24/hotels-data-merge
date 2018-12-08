import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelImages} from "./hotel-images.dto";
import {HotelLocation} from "./hotel-location.dto";

/**
 * An interface which all of the supplier hotels need to implement.
 * Contains methods for returning unified types.
 */
export interface SupplierHotel {
	getId(): string;
	getDestinationId(): number;
	getName(): string;
	getDescription(): string;

	getBookingConditions(): string[];

	getAmenities(): HotelAmenities;
	getImages(): HotelImages;
	getLocation(): HotelLocation;
}