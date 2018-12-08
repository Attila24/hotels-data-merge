import axios, {AxiosResponse} from 'axios';
import {Supplier1Hotel} from "./dto/supplier1hotel.dto";
import {Supplier2Hotel} from "./dto/supplier2hotel.dto";
import {Supplier3Hotel} from "./dto/supplier3hotel.dto";
import {SupplierHotel} from "./dto/supplier-hotel";
import * as cache from 'memory-cache';
import {Hotel} from "./dto/hotel.dto";
import {MergeUtil} from "./merge-util";

/**
 * A class used for procuring, cleaning and saving hotel data.
 */
export class DataLoader {

	/**
	 * The static sources that contain the raw hotels data.
	 */
	public static sources = [
		'https://api.myjson.com/bins/gdmqa',
		'https://api.myjson.com/bins/1fva3m',
		'https://api.myjson.com/bins/j6kzm'
	];

	/**
	 * A string array containing the source IDs mapped from the original URLs.
	 */
	public static supplierIds: string[] = DataLoader.sources.map(url => url.slice(url.lastIndexOf('/') + 1, url.length));

	/**
	 * An array containing the SupplierHotel factories based on their given ID formats.
	 */
	private static hotelFactories: HotelFactory[] = [
		{
			id: 'Id',
			factory: () => new Supplier1Hotel()
		},
		{
			id: 'hotel_id',
			factory: () => new Supplier2Hotel()
		},
		{
			id: 'id',
			factory: () => new Supplier3Hotel()
		}
	];

	/**
	 * A helper variable used for storing loaded SupplierHotel arrays for each given supplier.
	 */
	private readonly suppliers: {
		[supplierId: string]: SupplierHotel[]
	};

	/**
	 * A set which contains all the loaded hotels' ids.
	 */
	private hotelIds: Set<string>;

	/**
	 * Initializes helper variables.
	 */
	constructor() {
		this.suppliers = {};
		this.hotelIds = new Set();
	}

	/**
	 * Loads hotels data from the individual sources.
	 * After all data was received, parses the responses into [[SupplierHotel]] objects.
	 * Finally, merges the hotel data in order to save the most complete dataset available.
	 * Returns a Promise which will resolve after all hotel data was merged and saved.
	 */
	public loadData(): Promise<void> {
		return new Promise((resolve, reject) => {
			const promises = DataLoader.sources.map(url => {
				console.log('Reading URL:', url);
				return axios.get(url);
			});

			Promise.all(promises).then((responses: AxiosResponse[]) => {
				responses.forEach((resp, i) => this.parseResponse(resp, i));
				this.hotelIds.forEach(id => this.saveHotel(id));
				resolve();
			}).catch(err => {
				console.error('An error occured while loading hotels data: ', err ? err.toString() : '');
				reject();
			});
		});
	}

	/**
	 * Parses an AxiosResponse object which contains an array of hotels.
	 * Creates objects implementing the [[SupplierHotel]] interface using the corresponding factories
	 * and copies all data into the new objects.
	 * Saves all data into the suppliers object.
	 * @param resp The current AxiosResponse object.
	 * @param i The current index of the response.
	 */
	private parseResponse(resp: AxiosResponse, i: number): void {
		const hotelRawDatas = resp.data as any[];
		const supplierId = DataLoader.supplierIds[i];
		const factory = DataLoader.hotelFactories[i].factory;

		this.suppliers[supplierId] = hotelRawDatas.map((hotelData: any) => {
			const hotel = factory(); // Create TyeScript objects based on the current supplier
			Object.assign(hotel, hotelData); // Copy raw data into new TypeScript objects
			this.hotelIds.add(hotel.getId());
			return hotel;
		});
	}

	/**
	 * Using the provided hotel ID, iterates over all of the suppliers.
	 * Gets the already saved hotel (can be NULL) using the hotel ID.
	 * Finds the matching supplier hotel from the current supplier using the hotel ID.
	 * If a matching supplier hotel exists, creates a new hotel based on it (which could overwrite the already saved hotel).
	 * @param hotelId The current hotel's ID that will be possibly saved in the cache.
	 */
	private saveHotel(hotelId: string): void {
		console.log(`Starting to save hotel: ${hotelId}`);
		for (const supplierId in this.suppliers) {
			const savedHotel = cache.get(hotelId) as Hotel;
			const supplierHotels = this.suppliers[supplierId];
			const supplierHotel = supplierHotels.find(hotelObject => hotelObject.getId() === hotelId);

			if (supplierHotel) {
				const newHotel = DataLoader.mergeHotels(savedHotel, supplierHotel, hotelId);
				cache.put(hotelId, newHotel);
			}
		}
	}

	/**
	 * Creates a new [[Hotel]] object based on an already saved [[Hotel]] object and a [[SupplierHotel]] object.
	 * If the saved hotel exists, merges the two objects together using [[MergeUtil]] functions.
	 * If it does not exist yet, create new [[Hotel]] object based only on the [[SupplierHotel]] object.
	 * @param savedHotel An already saved [[Hotel]] object used for merging (can be NULL).
	 * @param supplierHotel The new [[SupplierHotel]] object used for merging.
	 * @param hotelId The merged hotel's ID.
	 */
	private static mergeHotels(savedHotel: Hotel, supplierHotel: SupplierHotel, hotelId: string): Hotel {
		const newHotel = new Hotel();
		newHotel.id = hotelId;

		if (savedHotel) {
			console.log(`Merging hotel: ${hotelId} (${savedHotel.name})`);
			newHotel.amenities = MergeUtil.mergeAmenities(savedHotel, supplierHotel);
			newHotel.bookingConditions = MergeUtil.mergeBookingConditions(savedHotel, supplierHotel);
			newHotel.destinationId = supplierHotel.getDestinationId();
			newHotel.images = MergeUtil.mergeImages(savedHotel, supplierHotel);
			newHotel.description = MergeUtil.mergeDescription(savedHotel, supplierHotel);
			newHotel.location = MergeUtil.mergeLocations(savedHotel, supplierHotel);
			newHotel.name = MergeUtil.selectName(savedHotel, supplierHotel);
		} else {
			console.log(`Saving hotel: ${hotelId} (${supplierHotel.getName()})`);
			newHotel.amenities = supplierHotel.getAmenities();
			newHotel.bookingConditions = supplierHotel.getBookingConditions();
			newHotel.destinationId = supplierHotel.getDestinationId();
			newHotel.images = supplierHotel.getImages();
			newHotel.description = supplierHotel.getDescription();
			newHotel.location = supplierHotel.getLocation();
			newHotel.name = supplierHotel.getName();
		}
		return newHotel;
	}
}

/**
 * A helper object for defining factory functions based on ID format
 * that return a new object which implements the [[SupplierHotel]] interface.
 */
class HotelFactory {
	id: string;
	factory: () => SupplierHotel
}

export default DataLoader;
