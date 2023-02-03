import jsf from 'json-schema-faker';
import Chance from 'chance';
import {MockSchema} from './schemas';
import fs from 'fs';
import chalk from 'chalk';
import {Order, Product, User} from '../../../entities';
import {OrderProduct, ProductCategory, UserSession} from '../../../entities/auxiliary';
import path from 'path';

const MockDatabase: {
    users: User[],
    orders: Order[],
    products: Product[],
    orderProducts: OrderProduct[],
    productCategories: ProductCategory[],
    userSessions: UserSession[],
    initialize(): Promise<void>,
} = {
    users: [],
    orders: [],
    products: [],
    orderProducts: [],
    userSessions: [],
    productCategories: [],
    async initialize(): Promise<void> {
        const filePath = path.join(__dirname, './data.json');

        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, {encoding: 'utf-8'}, (err: Error | null, data: string) => {
                if (err) {
                    console.log(chalk.red(err));
                    return Promise.reject(err);
                } else {
                    this.users = JSON.parse(data).users as User[];
                    this.products = JSON.parse(data).products as Product[];
                    console.log(chalk.green('In-memory database initialized.'));
                    return Promise.resolve();
                }
            });
        } else {
            jsf.extend('chance', () => new Chance());
            const json = JSON.stringify(jsf.generate(MockSchema));
            fs.writeFile(filePath, json, (err: Error | null) => {
                if (err) {
                    console.log(chalk.red(err));
                    return Promise.reject(err);
                } else {
                    console.log(chalk.green('Mock data generated.'));
                    fs.readFile(filePath, {encoding: 'utf-8'}, (err: Error | null, data: string) => {
                        if (err) {
                            console.log(chalk.red(err));
                            return Promise.reject(err);
                        } else {
                            this.users = JSON.parse(data).users as User[];
                            this.products = JSON.parse(data).products as Product[];
                            console.log(chalk.green('In-memory database initialized.'));
                            return Promise.resolve();
                        }
                    });
                }
            });
        }
    },
};

export default MockDatabase;
