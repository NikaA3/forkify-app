import View from './view.js';
import previeView from './previeView.js';
import icons from 'url:../../img/icons.svg';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    console.log(this._data);
    return this._data
      .map(bookmark => previeView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
