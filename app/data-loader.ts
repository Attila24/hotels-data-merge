import axios, {AxiosResponse} from 'axios';
import {Supplier1Hotel} from "./dto/supplier1hotel.dto";
import {Supplier2Hotel} from "./dto/supplier2hotel.dto";
import {Supplier3Hotel} from "./dto/supplier3hotel.dto";
import {SupplierHotel} from "./dto/supplier-hotel";
import * as cache from 'memory-cache';
import {Hotel} from "./dto/hotel.dto";
import {MergeUtil} from "./merge-util";

export class DataLoader {
	public static sources = [
		'https://api.myjson.com/bins/gdmqa',
		'https://api.myjson.com/bins/1fva3m',
		'https://api.myjson.com/bins/j6kzm'
	];

	public static supplierIds = DataLoader.sources.map(url => url.slice(url.lastIndexOf('/') + 1, url.length));

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

	private suppliers: {
		[supplierId: string]: SupplierHotel[]
	};

	private hotelIds: Set<string>;

	constructor() {
		this.suppliers = {};
		this.hotelIds = new Set();
	}


	public loadData(): void {
		const promises = DataLoader.sources.map(url => {
			console.log('Reading URL:', url);
			return axios.get(url);
		});

		Promise.all(promises).then((responses: AxiosResponse[]) => {
			responses.forEach((resp, i) => this.parseResponse(resp, i));
			this.hotelIds.forEach(id => this.saveHotel(id));
			console.log(cache.keys());
		});
	}

	private parseResponse(resp: AxiosResponse, i: number): void {
		const hotelRawDatas = resp.data as any[];
		const supplierId = DataLoader.supplierIds[i];
		const factory = DataLoader.hotelFactories[i].factory;

		this.suppliers[supplierId] = hotelRawDatas.map((hotelData: any) => {
			const hotel = factory();
			Object.assign(hotel, hotelData);
			this.hotelIds.add(hotel.getId());
			return hotel;
		});
	}

	private saveHotel(hotelId: string): void {


		for (const supplierId in this.suppliers) {
			const supplierHotels = this.suppliers[supplierId];
			const savedHotel = cache.get(hotelId) as Hotel;

			const supplierHotel = supplierHotels.find(hotelObject => hotelObject.getId() === hotelId);

			if (supplierHotel) {
				const newHotel = new Hotel();
				newHotel.id = hotelId;

				if (savedHotel) {
					newHotel.amenities = MergeUtil.mergeAmenities(savedHotel, supplierHotel);
					newHotel.bookingConditions = MergeUtil.mergeBookingConditions(savedHotel, supplierHotel);
					newHotel.destinationId = supplierHotel.getDestinationId();
					newHotel.images = MergeUtil.mergeImages(savedHotel, supplierHotel);
					newHotel.description = MergeUtil.mergeDescription(savedHotel, supplierHotel);
					newHotel.location = MergeUtil.mergeLocations(savedHotel, supplierHotel);
					newHotel.name = MergeUtil.selectName(savedHotel, supplierHotel);
				} else {
					newHotel.amenities = supplierHotel.getAmenities();
					newHotel.bookingConditions = supplierHotel.getBookingConditions();
					newHotel.destinationId = supplierHotel.getDestinationId();
					newHotel.images = supplierHotel.getImages();
					newHotel.description = supplierHotel.getDescription();
					newHotel.location = supplierHotel.getLocation();
					newHotel.name = supplierHotel.getName();
				}
				cache.put(hotelId, newHotel);
			}
		}
	}
}

class HotelFactory {
	id: string;
	factory: () => SupplierHotel
}

export default DataLoader;
