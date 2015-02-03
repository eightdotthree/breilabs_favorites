var breilabs = breilabs || {};

(function ( breilabs, $, undefined ) {

	'use strict';

	var REMOVED_STATUS = 'removed';
	var ADDED_STATUS = 'added';

	var favorites = breilabs.favorites = {};

	// api urls
	var _apiRoot = '/';
	var _getApiUrl = 'getjsondata.ashx?id=29';
	var _saveApiUrl = 'SaveFavorite.ashx';
	var _removeApiUrl = 'RemoveFavorite.ashx';

	var _isFavoriteClass = 'brei-is-favorite';
	var _favoritesStatusClass = 'brei-favorites-status';
	var _favoritesArray = [];
	var _favoriteToggleFunc;

	/**
	 * Sets up the UI.
	 */
	function _addUiEvents() {

		$('.brei-favorite-btn').on('click', function (event) {

			var $btn = $(this);
			var id = $btn.data().id;
			var isFavorite = favorites.isFavorite(id);

			if (isFavorite) {

				// if this is already a favorite, remove it
				favorites.removeFavorite(id).then(function (data) {

					if (data === 'success=true') {

						$btn.removeClass(hasFavClass);

						_removeFavoriteFromArray(id);
						_updateStatus();

						if (_favoriteToggleFunc) {
							_favoriteToggleFunc.call(undefined, REMOVED_STATUS, $btn);
						}

					} else {
						window.alert('There was an error removing your favorite. Please try again.');
					}

				}, function (error) {
					window.alert('There was an error removing your favorite. Please try again.');
					console.error(error);
				});

			} else {

				// if it's already not a favorite, add it
				favorites.addFavorite(id).then(function (data) {

					if (data === 'success=true') {

						$btn.addClass(hasFavClass);

						_favoritesArray.push({ID: id});
						_updateStatus();

						if (_favoriteToggleFunc) {
							_favoriteToggleFunc.call(undefined, ADDED_STATUS, $btn);
						}

					} else {
						window.alert('There was an error adding your favorite. Please try again.');
					}

				}, function (error) {
					window.alert('There was an error adding your favorite. Please try again.');
					console.error(error);
				});
			}

			return false;

		}).removeClass('disabled');

	};

	/**
	 * Removes a favorite from the local array.
	 */
	function _removeFavoriteFromArray(id) {

		var i = 0;

   		while (i < _favoritesArray.length) {
   			var favId = _favoritesArray[i].ID;
   			if (Number(favId) === Number(id)) {
   				_favoritesArray.splice(i, 1);
   				return;
   			}
   			i += 1;
   		}

	};

	/**
	 * When called this function will update the status up by one until it reachs
	 *	the number of favorites.
	 */
	function _updateStatusByCountingUp() {

		var $status = $('.' + _favoritesStatusClass);
		var total = _favoritesArray.length + 1;
		var count = Number($status.html());

		// count on up
		var statusInterval = setInterval(function() {
			if (count < total - 1) {
    			$status.html(++count % total);
    		} else {
    			clearInterval(statusInterval);
    		}
		}, 100);

	};

	/**
	 */
	function _updateStatus() {

		var $status = $('.' + _favoritesStatusClass);
		var total = _favoritesArray.length;

		$status.html(total);

	};

	/**
	 * Calls favorites.getFavorites which will return a promise
	 */
	function _getFavorites() {

		favorites.getFavorites().then(function (data) {

			if (data.ArrayOfFavoriteItem != null) {
				_favoritesArray = data.ArrayOfFavoriteItem.FavoriteItem;
				_addUiEvents();
				_updateStatusByCountingUp();
			} else {

			}	_addUiEvents();

		}, function (error) {
			console.error(error);
		});

	};


	function _showAlert(alert) {

	}


	/**
	 *
	 * Public functions
	 *
	 */


	/**
	 * Sets the params and loads the favorites
	 */
	favorites.init = function(params) {

		// if there are params passed, process them
		if (typeof params !== 'undefined') {

			if (params.apiRoot) {
				_apiRoot = params.apiRoot;
			}

			if (params.getApiUrl) {
				_getApiUrl = params.getApiUrl;
			}

			if (params.saveApiUrl) {
				_saveApiUrl = params.saveApiUrl;
			}

			if (params.removeApiUrl) {
				_removeApiUrl = params.removeApiUrl;
			}

			if (params.isFavoriteClass) {
				_isFavoriteClass = params.isFavoriteClass;
			}

			if (params.favoriteToggleFunc) {
				_favoriteToggleFunc = params.favoriteToggleFunc;
			}

		}

		if (_getApiUrl) {
			_getFavorites();
		}

		return this;

	};

	/**
   	 * will add a favorite and set the button's class
   	 */
   	favorites.addFavorite = function(id) {

		var promise = $.ajax({
			url: _apiRoot + _saveApiUrl,
			data: {
				itemid: id
			}
		});
   		return promise;

   	};

  	/**
   	 * Removes a favorite and sets the button's class appropriately
   	 */
	favorites.removeFavorite = function(id) {

		var promise = $.ajax({
			url: _apiRoot + _removeApiUrl,
			data: {
				itemid: id
			}
		});
   		return promise;

   	};

  	/**
   	 * Loads the favorites datasource using the _getApiUrl variable. Once complete, the _addUiEvents() function is called.
   	 */
   	favorites.getFavorites = function() {

	 	var promise = $.ajax({
	 		url: _apiRoot + _getApiUrl,
	 		dataType: 'jsonp',
	 		jsonp: 'callback'
	 	});
		return promise;

   	};

  	/**
   	 * Accepts an id and returns if the favorite exists in the array or not
   	 */
   	favorites.isFavorite = function(id) {

   		var isFavorite = false;
   		var i = 0;

   		while (i < _favoritesArray.length) {
   			var favId = _favoritesArray[i].ID;
   			if (Number(favId) === Number(id)) {
   				isFavorite = true;
   				break
   			}
   			i += 1;
   		}

   		return isFavorite;

	};

}( breilabs, jQuery ));
