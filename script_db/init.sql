\c challenge_db;
CREATE TABLE IF NOT EXISTS users  (
    id_user SERIAL PRIMARY KEY,
    email TEXT,
    hashed_password TEXT,
    is_active BOOLEAN
);
CREATE TABLE IF NOT EXISTS items (
    id_item SERIAL PRIMARY KEY,
    content TEXT,
    link TEXT,
    creation_date TIMESTAMP,
    rating INT,
    archived BOOLEAN,
    archived_rating INT,
    owner_id INT
);
CREATE TABLE IF NOT EXISTS tags (
    id_tag SERIAL PRIMARY KEY,
    tag_name TEXT,
    owner_id INT,
    creation_date TIMESTAMP,
    private BOOLEAN
);
CREATE TABLE IF NOT EXISTS item_tags (
    id_item_tag SERIAL PRIMARY KEY,
    id_item INT,
    id_tag INT,
    owner_id INT
);
