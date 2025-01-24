/*
  # Create events and frames tables

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `created_at` (timestamp)
    - `frames`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `name` (text)
      - `image_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their events and frames
    - Add policies for public access to view events and frames
*/

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create frames table
CREATE TABLE frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE frames ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Allow public read access to events"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage events"
  ON events
  USING (auth.role() = 'authenticated');

-- Policies for frames
CREATE POLICY "Allow public read access to frames"
  ON frames
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage frames"
  ON frames
  USING (auth.role() = 'authenticated');