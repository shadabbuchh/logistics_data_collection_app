-- Purpose: Seed database with sample shipment data for testing
-- Dependencies: 0000_cool_bloodscream.sql (shipments and shipment_history tables)
-- Breaking Changes: None

-- Step 1: Insert sample shipments
INSERT INTO shipments (id, urgency, pickup_time, delivery_time, status, eta, map_preview, details) VALUES 
(
    gen_random_uuid(),
    'high',
    '2025-09-18 09:00:00',
    '2025-09-18 17:00:00',
    'in_transit',
    '2 hours',
    'https://maps.example.com/preview1',
    'Fragile electronics shipment - handle with care'
),
(
    gen_random_uuid(),
    'medium',
    '2025-09-17 14:00:00',
    '2025-09-19 10:00:00',
    'pending',
    '1 day',
    'https://maps.example.com/preview2',
    'Medical supplies for downtown clinic'
),
(
    gen_random_uuid(),
    'low',
    '2025-09-16 08:30:00',
    '2025-09-20 16:00:00',
    'delivered',
    'delivered',
    'https://maps.example.com/preview3',
    'Office furniture delivery to new branch'
),
(
    gen_random_uuid(),
    'urgent',
    '2025-09-18 12:00:00',
    '2025-09-18 18:00:00',
    'pickup_scheduled',
    '6 hours',
    'https://maps.example.com/preview4',
    'Emergency pharmaceutical delivery'
),
(
    gen_random_uuid(),
    'medium',
    '2025-09-19 07:00:00',
    '2025-09-21 15:00:00',
    'pending',
    '2 days',
    'https://maps.example.com/preview5',
    'Construction materials for site #47'
)
ON CONFLICT DO NOTHING;

-- Step 2: Insert shipment history records for tracking
-- Using a CTE to get shipment IDs for history records
WITH shipment_ids AS (
    SELECT id, status FROM shipments 
    WHERE details IN (
        'Fragile electronics shipment - handle with care',
        'Medical supplies for downtown clinic',
        'Office furniture delivery to new branch',
        'Emergency pharmaceutical delivery',
        'Construction materials for site #47'
    )
)
INSERT INTO shipment_history (shipment_id, timestamp, status)
SELECT 
    id,
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    'pending'
FROM shipment_ids
WHERE status != 'pending'
UNION ALL
SELECT 
    id,
    CURRENT_TIMESTAMP - INTERVAL '1 hour',
    'pickup_scheduled'
FROM shipment_ids
WHERE status IN ('in_transit', 'delivered')
UNION ALL
SELECT 
    id,
    CURRENT_TIMESTAMP - INTERVAL '30 minutes',
    'in_transit'
FROM shipment_ids
WHERE status IN ('in_transit', 'delivered')
UNION ALL
SELECT 
    id,
    CURRENT_TIMESTAMP,
    status
FROM shipment_ids
WHERE status = 'delivered'
ON CONFLICT DO NOTHING;