import axios from 'axios';
import { createMarkup } from './create-markup';
import { SearchImagesAPI } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchImagesApi = new SearchImagesAPI();

const galleryContainer = document.querySelector('.gallery');
const searchQuery = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const toTheTopBtn = document.querySelector('.top-btn');

let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  overlayOpacity: 0.9,
  widthRatio: 0.9,
});
let isActive = false;

searchQuery.addEventListener('submit', handleSearchBtnSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);
toTheTopBtn.addEventListener('click', scrollToTop);

async function handleSearchBtnSubmit(evt) {
  evt.preventDefault();
  reset();
  const {
    elements: { searchQuery },
  } = evt.currentTarget;

  searchImagesApi.query = searchQuery.value.trim();

  if (!searchQuery.value) {
    return Notify.warning('Please, enter your search request');
  }

  try {
    const { hits, totalHits } = await searchImagesApi.searchImages();

    if (!hits.length) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
    const markup = createMarkup(hits);
    if (markup) {
      galleryContainer.innerHTML = markup;
      gallery.on('show.simplelightbox');
      gallery.refresh();
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch {
    error => console.error(error);
  }
}

function handleLoadMoreClick() {
  searchImagesApi.page += 1;

  searchImagesApi
    .searchImages()
    .then(({ data }) => {
      const items = data.hits;
      if (data.totalHits <= searchImagesApi.page * searchImagesApi.per_page) {
        loadMoreBtn.classList.add('is-hidden');
        toTheTopBtn.classList.remove('is-hidden');
        searchQuery.reset();
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      const newMarkup = createMarkup(items);
      galleryContainer.insertAdjacentHTML('beforeend', newMarkup);
      gallery.refresh();
    })
    .catch(error => console.error(error));
}

function reset() {
  searchImagesApi.page = 1;
  galleryContainer.innerHTML = '';

  loadMoreBtn.classList.add('is-hidden');
  toTheTopBtn.classList.add('is-hidden');
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  loadMoreBtn.classList.add('is-hidden');
  toTheTopBtn.classList.add('is-hidden');
}
