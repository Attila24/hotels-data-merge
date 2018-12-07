import {HotelImage} from "./hotel-image.dto";
import {SupplierHotel} from "./supplier-hotel";
import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelImages} from "./hotel-images.dto";
import {HotelLocation} from "./hotel-location.dto";
import {Util} from '../util';

export class Supplier3Hotel implements SupplierHotel {
	address: string;
	amenities: string[];
	destination: number;
	id: string;
	images: Supplier3HotelImages;
	info: string;
	lat: number;
	lng: number;
	name: string;

	getAmenities(): HotelAmenities {
		const amenities = new HotelAmenities();
		amenities.general = this.amenities ? this.amenities.map(HotelAmenities.transformAmenity) : [];
		return amenities;
	}

	getBookingConditions(): string[] {
		return [];
	}

	getDescription(): string {
		return Util.trimOrEmpty(this.info);
	}

	getDestinationId(): number {
		return this.destination;
	}

	getId(): string {
		return this.id;
	}

	getImages(): HotelImages {
		const images = new HotelImages();
		images.amenities = this.images.amenities ? this.images.amenities.map(Supplier3HotelImage.mapToHotelImage) : [];
		images.rooms = this.images.rooms ? this.images.rooms.map(Supplier3HotelImage.mapToHotelImage) : [];
		return images;
	}

	getLocation(): HotelLocation {
		const location = new HotelLocation();
		location.address = Util.trimOrEmpty(this.address);
		location.latitude = this.lat;
		location.longitude = this.lng;
		return location;
	}

	getName(): string {
		return Util.trimOrEmpty(this.name);
	}
}

class Supplier3HotelImages {
	amenities: Supplier3HotelImage[];
	rooms: Supplier3HotelImage[];
}

class Supplier3HotelImage {
	description: string;
	url: string;

	static mapToHotelImage(s3image: Supplier3HotelImage): HotelImage {
		const image = new HotelImage();
		image.caption = s3image.description;
		image.url = s3image.url;
		return image;
	}
}
