# Mock API Setup

This project includes a mock version of the API to work locally without depending on the remote API.

## Installation

First, install the dependencies (if you haven't already):

```bash
npm install
```

## Usage

### 1. Start the mock server

In a terminal, run:

```bash
npm run mock-api
```

This will start json-server on port 3000 with the data from the `db.json` file.

### 2. Start the Angular application

In another terminal, run:

```bash
npm start
```

The application will be available at `http://localhost:4200` and will use the mock API at `http://localhost:3000`.

## Switch between local and remote API

To switch between the local (mock) API and the remote API, modify the file `src/app/core/config/api.config.ts`:

```typescript
// To use the local (mock) API
const USE_LOCAL_API = true;

// To use the remote API
const USE_LOCAL_API = false;
```

## Available endpoints

The mock server provides the same endpoints as the remote API:

- `GET http://localhost:3000/pets` - Get all pets
- `GET http://localhost:3000/pets?_page=1&_limit=6` - Get paginated pets
- `GET http://localhost:3000/pets/:id` - Get a pet by ID

## Modify mock data

The mock data is in the `db.json` file at the root of the project. You can modify this file to add, modify, or delete pets. The json-server will automatically detect the changes.

## json-server features

- **Pagination**: Uses `_page` and `_limit` as query params
- **Sorting**: Uses `_sort` and `_order` as query params
- **Filtering**: Uses any property as a query param to filter
- **Headers**: Returns `X-Total-Count` in paginated responses

For more information, check the [json-server documentation](https://github.com/typicode/json-server).
