const mongoose = require("mongoose")

const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("database connection success", conn.connection.host)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDb