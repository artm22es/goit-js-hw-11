import axios from 'axios';

export class SearchImagesAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '39083023-6bd2967288a0046d4cd8dec4e';

  page = 1;
  query = null;
  per_page = 40;

  async searchImages() {
    const data = await axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return data;
  }
}
