import dotenv from "dotenv"

dotenv.config({
    quiet:true
})

const ENV={
    PORT:process.env.PORT,
    MONGO_DB_URI:process.env.MONGO_DB_URI,
    MONGO_DB_URL:process.env.MONGO_DB_URL,
}

export {ENV}