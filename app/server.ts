import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as config from 'config';
import HotelController from './hotel-controller';
import DataLoader from "./data-loader";

// Create Express app
const app: express.Application = express();
const port = process.env.port || 3000;

// Use body-parser to parse JSON request
app.use(bodyParser.json());

// Use controller for the specified URLs
app.use('/hotels', HotelController);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);

	// By default, load and parse hotel data on startup
	if (config.get('hotels.useCachedData')) {
		const dataLoader = new DataLoader();
		dataLoader.loadData().then().catch(() => {
			console.error('An error occured while loading hotels data.');
		});
	}
});

export default app;

module.exports = app;