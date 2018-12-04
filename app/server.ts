import * as express from 'express';
import * as bodyParser from 'body-parser';
import HotelController from './hotel-controller';
import DataLoader from "./data-loader";

const app: express.Application = express();
const port = process.env.port || 3000;

app.use(bodyParser.json());
app.use('/hotels', HotelController);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
	const dataLoader = new DataLoader();
	dataLoader.loadData();
});
