import {Product} from '../../../entities';
import {DataStorable} from '../../../entities/protocols';
import {PostgresDatabase} from '../../databases/postgres';
import {ProductCategory} from '../../../entities/auxiliary';

const selectClause = 'SELECT id, name, description, price, category_id AS "categoryId"';
const returningClause = 'RETURNING id, name, description, price, category_id AS "categoryId"';
const protectify = (product: Product): Product => {
    delete product.id;
    delete product.categoryId;
    return product;
};

const ProductsRepository: DataStorable<Product> = {
    async add(product: Product, options?): Promise<Product> {
        const {name,description,price,categoryId} = product;
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4) ${returningClause}`,
                [name,description,price,categoryId]
            );

            conn.release();
            const _product = result.rows[0];
            if (options?.protected) return protectify({..._product});
            return _product;
        } catch (error) {
            throw new Error('Error while adding product');
        }
    },
    async update(product: Product, options?): Promise<Product | null> {
        const {id,name,description,price,categoryId} = product;
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `UPDATE products SET name = ($1), description = ($2), price = ($3), category_id = ($4) WHERE id = ($5) ${returningClause}`,
                [name,description,price,categoryId,id]
            );
            conn.release();

            if (!result.rows.length) return null;

            const _product = result.rows[0];
            if (options?.protected) return protectify({..._product});
            return _product;
        } catch (error) {
            throw new Error('Error while updating product');
        }
    },
    async delete(id: string | number, options?): Promise<Product | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `DELETE FROM products WHERE id = ($1) ${returningClause}`,
                [id]
            );
            conn.release();

            if (!result.rows.length) return null;

            const _product = result.rows[0];
            if (options?.protected) return protectify({..._product});
            return _product;
        } catch (error) {
            throw new Error('Error while deleting product');
        }
    },
    async getById(id: string, options?): Promise<Product | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM products WHERE id = ($1)`,
                [id]
            );
            conn.release();

            if (!result.rows.length) return null;

            const _product = result.rows[0];
            if (options?.protected) return protectify({..._product});
            return _product;
        } catch (error) {
            throw new Error('Error while getting product by id');
        }
    },
    async getAll(options?): Promise<Product[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`${selectClause} FROM products`);
            conn.release();
            if (options?.protected) {
                return result.rows.map((product: Product) => protectify({...product}));
            }
            return result.rows;
        } catch (error) {
            throw new Error('Error while getting all products');
        }
    },
    async deleteAll(options?): Promise<Product[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`DELETE FROM products ${returningClause}`);
            conn.release();
            if (options?.protected) {
                return result.rows.map((product: Product) => protectify({...product}));
            }
            return result.rows;
        } catch (error) {
            throw new Error('Error while deleting all products');
        }
    },
    async getProductsByCategory(categoryId: number, options?): Promise<Product[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM products WHERE category_id = ($1)`,
                [categoryId]
            );
            conn.release();
            if (options?.protected) {
                return result.rows.map((product: Product) => protectify({...product}));
            }
            return result.rows;
        } catch (error) {
            throw new Error('Error while getting products by category');
        }
    },
    async addCategory(categoryName: string): Promise<ProductCategory> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                'INSERT INTO product_categories (name) VALUES ($1) RETURNING *',
                [categoryName]
            );
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error('Error while adding category');
        }
    },
    async deleteCategory(categoryId: number): Promise<ProductCategory | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                'DELETE FROM product_categories WHERE id = ($1) RETURNING *',
                [categoryId]
            );
            conn.release();
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            throw new Error('Error while deleting category');
        }
    },
    async getCategory(categoryId: number): Promise<ProductCategory | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `SELECT * FROM product_categories WHERE id = ($1)`,
                [categoryId]
            );
            conn.release();
            if (!result.rows.length) return null;
            return result.rows[0];
        } catch (error) {
            throw new Error('Error while getting category by id');
        }
    },
    async getAllCategories(): Promise<ProductCategory[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query('SELECT * FROM product_categories');
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error('Error while getting all categories');
        }
    },
    async deleteAllCategories(): Promise<ProductCategory[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query('DELETE FROM product_categories RETURNING *');
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error('Error while deleting all categories');
        }
    }
};

Object.freeze(ProductsRepository);
export default ProductsRepository;
