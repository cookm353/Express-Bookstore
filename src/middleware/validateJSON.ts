const bookSchema = require('../../schemas/bookSchema.json')
const jsonschema = require('jsonschema')
const ExpressError = require('../expressError')
const Book = require('../models/book')

function validateInput(req, resp, next) {
    const {book} = req.body
    let result = jsonschema.validate(book, bookSchema)

    if (!result.valid) {
      const errorList = result.errors.map(error => error.stack)
      throw new ExpressError(errorList, 400)
    }

    return next()
}

module.exports = validateInput