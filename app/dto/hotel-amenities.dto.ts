export class HotelAmenities {
	general: string[];
	room: string[];

	static transformAmenity(amenity: string): string {
		return amenity.trim().toLowerCase();
	}
}