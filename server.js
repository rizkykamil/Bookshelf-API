// Import library dan dependency
const Hapi = require('@hapi/hapi');
const routes = require('./routes');



// Inisiasi server Hapi
const server = Hapi.server({
  port: 9000,
  host: 'localhost'
});

// Tambahkan rute dari file routes.js
server.route(routes);

// Fungsi untuk menginisiasi server
async function init() {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

// Jalankan server
init();
