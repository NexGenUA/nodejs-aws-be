import { getProducts } from '../src/handlers/get-products';
import { Product } from '../src/models/product.model';

test('Products', async () => {
  const response: any = await getProducts(null, null, null);
  const products: Product[] = JSON.parse(response.body);
  const NUMBERS_OF_PRODUCT_PROPERTIES = 5;

  products.forEach((product) => {
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
    expect(Object.keys(product).length).toBe(NUMBERS_OF_PRODUCT_PROPERTIES);
  });
});
