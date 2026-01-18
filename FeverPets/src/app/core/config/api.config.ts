// Set to true to use local mock API, false to use remote API
const USE_LOCAL_API = true;

export const API_CONFIG = {
  baseUrl: USE_LOCAL_API
    ? 'http://localhost:3000'
    : 'https://my-json-server.typicode.com/Feverup/fever_pets_data',
  endpoints: {
    pets: '/pets',
    petById: (id: number) => `/pets/${id}`
  }
};
