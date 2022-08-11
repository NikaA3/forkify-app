import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/ResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addrecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) update results view to mark selected search result
    ResultsView.update(model.getSearchResultPage());
    //1) updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //2)loading receipe
    await model.loadReceipe(id);
    const { recipe } = model.state;
    //3) rendering receipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();
    //1) get search query
    const query = SearchView.getQuery();
    if (!query) return;
    //2) load search results
    await model.loadSearchResults(query);

    //3) render results

    // ResultsView.render(model.state.search.results);
    ResultsView.render(model.getSearchResultPage(1));

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //render NEW results
  ResultsView.render(model.getSearchResultPage(goToPage));

  //4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};
//controlSearchResults();

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  // update recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //2) update recipe view
  recipeView.update(model.state.recipe);
  //3) update bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controladdRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addrecipeView.renderSpinner();
    //upload new recipe data
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);
    //success message
    addrecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addrecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addrecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addrecipeView.addHandlerUpload(controladdRecipe);
};

init();
