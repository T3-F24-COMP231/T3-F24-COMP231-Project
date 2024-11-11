import dotenv from "dotenv";
dotenv.config();

const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri: process.env.MONGODB_URI || "mongodb+srv://festusasiyanbi:3Docoov6PaaNaaaq@t3-f24-comp231-cluster.k7ein.mongodb.net/?retryWrites=true&w=majority&appName=T3-F24-COMP231-Cluster",
}
export default config;