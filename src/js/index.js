import { helper } from './useful-tools';
import { createMarkup } from './create-markup';
import { GetPictures } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const getPictures = new GetPictures();

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

let lightbox = null;

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreClick);

async function onSearchFormSubmit(event) {
  event.preventDefault();

  getPictures.query = event.target.elements.searchQuery.value.trim();
  getPictures.resetPage();

  if (!getPictures.query) {
    Notify.failure('Sorry, enter something in search line.');
    helper.clearMarkup();
    helper.hideLoadMoreBtn();
    return;
  }

  try {
    const { data } = await getPictures.searchImg();
    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      helper.clearMarkup();
      helper.hideLoadMoreBtn();
      return;
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    galleryEl.innerHTML = createMarkup(data.hits);
    helper.showLoadMoreBtn();

    lightbox = new SimpleLightbox('.gallery  a', {
      captionDelay: 250,
      scrollZoom: false,
      captionsData: 'alt',
      captionPosition: 'bottom',
    });

    if (data.totalHits <= getPictures.perPage) {
      helper.hideLoadMoreBtn();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  getPictures.incrementPage();

  try {
    const { data } = await getPictures.searchImg();

    if (Math.ceil(data.totalHits / getPictures.perPage) === getPictures.page) {
      helper.hideLoadMoreBtn();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    galleryEl.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    lightbox.refresh();
    helper.smoothScroll();
  } catch (error) {
    console.log(error);
  }
}
