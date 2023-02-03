import {Product} from '../../../src/entities';
import {Dependable} from '../../../src/entities/protocols';
import {ProductsRepository} from '../../../src/frameworks/repositories/postgres';
import {ProductUseCase} from '../../../src/use-cases';
import {v4 as uuid} from 'uuid';

describe('Product Use-Case Tests', (): void => {
    let testProduct: Product;
    let dependencies: Dependable<Product>;

    beforeAll((): void => {
        testProduct = {
            name: 'My Product',
            description: 'My product\'s description',
            price: 15.99
        };
        dependencies = {
            repository: ProductsRepository
        };
    });

    afterEach(async (): Promise<void> => {
        await ProductUseCase.deleteAll?.(dependencies).execute();
        await ProductUseCase.deleteAllCategories?.(dependencies).execute();
    });

    describe('add() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product should be returned when added', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);

                expect(addedProduct).toBeDefined();
                expect(addedProduct.id).toBeDefined();
                expect(addedProduct.name).toBe(testProduct.name);
                expect(addedProduct.description).toBe(testProduct.description);
                expect(Number(addedProduct.price)).toBe(testProduct.price);
            });

            it('Partial product should be returned when added with protected option', async (): Promise<void> => {
                const partialProduct = await ProductUseCase.add(dependencies).execute(testProduct,{protected:true});

                expect(partialProduct).toBeDefined();
                expect(partialProduct.id).toBeUndefined();
                expect(partialProduct.name).toBe(testProduct.name);
                expect(partialProduct.description).toBe(testProduct.description);
                expect(Number(partialProduct.price)).toBe(testProduct.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when product added without name', async (): Promise<void> => {
                await expectAsync(ProductUseCase.add(dependencies).execute({
                    name:((null as unknown) as string),
                    description:testProduct.description,
                    price:testProduct.price
                })).toBeRejected();
            });

            it('Promise should be rejected when product added without price', async (): Promise<void> => {
                await expectAsync(ProductUseCase.add(dependencies).execute({
                    name:testProduct.name,
                    description:testProduct.description,
                    price:((null as unknown) as number)
                })).toBeRejected();
            });
        });
    });

    describe('update() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product should be returned when updated', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const updatedProduct = await ProductUseCase.update(dependencies).execute({
                    id:addedProduct.id,
                    name:addedProduct.name,
                    description:testProduct.description,
                    price:addedProduct.price
                });

                expect(updatedProduct).toBeDefined();
                expect(updatedProduct?.id).toBe(addedProduct.id);
                expect(updatedProduct?.name).toBe(addedProduct.name);
                expect(updatedProduct?.description).toBe(addedProduct.description);
                expect(updatedProduct?.price).toBe(addedProduct.price);
            });

            it('Partial product should be returned when updated with protected option', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const updatedProduct = await ProductUseCase.update(dependencies).execute({
                    id:addedProduct.id,
                    name:addedProduct.name,
                    description:testProduct.description,
                    price:addedProduct.price
                },{protected:true});

                expect(updatedProduct).toBeDefined();
                expect(updatedProduct?.id).toBeUndefined();
                expect(updatedProduct?.name).toBe(addedProduct.name);
                expect(updatedProduct?.description).toBe(addedProduct.description);
                expect(updatedProduct?.price).toBe(addedProduct.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when product updated without id', async (): Promise<void> => {
                await expectAsync(ProductUseCase.update(dependencies).execute({
                    name:testProduct.name,
                    description:testProduct.description,
                    price:testProduct.price
                })).toBeRejected();
            });

            it('Promise should be rejected when product updated without name', async (): Promise<void> => {
                await expectAsync(ProductUseCase.update(dependencies).execute({
                    id: uuid(),
                    name:((null as unknown) as string),
                    description:testProduct.description,
                    price:testProduct.price
                })).toBeRejected();
            });

            it('Promise should be rejected when product updated without price', async (): Promise<void> => {
                await expectAsync(ProductUseCase.update(dependencies).execute({
                    id: uuid(),
                    name:testProduct.name,
                    description:testProduct.description,
                    price:((null as unknown) as number)
                })).toBeRejected();
            });
        });
    });

    describe('delete() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product should be returned when deleted', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const deletedUser = await ProductUseCase.delete(dependencies).execute((addedProduct.id as string));

                expect(deletedUser).toBeDefined();
                expect(deletedUser?.id).toBeDefined();
                expect(deletedUser?.name).toBe(addedProduct.name);
                expect(deletedUser?.description).toBe(addedProduct.description);
                expect(deletedUser?.price).toBe(addedProduct.price);
            });

            it('Partial product should be returned when deleted with protected option', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const deletedUser = await ProductUseCase.delete(dependencies).execute((addedProduct.id as string),{protected:true});

                expect(deletedUser).toBeDefined();
                expect(deletedUser?.id).toBeUndefined();
                expect(deletedUser?.name).toBe(testProduct.name);
                expect(deletedUser?.description).toBe(testProduct.description);
                expect(deletedUser?.price).toBe(addedProduct.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when product deleted without id', async (): Promise<void> => {
                await expectAsync(ProductUseCase.delete(dependencies).execute(((null as unknown) as string))).toBeRejected();
            });
        });
    });

    describe('getById() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product should be returned when getting product by id', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const returnedUser = await ProductUseCase.getById(dependencies).execute((addedProduct.id as string));

                expect(returnedUser).toBeDefined();
                expect(returnedUser?.id).toBe(addedProduct.id);
                expect(returnedUser?.name).toBe(addedProduct.name);
                expect(returnedUser?.description).toBe(addedProduct.description);
                expect(returnedUser?.price).toBe(addedProduct.price);
            });

            it('Partial product should be returned when getting product by id with protected option', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const returnedUser = await ProductUseCase.getById(dependencies).execute((addedProduct.id as string),{protected:true});

                expect(returnedUser).toBeDefined();
                expect(returnedUser?.id).toBeUndefined();
                expect(returnedUser?.name).toBe(addedProduct.name);
                expect(returnedUser?.description).toBe(addedProduct.description);
                expect(returnedUser?.price).toBe(addedProduct.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when product retrieved without id of guid type', async (): Promise<void> => {
                await expectAsync(ProductUseCase.getById(dependencies).execute(0)).toBeRejected();
            });
        });
    });

    describe('getAll() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of products should be returned when getting all products', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const returnedProducts = await ProductUseCase.getAll?.(dependencies).execute();

                expect(returnedProducts).toBeDefined();
                expect(returnedProducts.length).toBe(1);
                expect(returnedProducts[0].id).toBe(addedProduct.id);
                expect(returnedProducts[0].name).toBe(addedProduct.name);
                expect(returnedProducts[0].description).toBe(addedProduct.description);
                expect(returnedProducts[0].price).toBe(addedProduct.price);
            });

            it('Array of partial products should be returned when getting all products with protected option', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const returnedProducts = await ProductUseCase.getAll?.(dependencies).execute({protected:true});

                expect(returnedProducts).toBeDefined();
                expect(returnedProducts.length).toBe(1);
                expect(returnedProducts[0].id).toBeUndefined();
                expect(returnedProducts[0].name).toBe(addedProduct.name);
                expect(returnedProducts[0].description).toBe(addedProduct.description);
                expect(returnedProducts[0].price).toBe(addedProduct.price);
            });
        });
    });

    describe('deleteAll() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of products should be returned when deleting all products', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const returnedProducts = await ProductUseCase.deleteAll?.(dependencies).execute();

                expect(returnedProducts).toBeDefined();
                expect(returnedProducts.length).toBe(1);
                expect(returnedProducts[0].id).toBe(addedProduct.id);
                expect(returnedProducts[0].name).toBe(addedProduct.name);
                expect(returnedProducts[0].description).toBe(addedProduct.description);
                expect(returnedProducts[0].price).toBe(addedProduct.price);
            });

            it('Array of partial products should be returned when deleting all products with protected option', async (): Promise<void> => {
                const addedProduct = await ProductUseCase.add(dependencies).execute(testProduct);
                const returnedProducts = await ProductUseCase.deleteAll?.(dependencies).execute({protected:true});

                expect(returnedProducts).toBeDefined();
                expect(returnedProducts.length).toBe(1);
                expect(returnedProducts[0].id).toBeUndefined();
                expect(returnedProducts[0].name).toBe(addedProduct.name);
                expect(returnedProducts[0].description).toBe(addedProduct.description);
                expect(returnedProducts[0].price).toBe(addedProduct.price);
            });
        });
    });

    describe('getProductsByCategory() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of products should be returned when getting products by category', async (): Promise<void> => {
                const category = await ProductUseCase.addCategory?.(dependencies).execute('my_category');
                const addedProduct = await ProductUseCase.add(dependencies).execute({
                    ...testProduct,
                    categoryId:category?.id
                });
                const returnedProducts = await ProductUseCase.getProductsByCategory?.(dependencies).execute((category?.id as number));

                expect(returnedProducts).toBeDefined();
                expect(returnedProducts?.length).toBe(1);
                expect(returnedProducts?.[0].id).toBe(addedProduct.id);
                expect(returnedProducts?.[0].name).toBe(addedProduct.name);
                expect(returnedProducts?.[0].description).toBe(addedProduct.description);
                expect(returnedProducts?.[0].price).toBe(addedProduct.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting products without category id', async (): Promise<void> => {
                await expectAsync(ProductUseCase.getProductsByCategory?.(dependencies).execute(((null as unknown) as number))).toBeRejected();
            });
        });
    });

    describe('addCategory() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product category should be returned when added', async (): Promise<void> => {
                const addedCategory = await ProductUseCase.addCategory?.(dependencies).execute('my_category');

                expect(addedCategory).toBeDefined();
                expect(addedCategory?.id).toBeDefined();
                expect(addedCategory?.name).toBe('my_category');
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when category added without name', async (): Promise<void> => {
                await expectAsync(ProductUseCase.addCategory?.(dependencies).execute(((null as unknown) as string))).toBeRejected();
            });
        });
    });

    describe('deleteCategory() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product category should be returned when deleted', async (): Promise<void> => {
                const addedCategory = await ProductUseCase.addCategory?.(dependencies).execute('my_category');
                const deletedCategory = await ProductUseCase.deleteCategory?.(dependencies).execute((addedCategory?.id as number));

                expect(deletedCategory).toBeDefined();
                expect(deletedCategory?.id).toBe(addedCategory?.id);
                expect(deletedCategory?.name).toBe(addedCategory?.name);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when category deleted without id', async (): Promise<void> => {
                await expectAsync(ProductUseCase.deleteCategory?.(dependencies).execute(((null as unknown) as number))).toBeRejected();
            });
        });
    });

    describe('getCategory() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product category should be returned when getting category', async (): Promise<void> => {
                const addedCategory = await ProductUseCase.addCategory?.(dependencies).execute('my_category');
                const returnedCategory = await ProductUseCase.getCategory?.(dependencies).execute((addedCategory?.id as number));

                expect(returnedCategory).toBeDefined();
                expect(returnedCategory?.id).toBe(addedCategory?.id);
                expect(returnedCategory?.name).toBe(addedCategory?.name);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting category without id', async (): Promise<void> => {
                await expectAsync(ProductUseCase.getCategory?.(dependencies).execute(((null as unknown) as number))).toBeRejected();
            });
        });
    });

    describe('getAllCategories() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of product categories should be returned when getting all categories', async (): Promise<void> => {
                const addedCategory = await ProductUseCase.addCategory?.(dependencies).execute('my_category');
                const returnedCategories = await ProductUseCase.getAllCategories?.(dependencies).execute();

                expect(returnedCategories).toBeDefined();
                expect(returnedCategories?.length).toBe(1);
                expect(returnedCategories?.[0].id).toBe(addedCategory?.id);
                expect(returnedCategories?.[0].name).toBe(addedCategory?.name);
            });
        });
    });

    describe('deleteAllCategories() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of product categories should be returned when deleting all categories', async (): Promise<void> => {
                const addedCategory = await ProductUseCase.addCategory?.(dependencies).execute('my_category');
                const deletedCategories = await ProductUseCase.deleteAllCategories?.(dependencies).execute();

                expect(deletedCategories).toBeDefined();
                expect(deletedCategories?.length).toBe(1);
                expect(deletedCategories?.[0].id).toBe(addedCategory?.id);
                expect(deletedCategories?.[0].name).toBe(addedCategory?.name);
            });
        });
    });
});
