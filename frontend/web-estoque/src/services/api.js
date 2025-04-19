// frontend/web-estoque/src/services/api.js
import axios from 'axios';

export const api = axios.create({
  // Substitua esse IP pelo IP “Network” que apareceu no serve
  // (no seu caso era 192.168.68.101) e porta do backend (5000):
  baseURL: 'http://192.168.68.101:5000',
});
