-- Create database (run once if needed)
CREATE DATABASE IF NOT EXISTS school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE school_db;

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO schools (name, address, latitude, longitude) VALUES
('Greenfield High', '12 Park Street, City A', 19.0760, 72.8777),
('Sunrise Public School', '88 Lake Road, City B', 28.6139, 77.2090),
('Riverview Academy', '45 River Lane, City C', 13.0827, 80.2707)
ON DUPLICATE KEY UPDATE name = VALUES(name);
