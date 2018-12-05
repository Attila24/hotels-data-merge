import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelImage} from "./hotel-image.dto";
import {SupplierHotel} from "./supplier-hotel";
import {HotelImages} from "./hotel-images.dto";
import {HotelLocation} from "./hotel-location.dto";

export class Supplier2Hotel implements SupplierHotel {
	amenities: HotelAmenities;
	booking_conditions: string[];
	destination_id: string;
	details: string;
	hotel_id: string;
	hotel_name: string;
	images: Supplier2HotelImages;
	location: Supplier2Location;

	getAmenities(): HotelAmenities {
		return this.amenities;
	}

	getBookingConditions(): string[] {
		return this.booking_conditions;
	}

	getDescription(): string {
		return this.details;
	}

	getDestinationId(): string {
		return this.destination_id;
	}

	getId(): string {
		return this.hotel_id;
	}

	getImages(): HotelImages {
		const images = new HotelImages();
		images.rooms = this.images.rooms;
		images.site = this.images.site;
		return images;
	}

	getLocation(): HotelLocation {
		const location = new HotelLocation();
		location.address = this.location.address;
		location.country = this.location.country;
		return location;
	}

	getName(): string {
		return this.hotel_name;
	}
}

class Supplier2HotelImages{
	rooms: HotelImage[];
	site: HotelImage[];
}

class Supplier2Location {
	address: string;
	country: string;
}