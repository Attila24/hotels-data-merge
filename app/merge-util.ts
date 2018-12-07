import {Hotel} from "./dto/hotel.dto";
import {SupplierHotel} from "./dto/supplier-hotel";
import {HotelAmenities} from "./dto/hotel-amenities.dto";
import {HotelImages} from "./dto/hotel-images.dto";
import {HotelImage} from "./dto/hotel-image.dto";
import {HotelLocation} from "./dto/hotel-location.dto";
import {Util} from './util';

export class MergeUtil {
	static createUniqueArray(arr1: any[], arr2: any[]): any[] {
		return Array.from(new Set([...arr1 || [], ...arr2 || []]));
	}

	static mergeAmenities(hotel: Hotel, supplierHotel: SupplierHotel): HotelAmenities {
		const amenities = new HotelAmenities();

		amenities.general = MergeUtil.createUniqueArray(Util.removeSpaceFromArray(hotel.amenities.general), Util.removeSpaceFromArray(supplierHotel.getAmenities().general));
		amenities.room = MergeUtil.createUniqueArray(Util.removeSpaceFromArray(hotel.amenities.room), Util.removeSpaceFromArray(supplierHotel.getAmenities().room));
		return amenities;
	}

	static mergeBookingConditions(hotel: Hotel, supplierHotel: SupplierHotel): string[] {
		return MergeUtil.createUniqueArray(hotel.bookingConditions, supplierHotel.getBookingConditions());
	}

	static mergeDescription(hotel: Hotel, supplierHotel: SupplierHotel): string {
		return `${hotel.description} ${supplierHotel.getDescription()}`;
	}

	static mergeImages(hotel: Hotel, supplierHotel: SupplierHotel): HotelImages {
		const images = new HotelImages();

		const hotelImageKeys = hotel.images ? Object.keys(hotel.images) : [];
		const supplierHotelImageKeys = supplierHotel.getImages() ? Object.keys(supplierHotel.getImages()) : [];

		[...hotelImageKeys, ...supplierHotelImageKeys].forEach((key: string) => {
			const urlSet = new Set();

			const hotelImages = hotel.images ? hotel.images[key] || [] : [];
			const supplierImages = supplierHotel.getImages() ? supplierHotel.getImages()[key] || [] : [];

			images[key] = [...hotelImages, ...supplierImages]
				.filter((img: HotelImage) => !urlSet.has(img.url))
				.map((img: HotelImage) => {
					urlSet.add(img.url);
					return img;
				});

		});
		return images;
	}

	static mergeLocations(hotel: Hotel, supplierHotel: SupplierHotel): HotelLocation {
		const location = new HotelLocation();
		location.city = MergeUtil.selectNotNullOrFirst(hotel.location.city, supplierHotel.getLocation().city);
		location.country = MergeUtil.selectNotNullOrFirst(hotel.location.country, supplierHotel.getLocation().country, 2);
		location.address = MergeUtil.selectNotNullOrFirst(hotel.location.address, supplierHotel.getLocation().address);
		location.longitude = MergeUtil.selectNotNullOrFirst(hotel.location.longitude, supplierHotel.getLocation().longitude);
		location.latitude = MergeUtil.selectNotNullOrFirst(hotel.location.latitude, supplierHotel.getLocation().latitude);
		return location;
	}

	static selectName(hotel: Hotel, supplierHotel: SupplierHotel): string {
		return hotel.name.length > supplierHotel.getName().length ? hotel.name : supplierHotel.getName();
	}

	static selectNotNullOrFirst(o1: any, o2: any, preferredLength = 0): any {
		if (o1 && o2) {
			if (preferredLength) {
				if ((o1 as string).length === preferredLength) {
					return o1;
				} else if ((o2 as string).length === preferredLength) {
					return o2;
				} else {
					return o1;
				}
			} else {
				return o1;
			}
		} else if (o1 && !o2) {
			return o1;
		} else if (!o1 && o2) {
			return o2;
		} else {
			return null;
		}
	}
}
