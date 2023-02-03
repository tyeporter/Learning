import {Schema} from 'json-schema-faker';

const MockSchema: Schema = {
    type: 'object',
    properties: {
        users: {
            type: 'array',
            minItems: 3,
			maxItems: 5,
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        chance: {
                            guid: {
                                version: 4
                            }
                        }
                    },
                    username: {
                        type: 'string',
                        chance: 'twitter'
                    },
                    password: {
                        type: 'string',
                        chance: {
                            string: {
                                length: 12
                            }
                        }
                    },
                    firstName: {
                        type: 'string',
                        chance: 'first'
                    },
                    lastName: {
                        type: 'string',
                        chance: 'last'
                    },
                    level: {
                        type: 'integer',
                        chance: {
                            integer: {
                                max: 1,
                                min: 0
                            }
                        }
                    }
                },
                required: ['id', 'username', 'password', 'firstName', 'lastName', 'level']
            }
        },
        products: {
            type:'array',
            minItems: 5,
            maxItems: 10,
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        chance: {
                            guid: {
                                version: 4
                            }
                        }
                    },
                    name: {
                        type: 'string',
                        chance: 'word'
                    },
                    description: {
                        type: 'string',
                        chance: 'paragraph'
                    },
                    price: {
                        type: 'number',
                        chance: {
                            floating: {
                                min: 5,
                                max: 100,
                                fixed: 2
                            }
                        }
                    }
                },
                required: ['id', 'name', 'description', 'price']
            }
        }
    },
    required: ['users', 'products']
};

export default MockSchema;
