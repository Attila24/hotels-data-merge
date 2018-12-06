import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelImage} from "./hotel-image.dto";
import {SupplierHotel} from "./supplier-hotel";
import {HotelImages} from "./hotel-images.dto";
import {HotelLocation} from "./hotel-location.dto";

export class Supplier2Hotel implements SupplierHotel {
	amenities: HotelAmenities;
	booking_conditions: string[];
	destination_id: number;
	details: string;
	hotel_id: string;
	hotel_name: string;
	images: Supplier2HotelImages;
	location: Supplier2Location;

	getAmenities(): HotelAmenities {
		const amenities = this.amenities;
		amenities.general = this.amenities.general.map(HotelAmenities.transformAmenity);
		amenities.room = this.amenities.room.map(HotelAmenities.transformAmenity);
		return amenities;
	}

	getBookingConditions(): string[] {
		return this.booking_conditions;
	}

	getDescription(): string {
		return this.details;
	}

	getDestinationId(): number {
		return this.destination_id;
	}

	getId(): string {
		return this.hotel_id;
	}

	getImages(): HotelImages {
		const images = new HotelImages();
		images.rooms = this.images.rooms.map(Supplier2HotelImage.mapToHotelImage);
		images.site = this.images.site.map(Supplier2HotelImage.mapToHotelImage);
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

	setId(id: string): void {
		this.hotel_id = id;
	}
}

class Supplier2HotelImages{
	rooms: Supplier2HotelImage[];
	site: Supplier2HotelImage[];
}

class Supplier2HotelImage {
	caption: string;
	link: string;

	static mapToHotelImage(s2Image: Supplier2HotelImage): HotelImage {
		const image = new HotelImage();
		image.caption = s2Image.caption;
		image.url = s2Image.link;
		return image;
	}
}

class Supplier2Location {
	address: string;
	country: string;
}