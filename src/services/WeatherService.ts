import { AxiosResponse } from 'axios';
import axios from '../config/axios';

export const WeatherService = async (city = 'Rio de Janeiro', day = 0) => {
  const hourNow = new Date().getHours();
  const path = `forecast.json?key=${
    process.env.WEATHER_API_KEY
  }&q=${city}&lang=pt&days=${day + 1}&hour=${hourNow}
  `;

  return axios.get(path);
};

export const TransformData = (response: AxiosResponse, day = 0) => {
  const location = response['data']['location']['name'];
  const forecastDate = response['data']['forecast']['forecastday'][day]['date'];
  const forecastDay = response['data']['forecast']['forecastday'][day]['day'];

  const tempMax = forecastDay['maxtemp_c'];
  const tempMin = forecastDay['mintemp_c'];
  const condictions = forecastDay['condition']['text'];
  const chanceRain = forecastDay['daily_chance_of_rain'];
  const willRain = forecastDay['daily_will_it_rain'] ? 'com' : 'sem';
  const chanceSnow = forecastDay['daily_chance_of_snow'];
  const willSnow = forecastDay['daily_will_it_snow'] ? 'com' : 'sem';
  const condictionsIcon = forecastDay['condition']['icon'];

  const initialMessage = `Zeca: Segue abaixo o que encontrei sobre: ${location} no dia ${forecastDate}`;
  const tempMessage = `Teremos uma temperatura mínima de ${tempMin}°C e a máxima de ${tempMax}°C`;
  const condictionsMessage = `Teremos um dia com ${condictions}`;
  const rainMessage = `Com ${chanceRain}% de chance de chuva e por conta disso teremos um dia ${willRain} chuva`;
  const snowMessage = `Com ${chanceSnow}% de chance de neve e por conta disso teremos um dia ${willSnow} neve`;

  return {
    condictionsIcon,
    initialMessage,
    tempMessage,
    condictionsMessage,
    rainMessage,
    snowMessage,
  };
};
