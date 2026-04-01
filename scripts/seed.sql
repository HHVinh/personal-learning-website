-- Clear existing data
DELETE FROM resources;

-- Tin A documents
INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
('Tài liệu React cơ bản', 'Giới thiệu về React hooks và components', 'document', 'tin_a', 'https://example.com/react-basics.pdf', 1),
('Next.js 14 App Router', 'Hướng dẫn sử dụng App Router mới', 'document', 'tin_a', 'https://example.com/nextjs-app-router.pdf', 2),
('TypeScript Handbook', 'Sách hướng dẫn TypeScript đầy đủ', 'document', 'tin_a', 'https://example.com/typescript.pdf', 3);

-- Tin A videos
INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
('React Tutorial 2024', 'Video hướng dẫn React từ cơ bản đến nâng cao', 'video', 'tin_a', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
('Next.js Crash Course', 'Next.js trong 100 phút', 'video', 'tin_a', 'https://www.youtube.com/watch?v=Sklc_fQBmcs', 2);

-- Tin B documents
INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
('Node.js Best Practices', 'Các best practice khi làm việc với Node.js', 'document', 'tin_b', 'https://example.com/nodejs-best-practices.pdf', 1),
('Database Design', 'Thiết kế database hiệu quả', 'document', 'tin_b', 'https://example.com/database-design.pdf', 2);

-- Tin B videos
INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
('Database Systems', 'Giới thiệu về hệ thống database', 'video', 'tin_b', 'https://www.youtube.com/watch?v=ztHopE5WnPE', 1),
('SQL Tutorial', 'Học SQL từ A-Z', 'video', 'tin_b', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 2);
