import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '39083023-6bd2967288a0046d4cd8dec4e';
axios.defaults.headers.common['Authorization'] = API_KEY;
axios.defaults.baseURL = 'https://pixabay.com/api/';
