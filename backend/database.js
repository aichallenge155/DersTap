const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB bağlantısı uğurludur');
  } catch (error) {
    console.error('MongoDB bağlantı xətası:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;