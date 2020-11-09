import { getProducts } from '../src/get-products';

test('Products', async () => {
  const response = await getProducts({});
  const products = JSON.parse(response.body);

  products.forEach(product => {
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('count');
    expect(typeof product.id).toBe('string');
    expect(typeof product.description).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(typeof product.title).toBe('string');
    expect(typeof product.count).toBe('number');
    expect(Object.keys(product).length).toBe(5)
  })
})
