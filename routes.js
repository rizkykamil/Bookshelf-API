const handlers = require('./handlers');

// Definisikan rute-rute API
const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: handlers.addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: handlers.getAllBooksHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: handlers.deleteBookHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: handlers.getBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: handlers.editBookByIdHandler
  }
];

module.exports = routes;
