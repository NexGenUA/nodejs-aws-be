import productList from './productList.json';

export const getProductById = async (event) => {
  let statusCode;
  let body;

  try {
    const { id } = event.pathParameters;
    const product = productList.find(item => item.id === id);
    statusCode = product ? 200 : 404;
    body = product ? JSON.stringify(product) : 'Not Found';
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

