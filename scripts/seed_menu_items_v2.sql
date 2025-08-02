-- Insert Main Items
INSERT INTO public.products (name, description, price, original_price, image, rating, reviews, prep_time, serves, tags, calories, category, popular, created_at)
VALUES
('Bubble Waffle (Hazelnut Chocolate)', 'Delicious bubble waffle with hazelnut chocolate.', 3.50, NULL, '/placeholder.svg?height=250&width=350&text=Bubble Waffle', 5, 0, NULL, 1, '{}', NULL, 'Main Items', FALSE, now()),
('Mini Pancakes 5 pcs', '5 pieces of fluffy mini pancakes.', 2.50, NULL, '/placeholder.svg?height=250&width=350&text=Mini Pancakes 5pcs', 5, 0, NULL, 1, '{}', NULL, 'Main Items', FALSE, now()),
('Mini Pancakes 10 pcs', '10 pieces of fluffy mini pancakes.', 3.50, NULL, '/placeholder.svg?height=250&width=350&text=Mini Pancakes 10pcs', 5, 0, NULL, 1, '{}', NULL, 'Main Items', FALSE, now()),
('Ice Rolls (Vanilla) 3 rolls', '3 rolls of creamy vanilla ice cream.', 2.00, NULL, '/placeholder.svg?height=250&width=350&text=Ice Rolls 3', 5, 0, NULL, 1, '{}', NULL, 'Main Items', FALSE, now()),
('Ice Rolls (Vanilla) 6 rolls', '6 rolls of creamy vanilla ice cream.', 3.00, NULL, '/placeholder.svg?height=250&width=350&text=Ice Rolls 6', 5, 0, NULL, 1, '{}', NULL, 'Main Items', FALSE, now()),
('Crepe (Nutella)', 'Classic crepe filled with Nutella.', 4.00, NULL, '/placeholder.svg?height=250&width=350&text=Nutella Crepe', 5, 0, NULL, 1, '{}', NULL, 'Main Items', FALSE, now()),
('Brownie (served with Strawberry and Vanilla Ice Rolls)', 'Rich brownie served with strawberry and vanilla ice rolls.', 4.00, NULL, '/placeholder.svg?height=250&width=350&text=Brownie w/Ice Rolls', 5, 0, NULL, 1, '{}', NULL, 'Main Items', FALSE, now()),
('Brownie Cup (Brownie, Cream, Vanilla Ice Rolls)', 'A delightful cup with brownie, cream, and vanilla ice rolls.', 4.50, NULL, '/placeholder.svg?height=250&width=350&text=Brownie Cup', 5, 0, NULL, 1, '{}', NULL, 'Main Items', FALSE, now());

-- Insert Add-Ons
INSERT INTO public.products (name, description, price, original_price, image, rating, reviews, prep_time, serves, tags, calories, category, popular, created_at)
VALUES
('Oreo Topping', 'Add Oreo crumbles to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Oreo Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Lotus Topping', 'Add Lotus biscuit crumbles to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Lotus Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Kinder Topping', 'Add Kinder chocolate pieces to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Kinder Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('KitKat Topping', 'Add KitKat pieces to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=KitKat Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Brownie Topping', 'Add brownie chunks to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Brownie Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Bubbly Topping', 'Add Bubbly chocolate pieces to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Bubbly Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Milka Topping', 'Add Milka chocolate pieces to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Milka Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Cookies Topping', 'Add cookie crumbles to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Cookies Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Fruits Topping', 'Add fresh fruits to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Fruits Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Twix Topping', 'Add Twix pieces to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Twix Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Snickers Topping', 'Add Snickers pieces to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Snickers Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Marshmallow Topping', 'Add soft marshmallows to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Marshmallow Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('White Crunch Topping', 'Add white chocolate crunch to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=White Crunch Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('M&M''s Topping', 'Add colorful M&M''s to your dessert.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=M&Ms Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Maltesers Topping', 'Add Maltesers to your dessert.', 1.50, NULL, '/placeholder.svg?height=250&width=350&text=Maltesers Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Bueno Topping', 'Add Bueno chocolate pieces to your dessert.', 1.50, NULL, '/placeholder.svg?height=250&width=350&text=Bueno Topping', 5, 0, NULL, 1, '{"Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Nutella Melty Topping', 'Warm Nutella drizzle.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Nutella Drizzle', 5, 0, NULL, 1, '{"Melty Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Lotus Melty Topping', 'Warm Lotus drizzle.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=Lotus Drizzle', 5, 0, NULL, 1, '{"Melty Topping"}', NULL, 'Add-Ons', FALSE, now()),
('White Melty Topping', 'Warm white chocolate drizzle.', 1.00, NULL, '/placeholder.svg?height=250&width=350&text=White Drizzle', 5, 0, NULL, 1, '{"Melty Topping"}', NULL, 'Add-Ons', FALSE, now()),
('Pistachio Melty Topping', 'Warm pistachio drizzle.', 2.00, NULL, '/placeholder.svg?height=250&width=350&text=Pistachio Drizzle', 5, 0, NULL, 1, '{"Melty Topping"}', NULL, 'Add-Ons', FALSE, now());

-- Insert KNAFEH (on charcoal)
INSERT INTO public.products (name, description, price, original_price, image, rating, reviews, prep_time, serves, tags, calories, category, popular, created_at)
VALUES
('Naameh Knafeh', 'Traditional Naameh Knafeh cooked on charcoal.', 5.00, NULL, '/placeholder.svg?height=250&width=350&text=Naameh Knafeh', 5, 0, NULL, 1, '{}', NULL, 'KNAFEH (on charcoal)', FALSE, now()),
('Nabulsiyeh Knafeh', 'Traditional Nabulsiyeh Knafeh cooked on charcoal.', 5.00, NULL, '/placeholder.svg?height=250&width=350&text=Nabulsiyeh Knafeh', 5, 0, NULL, 1, '{}', NULL, 'KNAFEH (on charcoal)', FALSE, now());

-- Insert HOOKAH
INSERT INTO public.products (name, description, price, original_price, image, rating, reviews, prep_time, serves, tags, calories, category, popular, created_at)
VALUES
('Double Apple Hookah', 'Classic double apple flavored hookah.', 5.00, NULL, '/placeholder.svg?height=250&width=350&text=Double Apple Hookah', 5, 0, NULL, 1, '{}', NULL, 'HOOKAH', FALSE, now()),
('Lemon & Mint Hookah', 'Refreshing lemon and mint flavored hookah.', 5.00, NULL, '/placeholder.svg?height=250&width=350&text=Lemon Mint Hookah', 5, 0, NULL, 1, '{}', NULL, 'HOOKAH', FALSE, now()),
('Extra Head', 'Additional hookah head.', 3.00, NULL, '/placeholder.svg?height=250&width=350&text=Extra Hookah Head', 5, 0, NULL, 1, '{}', NULL, 'HOOKAH', FALSE, now()),
('Extra Nabrish', 'Additional hookah hose.', 2.00, NULL, '/placeholder.svg?height=250&width=350&text=Extra Nabrish', 5, 0, NULL, 1, '{}', NULL, 'HOOKAH', FALSE, now());

-- Insert Extra Items
INSERT INTO public.products (name, description, price, original_price, image, rating, reviews, prep_time, serves, tags, calories, category, popular, created_at)
VALUES
('Dubai Cake', 'Brownie + Pistachio Knafeh + Nutella + Belgium Chocolate.', 10.00, NULL, '/placeholder.svg?height=250&width=350&text=Dubai Cake', 5, 0, NULL, 1, '{}', NULL, 'Extra Items', FALSE, now()),
('Strawberry Pistachio Knafeh with Belgium Chocolate', 'Delicious knafeh with strawberry, pistachio, and Belgium chocolate.', 6.00, NULL, '/placeholder.svg?height=250&width=350&text=Strawberry Pistachio Knafeh', 5, 0, NULL, 1, '{}', NULL, 'Extra Items', FALSE, now());
