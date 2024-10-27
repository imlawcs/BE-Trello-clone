import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const dbSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3307,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [__dirname + "/../database/entities/*.ts"],
    migrations: [__dirname + "/../database/migrations/*.ts"],
    subscribers: [],
});

const initializeDatabase = async () => {
    try {
        await dbSource.initialize();
        console.log("Database connection established successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

initializeDatabase();
