import {v4 as uuid} from 'uuid';
import {Product} from '../../../../../src/entities';
import {ProductsRepository} from '../../../../../src/frameworks/repositories/postgres';

describe('Postgres Product Repository Tests', (): void => {
    let testProduct: Product;

    beforeAll((): void => {
        testProduct = {
            name: 'My Product',
            description: 'My product\'s description',
            price: 15.99
        };
    });

    afterEach(async (): Promise<void> => {
        await ProductsRepository.deleteAll();
        await ProductsRepository.deleteAllCategories?.();
    });

    describe('add() Tests', (): void => {
        it('Adding product should add and return product', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);

            expect(addedProduct).toBeDefined();
            expect(addedProduct.id).toBeDefined();
            expect(addedProduct.name).toBeDefined();
            expect(addedProduct.description).toBeDefined();
            expect(addedProduct.price).toBeDefined();
            expect(addedProduct.name).toBe(testProduct.name);
            expect(addedProduct.description).toBe(testProduct.description);
            expect(Number(addedProduct.price)).toBe(testProduct.price);
        });

        it('Adding product with protected option should return partial product', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct,{protected:true});

            expect(addedProduct).toBeDefined();
            expect(addedProduct.id).toBeUndefined();
            expect(addedProduct.name).toBeDefined();
            expect(addedProduct.description).toBeDefined();
            expect(addedProduct.price).toBeDefined();
            expect(addedProduct.name).toBe(testProduct.name);
            expect(addedProduct.description).toBe(testProduct.description);
            expect(Number(addedProduct.price)).toBe(testProduct.price);
        });
    });

    describe('update() Tests', (): void => {
        it('Updating product should update and return product', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const updatedProduct = await ProductsRepository.update({
                ...addedProduct,
                name:'New Name',
                description:'A new description'
            }) as Product;

            expect(updatedProduct).toBeDefined();
            expect(updatedProduct.id).toBe(addedProduct.id);
            expect(updatedProduct.name).not.toBe(addedProduct.name);
            expect(updatedProduct.description).not.toBe(addedProduct.description);
            expect(updatedProduct.price).toBe(addedProduct.price);
        });

        it('Updating product with protected option should return partial product', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const updatedProduct = await ProductsRepository.update({
                ...addedProduct,
                name:'New Name',
                description:'A new description'
            }, {protected:true}) as Product;

            expect(updatedProduct).toBeDefined();
            expect(updatedProduct.id).toBeUndefined();
            expect(updatedProduct.name).not.toBe(addedProduct.name);
            expect(updatedProduct.description).not.toBe(addedProduct.description);
            expect(updatedProduct.price).toBe(addedProduct.price);
        });

        it('Updating product with invalid id should return null', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const updatedProduct = await ProductsRepository.update({
                ...addedProduct,
                id: uuid()
            }) as Product;

            expect(updatedProduct).toBeNull();
        });
    });

    describe('delete() Tests', (): void => {
        it('Deleting product should delete and return product', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const deletedProduct = await ProductsRepository.delete((addedProduct.id as string)) as Product;

            expect(deletedProduct).toBeDefined();
            expect(deletedProduct.id).toBe(addedProduct.id);
            expect(deletedProduct.name).toBe(addedProduct.name);
            expect(deletedProduct.description).toBe(addedProduct.description);
            expect(deletedProduct.price).toBe(addedProduct.price);
        });

        it('Deleting product with protected options should return partial product', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const deletedProduct = await ProductsRepository.delete((addedProduct.id as string),{protected:true}) as Product;

            expect(deletedProduct).toBeDefined();
            expect(deletedProduct.id).toBeUndefined();
            expect(deletedProduct.name).toBe(addedProduct.name);
            expect(deletedProduct.description).toBe(addedProduct.description);
            expect(deletedProduct.price).toBe(addedProduct.price);
        });

        it('Deleting product with invalid id should return null', async (): Promise<void> => {
            const deletedProduct = await ProductsRepository.delete(uuid());
            expect(deletedProduct).toBeNull();
        });
    });

    describe('getById() Tests', (): void => {
        it('Getting product by id should return product', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const returnedProduct = await ProductsRepository.getById((addedProduct.id as string)) as Product;

            expect(returnedProduct).toBeDefined();
            expect(returnedProduct.id).toBe(addedProduct.id);
            expect(returnedProduct.name).toBe(addedProduct.name);
            expect(returnedProduct.description).toBe(addedProduct.description);
            expect(returnedProduct.price).toBe(addedProduct.price);
        });

        it('Getting product by id with protected option should return partial product', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const returnedProduct = await ProductsRepository.getById((addedProduct.id as string), {protected:true}) as Product;

            expect(returnedProduct).toBeDefined();
            expect(returnedProduct.id).toBeUndefined();
            expect(returnedProduct.name).toBe(addedProduct.name);
            expect(returnedProduct.description).toBe(addedProduct.description);
            expect(returnedProduct.price).toBe(addedProduct.price);
        });

        it('Getting product with invalid id should return null', async (): Promise<void> => {
            await ProductsRepository.add(testProduct);
            const returnedProduct = await ProductsRepository.getById(uuid());
            expect(returnedProduct).toBeNull();
        });
    });

    describe('getAll() Tests', (): void => {
        it('Getting all products should return array of products', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const products = await ProductsRepository.getAll();

            expect(products).toBeDefined();
            expect(products.length).toBe(1);
            expect(products[0]).toEqual(addedProduct);
        });

        it('Getting all products with protected option should return array of partial products', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const products = await ProductsRepository.getAll({protected:true});

            expect(products).toBeDefined();
            expect(products.length).toBe(1);
            expect(products[0].id).toBeUndefined();
            expect(products[0].name).toBe(addedProduct.name);
            expect(products[0].description).toBe(addedProduct.description);
            expect(products[0].price).toBe(addedProduct.price);
        });
    });

    describe('deleteAll() Tests', (): void => {
        it('Deleting all products should return array of products', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const products = await ProductsRepository.deleteAll();

            expect(products).toBeDefined();
            expect(products.length).toBe(1);
            expect(products[0]).toEqual(addedProduct);
        });

        it('Deleting all products with protected option should return array of partial products', async (): Promise<void> => {
            const addedProduct = await ProductsRepository.add(testProduct);
            const products = await ProductsRepository.deleteAll({protected:true});

            expect(products).toBeDefined();
            expect(products.length).toBe(1);
            expect(products[0].id).toBeUndefined();
            expect(products[0].name).toBe(addedProduct.name);
            expect(products[0].description).toBe(addedProduct.description);
            expect(products[0].price).toBe(addedProduct.price);
        });
    });

    describe('getProductsByCategory() Tests', (): void => {
        it('Getting products by category should return an array of products', async (): Promise<void> => {
            const category = await ProductsRepository.addCategory?.('hygiene');
            await ProductsRepository.add({...testProduct, categoryId: category?.id});
            await ProductsRepository.add({
                name: 'My second product',
                description: 'My second product\'s description',
                price: 10.99,
                categoryId: category?.id
            });
            const products = await ProductsRepository.getProductsByCategory?.((category?.id as number));

            expect(products).toBeDefined();
            expect(products?.length).toBe(2);
            expect(products?.[0].categoryId).toBeDefined();
            expect(products?.[0].categoryId).toBe(products?.[1].categoryId);
        });

        it('Getting products by category with protected options should return an array of partial products', async (): Promise<void> => {
            const category = await ProductsRepository.addCategory?.('hygiene');
            await ProductsRepository.add({...testProduct, categoryId: category?.id});
            await ProductsRepository.add({
                name: 'My second product',
                description: 'My second product\'s description',
                price: 10.99,
                categoryId: category?.id
            });
            const products = await ProductsRepository.getProductsByCategory?.((category?.id as number),{protected:true});

            expect(products).toBeDefined();
            expect(products?.length).toBe(2);
            expect(products?.[0].id).toBeUndefined();
            expect(products?.[0].categoryId).toBeUndefined();
            expect(products?.[0].name).toBeDefined();
            expect(products?.[1].name).toBeDefined();
        });
    });

    describe('addCategory() Tests', (): void => {
        it('Adding category should return category', async (): Promise<void> => {
            const category = await ProductsRepository.addCategory?.('snacks');

            expect(category).toBeDefined();
            expect(category?.id).toBeDefined();
            expect(category?.name).toBe('snacks');
        });
    });

    describe('deleteCategory() Tests', (): void => {
        it('Deleting category should return category', async (): Promise<void> => {
            const addedCategory = await ProductsRepository.addCategory?.('appliances');
            const deletedCategory = await ProductsRepository.deleteCategory?.((addedCategory?.id as number));

            expect(deletedCategory).toBeDefined();
            expect(deletedCategory?.id).toBe(addedCategory?.id);
            expect(deletedCategory?.name).toBe(addedCategory?.name);
        });
    });

    describe('getCategory() Tests', (): void => {
        it('Getting category should return category', async (): Promise<void> => {
            const addedCategory = await ProductsRepository.addCategory?.('beverages');
            const returnedCategory = await ProductsRepository.getCategory?.((addedCategory?.id as number));

            expect(returnedCategory).toBeDefined();
            expect(returnedCategory?.id).toBe(returnedCategory?.id);
            expect(returnedCategory?.name).toBe(returnedCategory?.name);
        });
    });

    describe('getAllCategories() Tests', (): void => {
        it('Getting all categories should return an array of categories', async (): Promise<void> => {
            await ProductsRepository.addCategory?.('pasta');
            await ProductsRepository.addCategory?.('beans');
            const categories = await ProductsRepository.getAllCategories?.();

            expect(categories).toBeDefined();
            expect(categories?.length).toBe(2);
            expect(categories?.[0]).toBeDefined();
            expect(categories?.[1]).toBeDefined();
        });
    });

    describe('deleteAllCategories() Tests', (): void => {
        it('Deleting all categories should return an array of categories', async (): Promise<void> => {
            await ProductsRepository.addCategory?.('pasta');
            await ProductsRepository.addCategory?.('beans');
            const categories = await ProductsRepository.deleteAllCategories?.();

            expect(categories).toBeDefined();
            expect(categories?.length).toBe(2);
            expect(categories?.[0]).toBeDefined();
            expect(categories?.[1]).toBeDefined();
        });

        it('Deleting all categories should remove all categories', async (): Promise<void> => {
            await ProductsRepository.addCategory?.('pasta');
            await ProductsRepository.addCategory?.('beans');
            await ProductsRepository.deleteAllCategories?.();
            const categories = await ProductsRepository.getAllCategories?.();

            expect(categories).toBeDefined();
            expect(categories?.length).toBe(0);
        });
    });
});
