-- Seed data for the restaurant management system

-- Insert sample users
INSERT INTO public.users (id, email, full_name, role) VALUES
    (uuid_generate_v4(), 'admin@restaurant.com', 'Admin User', 'admin'),
    (uuid_generate_v4(), 'manager@restaurant.com', 'Manager User', 'manager'),
    (uuid_generate_v4(), 'staff@restaurant.com', 'Staff User', 'staff'),
    (uuid_generate_v4(), 'customer@example.com', 'John Customer', 'user')
ON CONFLICT DO NOTHING;

-- Get the restaurant ID for foreign key references
DO $$
DECLARE
    restaurant_id UUID;
BEGIN
    SELECT id INTO restaurant_id FROM public.restaurants LIMIT 1;
    
    -- Insert sample menu items
    INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
        (restaurant_id, 'Margherita Pizza', 'Classic tomato sauce with mozzarella cheese', 14.99, 'Pizza', true),
        (restaurant_id, 'Pepperoni Pizza', 'Spicy pepperoni with melted cheese', 16.99, 'Pizza', true),
        (restaurant_id, 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 12.99, 'Salad', true),
        (restaurant_id, 'Spaghetti Carbonara', 'Pasta with eggs, cheese, and pancetta', 18.99, 'Pasta', true),
        (restaurant_id, 'Chicken Parmesan', 'Breaded chicken with marinara sauce', 22.99, 'Main Course', true),
        (restaurant_id, 'Tiramisu', 'Classic Italian dessert', 8.99, 'Dessert', true)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample tables
    INSERT INTO public.tables (restaurant_id, table_number, capacity, status) VALUES
        (restaurant_id, 1, 2, 'available'),
        (restaurant_id, 2, 4, 'available'),
        (restaurant_id, 3, 6, 'available'),
        (restaurant_id, 4, 2, 'available'),
        (restaurant_id, 5, 8, 'available')
    ON CONFLICT DO NOTHING;
    
    -- Insert sample reservations
    INSERT INTO public.reservations (restaurant_id, guest_name, guest_email, guest_phone, reservation_date, reservation_time, party_size, status) VALUES
        (restaurant_id, 'Alice Johnson', 'alice@example.com', '+1234567890', CURRENT_DATE + INTERVAL '1 day', '19:00:00', 4, 'confirmed'),
        (restaurant_id, 'Bob Smith', 'bob@example.com', '+1234567891', CURRENT_DATE + INTERVAL '2 days', '20:00:00', 2, 'pending')
    ON CONFLICT DO NOTHING;
    
    -- Insert sample orders
    INSERT INTO public.orders (restaurant_id, order_number, status, total_amount, notes) VALUES
        (restaurant_id, 'ORD-001', 'served', 45.97, 'Extra cheese on pizza'),
        (restaurant_id, 'ORD-002', 'preparing', 32.98, 'No onions please')
    ON CONFLICT DO NOTHING;
    
END $$;
