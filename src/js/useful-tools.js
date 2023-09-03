export class helper {
  static loadMoreBtnEl = document.querySelector('.load-more');
  static galleryEl = document.querySelector('.gallery');
  static showLoadMoreBtn() {
    this.loadMoreBtnEl.classList.remove('is-hidden');
  }

  static hideLoadMoreBtn() {
    this.loadMoreBtnEl.classList.add('is-hidden');
  }
  static clearMarkup() {
    this.galleryEl.innerHTML = '';
  }

  static smoothScroll() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
