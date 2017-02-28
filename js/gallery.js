/* Gallery */
(function() {
	angular.module('gallery', ['search', 'pagination'])
	.directive('gallery', function() {
		var controller = ['$http', '$scope', function($http, $scope) {
			$scope.init = function() {
				$scope.imagesPerPage = 4;
				$scope.imagesView = [];
				$http.get('images.json').then(function(data) {
					$scope.images = data.data;
					$scope.imagesView = data.data;
				});
			};

			$scope.init();
		}];

		return {
			restrict: 'E',
			templateUrl: 'gallery.html',
			controller: controller,
			controllerAs: 'galleryCtrl'
		};
	});
})();

/* Search  */
(function() {
	angular.module('search', [])
	.directive('search', function() {
		var controller = ['$scope', function($scope) {
			this.clearedView = [];
			this.search = function(keyword) {
				var content = $scope.content;
				var results = [];
				for (var item in content) {
					if (content[item].title.includes(keyword)) {
						results.push(content[item]);
					}
				}
				this.clearedView = $scope.view;
				$scope.view = results;
			};

			this.clear = function() {
				$scope.searchText = null;
				$scope.view = this.clearedView;
			};
		}];

		return {
			restrict: 'E',
			templateUrl: 'search.html',
			scope: {
				content: '=',
				view: '='
			},
			controller: controller,
			controllerAs: 'searchCtrl'
		};
	});
})();

/* Pagination */
(function () {
	angular.module('pagination', [])
	.directive('pagination', function() {
		var controller = ['$scope', function($scope) {
			var _currentPage = 0;

			$scope.$watch('items', function(newValue, oldValue, scope) {
				if (newValue != oldValue) {
				updatePageItems(_currentPage);
				scope.paginationCtrl.pages = range(scope.paginationCtrl.numPages());
				}
			});

			function range(length) {
				var range = [];
				for (var i = 0; i < length; i++) {
					range.push(i);
				}
				return range;
			}

			function updatePageItems(page) {
				var startIndex = page * $scope.itemsPerPage;
				var pageItems = [];
				for (var i=0; i < $scope.itemsPerPage && startIndex+i < $scope.items.length; i++) {
					pageItems.push($scope.items[startIndex + i]);
				}
				$scope.view = pageItems;
			}

			this.pages = [];
			this.numPages = function() {
				return Math.floor($scope.items.length / $scope.itemsPerPage) + 1;
			};

			this.isCurrent = function(pageIndex) {
				return _currentPage == pageIndex;
			};

			this.setPage = function(page) {
				if (page >= 0 && page <= this.numPages()) {
					_currentPage = page;
					updatePageItems(page);
				}
			};

			this.nextPage = function() {
				var lastPageIndex = this.numPages() - 1;
				_currentPage = Math.min(_currentPage + 1, lastPageIndex);
				updatePageItems(_currentPage);
			};

			this.prevPage = function() {
				_currentPage = Math.max(_currentPage - 1, 0);
				updatePageItems(_currentPage);
			};
		}];

		return {
			restrict: 'E',
			templateUrl: 'pagination.html',
			scope: {
				itemsPerPage: '=itemsPerPage',
				items: '=',
				view: '='
			},
			controller: controller,
			controllerAs: 'paginationCtrl'
		};
	});
})();