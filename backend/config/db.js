const mongoose = require ('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDb Connected:${conn.connection.host}`.cyan.
            underline);
    }catch (error) {
        console.log(`Error:${error.message}`);
        process.exit(1)
    }

}

module.exports = connectDB