// rotas/mongoDB/mongoconn.js
require('dotenv').config();          // garante que MONGO_CONNECT exista
const mongoose = require('mongoose'); // CORRIGIDO: nome certo

// opção com async/await
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT);
    console.log('✅  Conectado ao MongoDB!');
  } catch (err) {
    console.error('❌  Erro ao conectar ao MongoDB:', err);
    process.exit(1);                 // encerra se conexão é crítica
  }
})();
