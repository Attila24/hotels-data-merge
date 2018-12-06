import {Hotel} from "./dto/hotel.dto";
import {SupplierHotel} from "./dto/supplier-hotel";
import {HotelAmenities} from "./dto/hotel-amenities.dto";
import {HotelImages} from "./dto/hotel-images.dto";
import {HotelImage} from "./dto/hotel-image.dto";
import {HotelLocation} from "./dto/hotel-location.dto";

export class MergeUtil {
	static mergeAmenities(hotel: Hotel, supplierHotel: SupplierHotel): HotelAmenities {
		const amenities = new HotelAmenities();

		const general = new Set([...hotel.amenities.general, ...supplierHotel.getAmenities().general]);
		const room = new Set([...hotel.amenities.room, ...supplierHotel.getAmenities().room]);

		amenities.general = Array.from(general);
		amenities.room = Array.from(room);
		return amenities;
	}

	static mergeBookingConditions(hotel: Hotel, supplierHotel: SupplierHotel): string[] {
		return Array.from(new Set([...hotel.bookingConditions, ...supplierHotel.getBookingConditions()]));
	}

	static mergeDescription(hotel: Hotel, supplierHotel: SupplierHotel): string {
		return `${hotel.description} ${supplierHotel.getDescription()}`;
	}

	static mergeImages(hotel: Hotel, supplierHotel: SupplierHotel): HotelImages {
		const images = new HotelImages();

		Object.keys(images).forEach((key: string) => {
			const urlSet = new Set();
			images[key] = ([...hotel.images[key], supplierHotel.getImages()[key]] as HotelImage[]).map((img: HotelImage) => {
				if (!urlSet.has(img.url)) {
					urlSet.add(img.url);
					return img;
				}
			});
		});
		return images;
	}

	static mergeLocations(hotel: Hotel, supplierHotel: SupplierHotel): HotelLocation {
		const location = new HotelLocation();
		location.city = MergeUtil.selectNotNullOrFirst(hotel.location.city, supplierHotel.getLocation().city);
		location.country = MergeUtil.selectNotNullOrFirst(hotel.location.country, supplierHotel.getLocation().country);
		location.address = MergeUtil.selectNotNullOrFirst(hotel.location.address, supplierHotel.getLocation().address);
		location.longitude = MergeUtil.selectNotNullOrFirst(hotel.location.longitude, supplierHotel.getLocation().longitude);
		location.latitude = MergeUtil.selectNotNullOrFirst(hotel.location.latitude, supplierHotel.getLocation().latitude);
		return location;
	}

	static selectName(hotel: Hotel, supplierHotel: SupplierHotel): string {
		return hotel.name.length > supplierHotel.getName().length ? hotel.name : supplierHotel.getName();
	}

	static selectNotNullOrFirst(o1: any, o2: any): any {
		if (o1 && o2) {
			return o1;
		} else if (o1 && !o2) {
			return o1;
		} else if (!o1 && o2) {
			return o2
		} else {
			return null;
		}
	}
}
