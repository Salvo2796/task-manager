const mongoose=require("mongoose");

async function connectDb() {
    try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connessione a MongoDB avviata");
  } catch (err) {
    console.error("❌ Errore di connessione a MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports=connectDb;