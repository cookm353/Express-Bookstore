process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('../dist/app')
const db = require('../dist/db')
const Book = require('../dist/models/book')

let testBook

beforeEach(async () => {
    const result = await db.query(
        `INSERT INTO books (
            isbn,
            amazon_url,
            author,
            language,
            pages,
            publisher,
            title,
            year
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`,
        [
            "0691161518",
            "http://a.co/eobPtX2",
            "Matthew Lane",
            "english",
            264,
            "Princeton University Press",
            "Power-Up: Unlocking Hidden Math in Video Games",
            2017
        ]
    )

    testBook = result.rows[0]
})

describe("GET /books", () => {
    test("Get all books", async() => {
        const resp = await request(app).get('/books')
        
        expect(resp.statusCode).toBe(200)
        expect(resp.body.books[0]).toHaveProperty("year", testBook.year)
    })
})

describe('POST /books', () => {
    test('Successfully add a book', async() => {
        const resp = await request(app)
            .post('/books')
            .send({
                "book": {
                    "isbn": "6584",
                    "amazon_url": "https://www.zombo.com",
                    "author": "Murakami",
                    "language": "english",
                    "pages": 684,
                    "publisher": "Vintage International",
                    "title": "The Wind Up Bird Chronicle",
                    "year": 1995
                }
            })

        expect(resp.statusCode).toBe(201)
        expect(resp.body.book).toHaveProperty("author", "Murakami")
    })

    test("Try adding a book without all needed fields", async() => {
        const resp = await request(app)
            .post('/books')
            .send({
                "book": {
                    "isbn": "6584",
                    "amazon_url": "https://www.zombo.com",
                    "author": "Murakami",
                    "language": "english",
                    "pages": 684,
                    "publisher": "Vintage International",
                    "title": "The Wind Up Bird Chronicle"
                }
            })

        expect(resp.statusCode).toBe(400)
        expect(resp.body.error).toHaveProperty("message", ["instance requires property \"year\""])
    })

    test("Try adding a book not matching JSON schema", async() => {
        const resp = await request(app)
        .post('/books')
        .send({
            "book": {
                "isbn": "6584",
                "amazon_url": "https://www.zombo.com",
                "author": "Murakami",
                "language": "english",
                "pages": 684,
                "publisher": "Vintage International",
                "title": "The Wind Up Bird Chronicle",
                "year": "1995"
            }
        })

    expect(resp.statusCode).toBe(400)
    expect(resp.body.error).toHaveProperty("message", ["instance.year is not of a type(s) integer"])
    })
})

describe('GET /books/:isbn', () => {
    test('Get a book w/ a valid ISBN', async () => {
        const resp = await request(app).get('/books/0691161518')

        expect(resp.statusCode).toBe(200)
        expect(resp.body.book).toHaveProperty("language", testBook.language)
    })

    test('Get a book w/ an invalid ISBN', async () => {
        const resp = await request(app).get('/books/0')

        expect(resp.statusCode).toBe(404)
    })
})

describe('`PUT /books/:isbn', () => {
    test("Update a book using a valid ISBN", async () => {
        const resp = await request(app)
            .put('/books/0691161518')
            .send({
                "isbn": 23,
                "amazon_url": "https://www.amazon.com/lasagna",
                "author": "Vonnegut",
                "language": "esperanto",
                "pages": 692,
                publisher: "Random House",
                title: "Random Houses",
                year: 1983
            })
    
        expect(resp.statusCode).toBe(200)
        expect(resp.body.book).toHaveProperty("language", "esperanto")
    })

    test("Update a book using an invalid ISBN", async () => {
        const resp = await request(app)
            .put('/books/302')
            .send({
                "isbn": 23,
                "amazon_url": "https://www.amazon.com/lasagna",
                "author": "Vonnegut",
                "language": "esperanto",
                "pages": 692,
                publisher: "Random House",
                title: "Random Houses",
                year: 1983
            })
    
        expect(resp.statusCode).toBe(404)
    })

    test("Update select fields", async () => {

    })
})

describe("DELETE /books/:isbn", () => {
    test('Delete a book using a valid ISBN', async () => {
        const resp = await request(app).delete('/books/0691161518')

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({message: "Book deleted"})
    })

    test("Try to delete a book using an invalid ISBN", async () => {
        const resp = await request(app).delete('/books/2')

        expect(resp.statusCode).toBe(404)
    })
})

afterEach(async () => {
    await db.query(`DELETE FROM books`)
})

afterAll(async () => {
    await db.end()
})