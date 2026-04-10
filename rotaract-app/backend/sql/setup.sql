-- Create database (run this command in psql first):
-- CREATE DATABASE rotaract_db;

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  board TEXT,
  linkedin TEXT,
  email TEXT,
  avatar TEXT,
  quote TEXT,
  skills TEXT[],
  work TEXT,
  intro TEXT,
  achievements TEXT,
  projects TEXT[]
);

ALTER TABLE members DROP COLUMN IF EXISTS department;
ALTER TABLE members ADD COLUMN IF NOT EXISTS quote TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS work TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS intro TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS achievements TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS projects TEXT[];

UPDATE members
SET name = CONCAT('Rtr. ', BTRIM(name))
WHERE name IS NOT NULL
  AND BTRIM(name) <> ''
  AND name !~* '^(rtr\.\s+|rotaractor\s+)';


-- The canonical fake dataset (TE/SE/FE boards) is seeded by backend/server.js on startup.
-- If legacy year-based rows exist (2023-24/2024-25), backend startup logic replaces them automatically.
