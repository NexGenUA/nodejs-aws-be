import { getProducts } from '..';
import { getProductById } from '..';
import productList from '../src/productList.json';

describe('Get All Products', () => {

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  test('should return all products', async () => {
    expect(await getProducts()).toEqual({
      headers,
      statusCode: 200,
      body: JSON.stringify(productList)
    });
  });

  test('should return product by id', async () => {
    const event = {
      pathParameters: {
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a2',
      }
    };

    const product = {
      count: 1,
      description: 'In bibendum interdum arcu, sed viverra lacus tincidunt id',
      id: '7567ec4b-b10c-48c5-9345-fc73c48a80a2',
      price: 120,
      title: 'Iphone 5S'
    };

    expect(await getProductById(event)).toEqual({
      headers,
      statusCode: 200,
      body: JSON.stringify(product)
    });
  });

  test('should return 404 error', async () => {
    const event = {
      pathParameters: {
        id: '1',
      }
    };

    expect(await getProductById(event)).toEqual({
      headers,
      statusCode: 404,
      body: 'Not Found'
    });
  });
});
