import {Image} from "./image.dto";

export class Supplier3Hotel {
	address: string;
	amenities: string[];
	destination: string;
	id: string;
	images: Supplier3HotelImages;
	info: string;
	lat: number;
	lng: number;
	name: string;
}

class Supplier3HotelImages {
	amenities: Image[];
	rooms: Image[];
}
