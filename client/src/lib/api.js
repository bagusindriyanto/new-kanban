import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost/kanban/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});
