// server/config/db.js

const mongoose = require('mongoose');

mongoose.connection.on('connected', function() {
  console.log('MongooseはMongoDBに接続されました！');
});

mongoose.connection.on('error', function(err) {
  console.error('Mongoose接続エラー: ', err);
});

mongoose.connection.on('disconnected', function() {
  console.log('MongooseはMongoDBから切断されました。');
});

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`データベース接続: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1); // エラー発生時にプロセス終了
  }
}

module.exports = connectDB;
