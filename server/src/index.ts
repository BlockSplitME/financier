import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import * as cors from "cors";
import {ApiError, errorHandler, InternalServerError} from "./utils";
import {Group, Subgroup} from "./entity";
import {EntityTarget, ObjectLiteral, Repository} from "typeorm";
import {TransactionsResolver} from "./resolvers";
import {CONSTANTS} from "../../shared/types";

const PORT = process.env.SERVER_PORT;

AppDataSource.initialize()
    .then(async () => {
        const initializationGroupCreate = async (table: EntityTarget<ObjectLiteral>) => {
            const groupRepository = AppDataSource.getRepository(table);
            try {
                let newItem = groupRepository.create({
                    name: CONSTANTS.DEFAULT_GROUP_NAME,
                    isIncome: true,
                })
                await groupRepository.save(newItem);

                newItem = groupRepository.create({
                    name: CONSTANTS.DEFAULT_GROUP_NAME,
                    isIncome: false,
                })
                await groupRepository.save(newItem);
            } catch(error) {

            }
        }

        await initializationGroupCreate(Group)
        await initializationGroupCreate(Subgroup)
    })
    .then(async () => {
        // create express app
        const app = express()
        app.use(cors());
        app.use(bodyParser.json())

        // register express routes from defined application routes
        Routes.forEach(route => {
            (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next)
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined).catch(err => next(new InternalServerError()));
                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
        })
        app.use((error: ApiError, request: Request, response: Response, next: Function) => errorHandler(error, response))

        app.listen(PORT, () => {
            console.log("Express server has started on port 3000.");
        })
    }).catch(error => console.log(error))
