import {SupplierHotel} from "./supplier-hotel";
import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelImages} from "./hotel-images.dto";
import {HotelLocation} from "./hotel-location.dto";

export class Supplier1Hotel implements SupplierHotel {
	Address: string;
	City: string;
	Country: string;
	Description: string;
	DestinationId: number;
	Facilities: string[];
	Id: string;
	Latitude: number;
	Longitude: number;
	Name: string;
	PostalCode: string;

	getAmenities(): HotelAmenities {
		const amenities = new HotelAmenities();
		amenities.general = this.Facilities.map(HotelAmenities.transformAmenity);
		return amenities;
	}

	getBookingConditions(): string[] {
		return [];
	}

	getDescription(): string {
		return this.Description;
	}

	getDestinationId(): number {
		return this.DestinationId;
	}

	getId(): string {
		return this.Id;
	}

	getImages(): HotelImages {
		return null;
	}

	getLocation(): HotelLocation {
		const location = new HotelLocation();
		location.address = `${this.Address} ${this.PostalCode}`;
		location.city = this.City;
		location.country = this.Country;
		location.latitude = this.Latitude;
		location.longitude = this.Longitude;
		return location;
	}

	getName(): string {
		return this.Name;
	}

	setId(id: string): void {
		this.Id = id;
	}
}
