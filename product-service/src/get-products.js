import productList from './productList.json';

export const getProducts = async () => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
    body: JSON.stringify(productList)
  };
};
