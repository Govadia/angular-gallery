/* Gallery */
(function() {
	var DEFAULT_ITEMS_PER_PAGE = 4;
	var SEARCH_ENABLE_DEFAULT = true;
	var SORT_ENABLE_DEFAULT = true;
	var PAGINATION_ENABLE_DEFAULT = true;

	var GallerySearchService = function() {
		this.search = function(items, keyword) {
			var searchResults = [];
			for (var item in items) {
				if (items[item].title.toLowerCase().includes(keyword.toLowerCase())) {
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
		this.paginationVisible = true;
		this.sortingVisible = true;
		this.images = [];
		this.imagesView = [];
		this.sortOptions = [];

		this.isPaginationEnabled = function() {
			if ($scope.enablePagination) {
				return $scope.enablePagination == 'true';
			}
			return PAGINATION_ENABLE_DEFAULT;
		};

		this.isPaginationVisible = function() {
			return this.paginationVisible && this.isPaginationEnabled();
		};

		this.isSortingVisible = function() {
			return this.sortingVisible && this.isSortingEnabled();
		};

		this.isSearchEnabled = function () {
			if ($scope.enableSearch) {
				return $scope.enableSearch == 'true';
			}
			return SEARCH_ENABLE_DEFAULT;
		};

		this.initPage = function(page) {
			if (this.isPaginationEnabled()) {
				this.imagesView = pagingSvc.getPageContent(page);
			} else {
				this.imagesView = this.images;
			}
		};

		this.onSearch = function(keyword) {
			var searchResults = searchSvc.search(this.images, keyword);
			this.imagesView = searchResults;
			this.paginationVisible = false;
			this.sortingVisible = false;
		};

		this.onSearchClear = function() {
			this.paginationVisible = true;
			this.sortingVisible = true;
			this.initPage(0);
			signalPaginationReset();
		};

		this.isSortingEnabled = function() {
			if($scope.enableSort) {
				return $scope.enableSort == 'true';
			}
			return SORT_ENABLE_DEFAULT;
		};

		this.onSort = function(field) {
			this.images.sort(function(a,b) {
				return a[field].localeCompare(b[field]);
			});
			this.initPage(0);
			this.paginationVisible = true;
			signalPaginationReset();
			signalSearchReset();
		};

		this.getSortOptions = function() {
			return this.sortOptions;
		};

		var self = this;
		var setPage = function(page) {
			if (page >= 0 && page <= pagingSvc.numPages()) {
				self.initPage(page);
			}
		};

		var signalPaginationReset = function() {
			$scope.$broadcast('pagination-reset', null);
		};

		var signalSearchReset = function() {
			$scope.$broadcast('search-reset', null);
		};

		$scope.init = function(galleryCtrl) {
			$http.get('images.json').then(function(data) {
				galleryCtrl.images = data.data;
				galleryCtrl.sortOptions = Object.keys(galleryCtrl.images[0]);
				$scope.numPages = 0;
				if (galleryCtrl.isPaginationEnabled()) {
					var itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
					if ($scope.itemsPerPage) {
						itemsPerPage = Number($scope.itemsPerPage);
					}
					pagingSvc.init(galleryCtrl.images, itemsPerPage);
					$scope.numPages = pagingSvc.numPages();
				}
				galleryCtrl.initPage(0);
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
				enableSearch: '@',
				enablePagination: '@',
				enableSort: '@'
			},
			controller: GalleryController,
			controllerAs: 'galleryCtrl'
		};
	};

	var app = angular.module('gallery', ['search', 'pagination', 'sorting']);
	app.directive('gallery', GalleryDirective);
	app.service('SearchService', GallerySearchService);
	app.service('PagingService', GalleryPaginationService);
})();

/* Search */
(function() {
	var SearchController = function($scope) {
		this.search = function(keyword) {
			$scope.searchCallback({ keyword: keyword });
		};

		$scope.$on('search-reset', function(event, data) {
			$scope.searchText = '';
		});

		this.clear = function() {
			$scope.searchText = '';
			$scope.clearCallback();
		};
	};
	SearchController.$inject = ['$scope'];

	var SearchDirective = function () {
		return {
			restrict: 'E',
			templateUrl: 'search.html',
			scope: {
				searchCallback: '&',
				clearCallback: '&'
			},
			controller: SearchController,
			controllerAs: 'searchCtrl'
		};
	};

	var app = angular.module('search', []);
	app.directive('search', SearchDirective);
})();

/* Sorting */
(function() {
	var SortingController = function ($scope) {
		this.sort = function () {
			$scope.sortCallback({field: $scope.selectedName});
		};
	};
	SortingController.$inject = ['$scope'];

	var SortingDirective = function () {
		return {
			restrict: 'E',
			templateUrl: 'sorting.html',
			scope: {
				sortOptions: '=',
				sortCallback: '&'
			},
			controller: SortingController,
			controllerAs: 'sortingCtrl'
		};
	};

	var app = angular.module('sorting', []);
	app.directive('sorting', SortingDirective);
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

		$scope.$on('pagination-reset', function(event, data) {
			self.setPage(0);
		});

	};
	PaginationController.$inject = ['$scope'];

	var PaginationDirective = function () {
		return {
			restrict: 'E',
			templateUrl: 'pagination.html',
			scope: {
				numPages: '=',
				setPageCallback: '&'
			},
			controller: PaginationController,
			controllerAs: 'paginationCtrl'
		};
	};

	var app = angular.module('pagination', []);
	app.directive('pagination', PaginationDirective);
})();