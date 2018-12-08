import {SupplierHotel} from "./supplier-hotel";
import {HotelAmenities} from "./hotel-amenities.dto";
import {HotelImages} from "./hotel-images.dto";
import {HotelLocation} from "./hotel-location.dto";
import {Util} from '../util';

/**
 * Represents the data structure provided by the first supplier.
 */
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
		amenities.general = this.Facilities ? this.Facilities.map(HotelAmenities.transformAmenity) : [];
		return amenities;
	}

	getBookingConditions(): string[] {
		return [];
	}

	getDescription(): string {
		return Util.trimOrEmpty(this.Description);
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
		// Street address is concatenated using the simple address and the postal code
		location.address = `${Util.trimOrEmpty(this.Address)} ${Util.trimOrEmpty(this.PostalCode)}`;
		location.city = Util.trimOrEmpty(this.City);
		location.country = Util.trimOrEmpty(this.Country);
		location.latitude = this.Latitude;
		location.longitude = this.Longitude;
		return location;
	}

	getName(): string {
		return Util.trimOrEmpty(this.Name);
	}
}
