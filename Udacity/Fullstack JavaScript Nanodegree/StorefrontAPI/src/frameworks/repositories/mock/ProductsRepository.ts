import {Product} from '../../../entities';
import {DataStorable} from '../../../entities/protocols';
import {v4 as uuid} from 'uuid';
import {MockDatabase} from '../../databases/mock';
import {ProductCategory} from '../../../entities/auxiliary';

const ProductsRepository: DataStorable<Product> = {
    async add(product: Product, options?): Promise<Product> {
        if (!product.id) {
            product.id = uuid();
        }

        MockDatabase.products.push(product);

        if (options?.protected) {
            return {
                name:product.name,
                description:product.description,
                price:product.price
            };
        }
        return product;
    },
    async update(product: Product, options?): Promise<Product | null> {
        const index = MockDatabase.products.findIndex((item: Product) => item.id === product.id);
        if (index < 0) return null;

        MockDatabase.products[index] = product;

        if (options?.protected) {
            return {
                name:product.name,
                description:product.description,
                price:product.price
            };
        }
        return product;
    },
    async delete(id: string | number, options?): Promise<Product | null> {
        const index = MockDatabase.products.findIndex((item: Product) => item.id === id);
        if (index < 0) return null;

        const product = MockDatabase.products.splice(index, 1)[0];

        if (options?.protected) {
            return {
                name:product.name,
                description:product.description,
                price:product.price
            };
        }
        return product;
    },
    async getById(id: string, options?): Promise<Product | null> {
        const product = MockDatabase.products.find((item: Product) => item.id === id);
        if (!product) return null;

        if (options?.protected) {
            return {
                name:product.name,
                description:product.description,
                price:product.price
            };
        }
        return product;
    },
    async getAll(options?): Promise<Product[]> {
        if (options?.protected) {
            return MockDatabase.products.map((product: Product) => ({
                name:product.name,
                description:product.description,
                price:product.price
            }));
        }
        return MockDatabase.products;
    },
    async deleteAll(options?): Promise<Product[]> {
        const products = MockDatabase.products;
        MockDatabase.products.length = 0;
        if (options?.protected) {
            return products.map((product: Product) => ({
                name:product.name,
                description:product.description,
                price:product.price
            }));
        }
        return products;
    },
    async getProductsByCategory(categoryId: number, options?): Promise<Product[]> {
        const products = MockDatabase.products.filter((item: Product) => item.categoryId === categoryId);
        if (options?.protected) {
            return MockDatabase.products.map((product: Product) => ({
                name:product.name,
                description:product.description,
                price:product.price
            }));
        }
        return products;
    },
    async addCategory(categoryName: string): Promise<ProductCategory> {
        const category: ProductCategory = {
            id: MockDatabase.productCategories.length,
            name: categoryName
        };

        MockDatabase.productCategories.push(category);
        return category;
    },
    async deleteCategory(categoryId: number): Promise<ProductCategory | null> {
        const index = MockDatabase.productCategories.findIndex((category: ProductCategory) => {
            return category.id === categoryId;
        });
        if (index < 0) return null;

        const category = MockDatabase.productCategories.splice(index, 1)[0];
        return category;
    },
    async getCategory(categoryId: number): Promise<ProductCategory | null> {
        const category = MockDatabase.productCategories.find((item: ProductCategory) => item.id = categoryId);
        if (!category) return null;
        return category;
    },
    async getAllCategories(): Promise<ProductCategory[]> {
        return MockDatabase.productCategories;
    },
    async deleteAllCategories(): Promise<ProductCategory[]> {
        const categories = MockDatabase.productCategories;
        MockDatabase.productCategories.length = 0;
        return categories;
    },
};

Object.freeze(ProductsRepository);
export default ProductsRepository;
