import {Hotel} from "./dto/hotel.dto";
import {SupplierHotel} from "./dto/supplier-hotel";
import {HotelAmenities} from "./dto/hotel-amenities.dto";
import {HotelImages} from "./dto/hotel-images.dto";
import {HotelImage} from "./dto/hotel-image.dto";
import {HotelLocation} from "./dto/hotel-location.dto";
import {Util} from './util';
import * as config from 'config';

/**
 * A class that contains several utility functions for merging hotel data.
 */
export class MergeUtil {

	/**
	 * Merges amenities of a [[Hotel]] and a [[SupplierHotel]] object.
	 * For all properties of the new amenities object it creates an array with only unique elements in it.
	 * In order to exclude duplications, all spaces are first removed from the hotel amenity arrays.
	 * @param hotel A [[Hotel]] object used for merging the amenities.
	 * @param supplierHotel A [[SupplierHotel]] object used for merging the amenities.
	 */
	static mergeAmenities(hotel: Hotel, supplierHotel: SupplierHotel): HotelAmenities {
		const amenities = new HotelAmenities();

		amenities.general = MergeUtil.createUniqueArray(
				Util.removeSpaceFromArray(hotel.amenities.general),
				Util.removeSpaceFromArray(supplierHotel.getAmenities().general));

		amenities.room = MergeUtil.createUniqueArray(
				Util.removeSpaceFromArray(hotel.amenities.room),
				Util.removeSpaceFromArray(supplierHotel.getAmenities().room));
		return amenities;
	}

	/**
	 * Merges booking conditions of a [[Hotel]] and a [[SupplierHotel]] object.
	 * Creates a new array with only unique booking conditions in it.
	 * @param hotel A [[Hotel]] object used for merging booking conditions.
	 * @param supplierHotel A [[SupplierHotel]] object used for merging booking conditions.
	 */
	static mergeBookingConditions(hotel: Hotel, supplierHotel: SupplierHotel): string[] {
		return MergeUtil.createUniqueArray(hotel.bookingConditions, supplierHotel.getBookingConditions());
	}

	/**
	 * Merges descriptions of a [[Hotel]] and a [[SupplierHotel]] object.
	 * If the "mergeDescriptions" configuration is true, merges the two descriptions.
	 * Otherwise selects the longer existing description.
	 * @param hotel A [[Hotel]] object used for merging descriptions.
	 * @param supplierHotel A [[SupplierHotel]] object used for merging descriptions.
	 */
	static mergeDescription(hotel: Hotel, supplierHotel: SupplierHotel): string {
		if (config.get('hotels.mergeDescriptions')) {
			return `${hotel.description} ${supplierHotel.getDescription()}`;
		} else {
			return MergeUtil.selectLongerExistingString(hotel.description, supplierHotel.getDescription());
		}
	}

	/**
	 * Merges images of a [[Hotel]] and a [[SupplierHotel]] object.
	 * For all merged image keys for both objects, creates a new set of URLs, so there won't be repeating images in an image set.
	 * @param hotel A [[Hotel]] object used for merging images.
	 * @param supplierHotel A [[SupplierHotel]] object used for merging images.
	 */
	static mergeImages(hotel: Hotel, supplierHotel: SupplierHotel): HotelImages {
		const images = new HotelImages();

		// Read image keys from both sources
		const hotelImageKeys = hotel.images ? Object.keys(hotel.images) : [];
		const supplierHotelImageKeys = supplierHotel.getImages() ? Object.keys(supplierHotel.getImages()) : [];

		// Iterate over all the image keys from both sources
		[...hotelImageKeys, ...supplierHotelImageKeys].forEach((key: string) => {
			const urlSet = new Set();

			// Read object using the current key
			// If it does not exist, use empty array
			const hotelImages = hotel.images ? hotel.images[key] || [] : [];
			const supplierImages = supplierHotel.getImages() ? supplierHotel.getImages()[key] || [] : [];

			// Select all URLs that have not been added yet.
			// After selected, add them both to the current set and the images array as well.
			images[key] = [...hotelImages, ...supplierImages]
				.filter((img: HotelImage) => !urlSet.has(img.url))
				.map((img: HotelImage) => {
					urlSet.add(img.url);
					return img;
				});
		});
		return images;
	}

	/**
	 * Merges locations of a [[Hotel]] and a [[SupplierHotel]] object.
	 * For most properties, the first value is preferred if both values are not NULL.
	 * For country, the 2 character long values are preferred for cleaner country codes (e.g. "JP").
	 * @param hotel A [[Hotel]] object used for merging locations.
	 * @param supplierHotel A [[SupplierHotel]] object used for merging locations.
	 */
	static mergeLocations(hotel: Hotel, supplierHotel: SupplierHotel): HotelLocation {
		const location = new HotelLocation();
		const supplierLocation = supplierHotel.getLocation();

		location.city = hotel.location.city || supplierLocation.city;
		location.address = hotel.location.address || supplierLocation.address;
		location.latitude = hotel.location.latitude || supplierLocation.latitude;
		location.longitude = hotel.location.longitude || supplierLocation.longitude;

		location.country = hotel.location.country && supplierLocation.country
				? MergeUtil.selectPreferredLength(hotel.location.country, supplierLocation.country, 2)
				: hotel.location.country || supplierLocation.country;

		return location;
	}

	/**
	 * Selects the longer name from a [[Hotel]] and a [[SupplierHotel]] objects.
	 * @param hotel A [[Hotel]] object used for selecting the hotel name.
	 * @param supplierHotel A [[SupplierHotel]] object used for selecting the hotel name.
	 */
	static selectName(hotel: Hotel, supplierHotel: SupplierHotel): string {
		return hotel.name.length > supplierHotel.getName().length ? hotel.name : supplierHotel.getName();
	}

	/**
	 * Creates a new array with only unique elements in it.
	 * If any of the provided properties are undefined or NULL, an empty array is used instead.
	 * @param arr1 An array with any types of objects in it.
	 * @param arr2 An array with any types of objects in it.
	 */
	private static createUniqueArray(arr1: any[], arr2: any[]): any[] {
		return Array.from(new Set([...arr1 || [], ...arr2 || []]));
	}

	/**
	 * Returns the string value witht the provided preferred length.
	 * If none of them are the preferred length, returns the first value.
	 * @param s1 The first string value used for selection.
	 * @param s2 The second string value used for selection.
	 * @param preferredLength The preferred length the returned string value should have.
	 */
	private static selectPreferredLength(s1: string, s2: string, preferredLength: number): string {
		if (s1.length === preferredLength) {
			return s1;
		} else if (s2.length === preferredLength) {
			return s2;
		} else {
			return s1;
		}
	}

	/**
	 * Returns the longer existing string value.
	 * If none of them exist, returns an empty string.
	 * @param s1 The first string value used for selection.
	 * @param s2 The second string value used for selection.
	 */
	private static selectLongerExistingString(s1: string, s2: string): string {
		if (s1 && s2) {
			return s1.length > s2.length ? s1 : s2;
		} else if (s1 && !s2) {
			return s1;
		} else if (!s1 && s2) {
			return s2;
		} else {
			return '';
		}
	}
}
