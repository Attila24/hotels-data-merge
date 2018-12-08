import {HotelImage} from "./hotel-image.dto";

/**
 * Represents a hotel's images lists. A list can only contain unique URLs.
 */
export class HotelImages {
	amenities: HotelImage[];
	rooms: HotelImage[];
	site: HotelImage[];
}
