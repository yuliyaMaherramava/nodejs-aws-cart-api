INSERT INTO users (name, email, password)
VALUES
  ('Anthony', 'Anthony@test.com', 'anthonyPassword'),
  ('Benedict', 'Benedict@test.com', 'benedictPassword'),
  ('Colin', 'Colin@test.com', 'colinPassword'),
  ('Daphne', 'Daphne@test.com', 'daphnePassword');


INSERT INTO carts (user_id, status)
SELECT
  users.id,
  'OPEN'
FROM users;


INSERT INTO cart_items (cart_id, product_id, count)
SELECT
  carts.id AS cart_id,
  uuid_generate_v4() AS product_id,
  floor(random() * 3 + 1) AS count
FROM carts
JOIN users ON carts.user_id = users.id;


INSERT INTO orders (user_id, cart_id, payment, delivery, comments, status, total)
SELECT
  users.id AS user_id,
  carts.id AS cart_id,
  '{"method": "credit_card", "amount": 555}'::jsonb AS payment,
  '{"address": "Mayfair", "city": "London", "zipcode": "01010101"}'::jsonb AS delivery,
  'Make it perfectly!' AS comments,
  'OPEN',
  floor(random() * 250 + 100) AS total
FROM carts
JOIN users ON carts.user_id = users.id;
