import axios from 'axios';

const API_KEY = '14680728-3f8c28130e81fd897982d94fd';
const BASE_URL = 'https://pixabay.com/api/';

export class GetPictures {
  constructor() {
    this.query = '';
    this.page = 1;
    this.perPage = 40;
  }

  async searchImg() {
    try {
      return await axios.get(`${BASE_URL}`, {
        params: {
          key: API_KEY,
          q: this.query,
          lang: 'ru, en, uk',
          image_type: 'photo',
          orientation: 'horizontal',
          page: this.page,
          per_page: this.perPage,
          safesearch: true,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
