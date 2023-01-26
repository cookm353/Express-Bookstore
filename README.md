# Bookstore

Bookstore is an API which serves as an exercise to reinforce testing practices and API validation.

## Instructions

Run the following commands to download the requirements and then  create the database and environment variable file

```JavaScript
npm i -y
psql < data.sql
touch .env
```

`.env` should have the following fields:

```
PGUSER=<user name>
PGPASSWORD=<password>
key=<JWT secret key>
```

After filling in the fields, you can start the server with the following command:

```BASH
nodemon dist/server.js
```

## Routes

`GET /books` - Respond with a list of all books

`POST /books` - Create a book and respond with its details

`GET /books/:isbn` - Respond with the details of the specified book

`PUT /books/:isbn` - Update the specified book and return the updated details

`DELETE /books/:isbn` - Delete the specified book

## Packages Used

- Express
- PG
- Supertest
- dotenv
- JSONSchema

## Takeaways

- Use the values from the test object when writing tests
- To check if an object has a property and what it's value is, use `expect().toHaveProperty(<key>, <value>)`
- The key and value need to be in quotes or back ticks in the above test
- 
