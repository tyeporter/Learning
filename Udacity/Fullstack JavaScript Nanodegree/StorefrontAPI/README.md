# StorefrontAPI
> **NOTE**: You need to have PostgreSQL installed to run this application

<br>

StorefrontAPI is mock API for a fake storefront written in Node.js, TypeScript, and PostgreSQL using a clean-ish architecture.


<br>

## Accessing the API
The API can be accessed from the `api/v1` endpoint; this should be used for auth and admin actions. To access the store API, use `api/v1/store` endpoint instead; this should be used for customer actions.

<br>

## Example Request
The following request creates a new user:

Method: `POST`

URL: `http://localhost:3000/api/v1/users`

Payload:
```json
{
    "username": "testUser",
    "password": "password123",
    "firstName": "Testing",
    "lastName": "Account"
}
```

<br>

## Available Endpoints
You may use the following endpoints and provide required / optional payload values for various tasks:

### Authentication Endpoints
- Sign Up
  - `/sign-up` (POST)
    - Required
      - `username` (`string`)
      - `password` (`string`)
    - Optional
      - `firstName` (`string`)
      - `lastName` (`string`)
- Sign In
  - `/sign-in` (POST)
    - Required
      - `username` (`string`)
      - `password` (`string`)
- Sign Out
  - `/sign-out` (POST)

### Administrator Endpoints (Level 1)
- Users
  - `/users` (GET, POST, PUT)
    - Required
      - `username` (`string`) (POST, PUT)
      - `password` (`string`) (POST)
      - `level` (`number`) (POST, PUT)
    - Optional
      - `firstName` (`string`) (POST, PUT)
      - `lastName` (`string`) (POST, PUT)

  - `/users/:id` (GET, DELETE)
- Products
  - `/products` (GET, POST, PUT)
    - Required
      - `id` (`string`) (PUT)
      - `name` (`string`) (POST, PUT)
      - `price` (`number`) (POST, PUT)
    - Optional
      - `description` (`string`) (POST, PUT)
      - `categoryId` (`number`) (POST, PUT)
  - `/products/:id` (GET, DELETE)
- Orders
  - `/orders` (GET, POST, PUT)
    - Required
      - `id` (`number`) (PUT)
      - `status` (`string`) (POST, PUT)
  - `/orders/:id` (GET, DELETE)

### Customer Endpoints (Level 0)
- Account
  - `/account` (GET, PUT, DELETE)
    - Required
      - `username` (`string`) (PUT)
      - `firstName` (`string`) (PUT)
      - `lastName` (`string`) (PUT)
- Account Orders
  - `/account/orders` (GET)
  - `/account/orders/:orderId` (GET)
- Cart
  - `/cart` (GET)
  - `/cart/remove-item/:productId` (DELETE)
- Checkout
  - `/checkout` (PUT)
- Products
  - `/products` (GET)
  - `/products/:productId` (GET)
  - `/products/:productId/add-to-cart` (POST)
- Categories
  - `/categories` (GET)
  - `/categories/:categoryId` (GET)

<br>

## Running the Project
To run the project:
1. Download the source code from this repository
2. Open your terminal and `cd` into the project folder
3. Install the dependencies by running  `npm install`
4. Create a `.env` file at the project's root and use the following template:
   ```YAML
   # Server
   PORT=3000
   API_PREFIX=/api/v1

   # Database
   POSTGRES_HOST=127.0.0.1
   POSTGRES_DB_PROD=your-production-db
   POSTGRES_DB_TEST=your-test-db
   POSTGRES_USER=your-db-username
   POSTGRES_PASSWORD=your-db-password

   # Encryption
   BCRYPT_SECRET=your-bcrypt-secret
   BCRYPT_ROUNDS=your-bcrypt-rounds
   ACCESS_SECRET=your-access-secret
   REFRESH_SECRET=your-refresh-secret
   ```
5. Run the application using `npm start`

### Testing
The [Jasmine](https://www.npmjs.com/package/jasmine) test suite can be ran using the following command:

```npm test```

### Building
To build the project, use the following command:

```npm run build```

After running the `build` command, a  `/dist` folder will be generated with the transpiled `.js` files.

<br>

## Contributors
This project is maintained by the following people:
<p>
    <a href="https://github.com/tyeporter">
        <img src="https://avatars1.githubusercontent.com/u/16263420?s=460&v=4" width="100" height="100" />
    </a>
</p>
