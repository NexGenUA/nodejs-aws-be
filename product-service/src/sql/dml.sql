INSERT INTO products(description, price, title) values
  ('Lorem ipsum dolor sit amet, consectetur adipiscing elit', 450, 'Iphone 12 Pro'),
  ('Integer sed lacus ac turpis convallis dictum', 110, 'Iphone 5'),
  ('In bibendum interdum arcu, sed viverra lacus tincidunt', 120, 'Iphone 5S'),
  ('Morbi laoreet massa nec nulla condimentum feugiat', 150, 'Iphone SE'),
  ('Curabitur pellentesque suscipit quam sed efficitur', 230, 'Iphone 8'),
  ('Donec urna magna, posuere ut enim non, ornare semper ante', 170, 'Iphone 6S'),
  ('Ut dictum ex ut est finibus imperdiet', 325, 'Iphone XS'),
  ('Morbi quam tortor, hendrerit iaculis sapien vitae, suscipit scelerisque ligula', 415, 'Iphone 12'),
  ('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium', 420, 'Iphone 11 Pro MAX')

INSERT INTO stock(count, product_id) values
  (11, (SELECT id FROM products WHERE title='Iphone 12 Pro')),
  (22, (SELECT id FROM products WHERE title='Iphone 5')),
  (7, (SELECT id FROM products WHERE title='Iphone 5S')),
  (10, (SELECT id FROM products WHERE title='Iphone SE')),
  (5, (SELECT id FROM products WHERE title='Iphone 8')),
  (2, (SELECT id FROM products WHERE title='Iphone 6S')),
  (20, (SELECT id FROM products WHERE title='Iphone XS')),
  (31, (SELECT id FROM products WHERE title='Iphone 12')),
  (9, (SELECT id FROM products WHERE title='Iphone 11 Pro MAX'))
