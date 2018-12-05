import axios, {AxiosResponse} from 'axios';
import * as cache from 'memory-cache';
import {Hotel} from "./dto/hotel.dto";

export class DataLoader {
	public static sources = [
		'https://api.myjson.com/bins/gdmqa',
		'https://api.myjson.com/bins/1fva3m',
		'https://api.myjson.com/bins/j6kzm'
	];

	public static keys = DataLoader.sources.map(url => url.slice(url.lastIndexOf('/') + 1, url.length));

	private static idFields = ['Id', 'hotel_id', 'id'];

	public loadData(): void {
		const promises = DataLoader.sources.map(url => {
			console.log('Reading URL:', url);
			return axios.get(url);
		});
		Promise.all(promises).then((responses: AxiosResponse[]) => {
			responses.forEach(this.parseResponse);
		})
	}

	private parseResponse(resp: AxiosResponse, i: number): void {
		const supplierHotels = resp.data as any[];
		const idField = DataLoader.idFields[i];

		supplierHotels.forEach(hotel => {
			if (Object.keys(hotel).indexOf(idField) > -1) {
				const newHotel = new Hotel();
				console.log('saving hotel ID: ', idField, newHotel.id);
				cache.put(newHotel.id, newHotel);
			}
		});
	}
}

export default DataLoader;
