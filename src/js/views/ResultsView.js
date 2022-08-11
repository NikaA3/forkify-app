import View from './view.js';
import previeView from './previeView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found four your query. Try again!';
  _message = '';

  _generateMarkUp() {
    console.log(this._data);
    return this._data.map(result => previeView.render(result, false)).join('');
  }
}

export default new ResultsView();
