import { io } from 'socket.io-client';
import { BACKEND_URL } from './config/config';

// "undefined" means the URL will be computed from the `window.location` object
export const socket = io(BACKEND_URL);