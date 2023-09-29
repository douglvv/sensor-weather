import express = require('express');
import * as cors from 'cors';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT as string;
const LAT = parseFloat(process.env.LAT as string);
const LON = parseFloat(process.env.LON as string);
const API_KEY = process.env.API_KEY as string;
const WS_URL = process.env.WS_URL as string;

const app = express();

app.use(cors());

async function getWeatherData(): Promise<void> {
  try {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`);
    
    const data = {
      temp: res.data.main.temp,
      sens_term: res.data.main.feels_like,
      umid: res.data.main.humidity,
      datetime: res.data.dt,
      cidade: res.data.name
    }
    
    console.log(data);

    // envia os dados para o web service
    await axios.post(`${WS_URL}/addWeatherData`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

setInterval(async () => {
  await getWeatherData();
}, 10000);

app.listen(PORT, () => {
  console.log('Server listening on port:', PORT);
});
