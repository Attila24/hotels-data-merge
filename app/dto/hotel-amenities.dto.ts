/**
 * Represents a hotel's amenities lists. Contains simple, trimmed and lowercase-only strings.
 */
export class HotelAmenities {
	general: string[];
	room: string[];

	static transformAmenity(amenity: string): string {
		return amenity.trim().toLowerCase();
	}
}