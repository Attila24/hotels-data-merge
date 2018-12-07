import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelImages} from "./hotel-images.dto";
import {HotelLocation} from "./hotel-location.dto";

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