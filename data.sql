DROP DATABASE IF EXISTS books;
CREATE DATABASE books;

\c books

DROP TABLE IF EXISTS users_books;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  amazon_url TEXT,
  author TEXT,
  language TEXT, 
  pages INTEGER,
  publisher TEXT,
  title TEXT, 
  year INTEGER
);

CREATE TABLE users (
  id integer SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE users_books (
  id integer SERIAL PRIMARY KEY,
  user_id integer REFERENCES users ON DELETE CASCADE,
  isbn text REFERENCES books ON DELETE CASCADE
);