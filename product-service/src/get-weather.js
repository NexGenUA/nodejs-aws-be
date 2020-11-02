import axios from 'axios';
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather';

export const getWeather = async (event) => {
  let statusCode;
  let body;
  let response;

  try {
    const { id } = event.pathParameters;
    response = await axios.get(`${apiUrl}?q=${id}&appid=${process.env.API_WEATHER}`);
    statusCode = response.status;
    body = JSON.stringify(response.data);
  } catch {
    statusCode = 500;
    body = 'Internal Server Error';
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode,
    body
  };
};
