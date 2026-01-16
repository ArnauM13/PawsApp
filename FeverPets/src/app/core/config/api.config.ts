export const API_CONFIG = {
  baseUrl: 'https://my-json-server.typicode.com/Feverup/fever_pets_data',
  endpoints: {
    pets: '/pets',
    petById: (id: number) => `/pets/${id}`
  }
};
