const {
  v4: uuidv4
} = require('uuid');
// Variabel untuk menyimpan data buku
let books = [];


// Fungsi untuk menambahkan buku
function addBookHandler(request, h) {
  try {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    } = request.payload;
    const now = new Date().toISOString();

    // Validate required fields
    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      }).code(400);
    }

    // Validate readPage and pageCount
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      }).code(400);
    }

    const uuid = uuidv4(); // generate UUID for new book
    const book = {
      bookId: uuid,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished: pageCount === readPage,
      insertedAt: now,
      updatedAt: now
    };
    books.push(book);
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: uuid
      }
    }).code(201);
  } catch (error) {
    console.log('Error adding book:', error);
    return h.response({
      message: 'Failed to add book'
    }).code(500);
  }
}


// Fungsi untuk menampilkan semua buku
function getAllBooksHandler(request, h) {
  const {
    publisher,
    sortBy,
    reading,
    finished
  } = request.query;

  try {
    let filteredBooks = [...books];

    if (publisher) {
      filteredBooks = filteredBooks.filter((book) => book.publisher === publisher);
    }

    if (reading !== undefined) {
      filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
    }

    if (finished !== undefined) {
      filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
    }

    if (sortBy) {
      filteredBooks.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }

    if (filteredBooks.length === 0) {
      return h.response({
        status: 'success',
        data: {
          books: [],
        },
      }).code(200);
    }

    return h.response({
      status: 'success',
      data: {
      books: filteredBooks.map((book) => ({
        id: book.bookId,
        name: book.name,
        publisher: book.publisher,
      })),
    }
    }).code(200);
  } catch (error) {
    console.log('Error fetching books:', error);
    return h.response({
      message: 'Error fetching books'
    }).code(500);
  }
}



// Fungsi untuk menghapus buku berdasarkan ID
function deleteBookHandler(request, h) {
  try {
    const {
      bookId
    } = request.params; // get the UUID from the request parameters
    const bookIndex = books.findIndex((book) => book.bookId === bookId);
    if (bookIndex === -1) {
      return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      }).code(404);
    }
    const deletedBook = books.splice(bookIndex, 1)[0];
    // buku telah di hapus
    return h.response({
      status: 'success',
      message: `Buku berhasil dihapus`
    });
  } catch (error) {
    console.log('Error deleting book:', error);
    return h.response({
      message: 'Error deleting book'
    }).code(500);
  }
}

// Fungsi untuk menampilkan buku berdasarkan ID
function getBookByIdHandler(request, h) {
  try {
    const { bookId } = request.params;
    const book = books.find((book) => book.bookId === bookId);
    if (!book) {
      return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      }).code(404);
    }
    return h.response({
      status: 'success',
      data: {
        book: {
          id: book.bookId,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished: book.finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.updatedAt
        }
      }
    }).code(200);
  } catch (error) {
    console.log('Error fetching book:', error);
    return h.response({
      message: 'Error fetching book'
    }).code(500);
  }
}


function editBookByIdHandler(request, h) {
  try {
    const {
      bookId
    } = request.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    } = request.payload;

    const bookIndex = books.findIndex((book) => book.bookId === bookId);
    if (bookIndex === -1) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      }).code(404);
    }

    // Validate required fields
    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      }).code(400);
    }

    // Validate readPage and pageCount
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      }).code(400);
    }

    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished: pageCount === readPage,
      updatedAt: new Date().toISOString(),
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200);
  } catch (error) {
    console.log('Error updating book:', error);
    return h.response({
      message: 'Gagal memperbarui buku'
    }).code(500);
  }
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  deleteBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
};