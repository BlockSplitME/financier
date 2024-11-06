import "reflect-metadata"
import { DataSource } from "typeorm"
import * as entities from "./entity";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.DB_NAME,
    entities: entities,
    migrations: [],
    subscribers: [],
    // Для первоначального создания дб - true, при имеющейся дб - false;
    synchronize: !(process.env.IS_DB_EXISTS === 'true'),
})