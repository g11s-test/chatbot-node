import { AxiosResponse } from 'axios';
import axios from '../config/axios';

export const weatherService = async (
  city: string = 'Rio de Janeiro',
  day: number = 0
) => {
  const hourNow = new Date().getHours();
  const path = encodeURI(`forecast.json?key=${
    process.env.WEATHER_API_KEY
  }&q=${city}&lang=pt&days=${Number(day) + 1}&hour=${hourNow}
  `);

  if (!process.env.WEATHER_API_KEY) {
    throw { trait: 'Zeca: Ficou faltando o TOKEN da API' };
  }

  return axios.get(path);
};

export const transformData = (response: AxiosResponse, day: number = 0) => {
  const location = response['data']['location']['name'];
  const forecastDate = response['data']['forecast']['forecastday'][day]['date'];
  const forecastDay = response['data']['forecast']['forecastday'][day]['day'];

  const tempMax = forecastDay['maxtemp_c'];
  const tempMin = forecastDay['mintemp_c'];
  const condictions = forecastDay['condition']['text'];
  const chanceRain = forecastDay['daily_chance_of_rain'];
  const willRain = forecastDay['daily_will_it_rain'] ? 'com' : 'sem';
  const condictionsIcon = forecastDay['condition']['icon'];

  const initialMessage = `Zeca: Segue abaixo o que encontrei sobre: ${location} no dia ${forecastDate}`;
  const tempMessage = `Teremos uma temperatura mínima de ${tempMin}°C e a máxima de ${tempMax}°C`;
  const condictionsMessage = `Condição do dia: ${condictions}`;
  const rainMessage = `Há ${chanceRain}% de chance de chuva na cidade e por conta disso teremos um dia ${willRain} chuva`;

  return {
    condictionsIcon,
    initialMessage,
    tempMessage,
    condictionsMessage,
    rainMessage,
  };
};
