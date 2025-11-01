import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost/kanban/api/',
  // timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});
