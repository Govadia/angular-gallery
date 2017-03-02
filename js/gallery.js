/* Gallery */
(function() {
	var DEFAULT_ITEMS_PER_PAGE = 10;

	var GallerySearchService = function() {
		this.search = function(items, keyword) {
			var searchResults = [];
			for (var item in items) {
				if (items[item].title.includes(keyword)) {
					searchResults.push(items[item]);
				}
			}
			return searchResults;
		};
	};

	var GalleryPaginationService = function () {
		this.data = [];
		this.imagesPerPage = -1;
		this.init  = function (data, imagesPerPage) { //TODO: discuss with Ariel
			this.data = data;
			this.imagesPerPage = imagesPerPage;
		};

		this.numPages = function() {
			return Math.floor(this.data.length / this.imagesPerPage) + 1;
		};

		this.getPageContent = function(page) {
			var startIndex = page * this.imagesPerPage;
			var currentPageContent = [];
			for (var i=0; (i < this.imagesPerPage) && (startIndex+i < this.data.length); i++) {
				currentPageContent.push(this.data[startIndex + i]);
			}
			return currentPageContent;
		};
	};

	var GalleryController = function($scope, $http, searchSvc, pagingSvc) {
		this.paginationEnabled = true;
		this.paginationVisible = true;
		this.images = [];
		this.imagesView = [];

		this.isPaginationVisible = function() {
			return this.paginationEnabled && this.paginationVisible;
		};

		this.isSearchEnabled = function () {
			if ($scope.enableSearch) {
				return $scope.enableSearch == 'true';
			}
			return true;
		}

		this.initPage = function(page) {
			if (this.paginationEnabled) {
				this.imagesView = pagingSvc.getPageContent(page);
			} else {
				this.imagesView = this.images;
			}
		};

		this.onSearch = function(keyword) {
			var searchResults = searchSvc.search(this.images, keyword);
			this.imagesView = searchResults;
			this.paginationVisible = false;
		};

		this.onSearchClear = function() {
			this.initPage(0);
			this.paginationVisible = true;
		};

		var self = this;
		var setPage = function(page) {
			if (page >= 0 && page <= pagingSvc.numPages()) {
				self.initPage(page);
			}
		};

		$scope.init = function(gallery) {
			$http.get('images.json').then(function(data) {
				gallery.images = data.data;
				$scope.numPages = 0;
				if (gallery.paginationEnabled) {
					var itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
					if ($scope.itemsPerPage) {
						itemsPerPage = Number($scope.itemsPerPage);
					}
					pagingSvc.init(gallery.images, itemsPerPage);
					$scope.numPages = pagingSvc.numPages();
				}
				gallery.initPage(0);
				$scope.setPageCallback = setPage;
			});
		};

		$scope.init(this);
	};
	GalleryController.$inject = ['$scope', '$http', 'SearchService', 'PagingService'];

	var GalleryDirective = function() {
		return {
			restrict: 'E',
			templateUrl: 'gallery.html',
			scope: {
				itemsPerPage: '@',
				enableSearch: '@'
			}
		};
	};

	var app = angular.module('gallery', ['search', 'pagination']);
	app.controller('GalleryController', GalleryController);
	app.directive('gallery', GalleryDirective);
	app.service('SearchService', GallerySearchService);
	app.service('PagingService', GalleryPaginationService);
})();

/* Search */
(function() {
	var SearchController = function($scope) {
		this.search = function(keyword) {
			$scope.searchEvent({ keyword: keyword });
		};

		this.clear = function() {
			$scope.searchText = "";
			$scope.clear();
		};
	};
	SearchController.$inject = ['$scope'];

	var SearchDirective = function () {
		return {
			restrict: 'E',
			templateUrl: 'search.html',
			scope: {
				searchEvent: '&',
				clear: '&'
			}
		};
	};

	var app = angular.module('search', []);
	app.controller('SearchController', SearchController);
	app.directive('search', SearchDirective);
})();

/* Pagination */
(function () {
	var PaginationController = function($scope) {
		this.currentPage = 0;

		this.nextPage = function() {
			var lastPageIndex = $scope.numPages - 1;
			this.currentPage = Math.min(this.currentPage + 1, lastPageIndex);
			$scope.setPageCallback({page: this.currentPage});
		};

		this.prevPage = function() {
			this.currentPage = Math.max(this.currentPage - 1, 0);
			$scope.setPageCallback({page: this.currentPage});
		};

		this.setPage = function(pageIndex) {
			this.currentPage = pageIndex;
			$scope.setPageCallback({page: this.currentPage});
		};

		this.range = function(number) {
			range = [];
			for (var i = 0; i < number; i++) {
				range.push(i);
			}
			return range;
		};
	};
	PaginationController.$inject = ['$scope'];

	var PaginationDirective = function () {
		return {
			restrict: 'E',
			templateUrl: 'pagination.html',
			scope: {
				numPages: '=',
				setPageCallback: '&'
			}
		};
	};

	var app = angular.module('pagination', []);
	app.controller('PaginationController', PaginationController);
	app.directive('pagination', PaginationDirective);
})();