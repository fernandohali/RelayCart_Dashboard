const mongoose = require("mongoose");
require("./mongoDB/mongoconn");
const User = require("./model/User");

async function createAdminUser() {
  try {
    // Verifica se já existe um admin
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("✅ Usuário admin já existe:");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      return;
    }

    // Criar usuário admin
    const adminUser = new User({
      username: "admin",
      email: "admin@example.com",
      role: "admin",
    });

    // Define a senha
    adminUser.password = "admin123";

    // Salva o usuário
    await adminUser.save();

    console.log("✅ Usuário admin criado com sucesso!");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   Email: admin@example.com");
    console.log("   Role: admin");
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error.message);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
