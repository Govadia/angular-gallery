/* Gallery module */
(function() {
	angular.module("gallery", ["search"])
	.controller('GalleryController', ['$scope', '$http', function($scope, $http) {
		this.currentPage = 0;
		this.imagesPerPage = 4;
		this.images = [];
		this.imagesView = [];
		this.currentPageImages = [];

		this.numPages = function() {
			return Math.floor(this.imagesView.length / this.imagesPerPage) + 1;
		};

		this.initPage = function(page) {
			startIndex = page * this.imagesPerPage;
			this.currentPageImages = [];
			for (var i=0; i < this.imagesPerPage && startIndex+i < this.imagesView.length; i++) {
				this.currentPageImages.push(this.imagesView[startIndex + i]);
			}
		};

		this.setPage = function(page) {
			if (page >= 0 && page <= this.numPages()) {
				this.currentPage = page;
				this.initPage(this.currentPage);
			}
		};

		this.nextPage = function() {
			var numPages = this.numPages();
			var lastPageIndex = numPages - 1;
			this.currentPage = Math.min(this.currentPage + 1, lastPageIndex);
			this.initPage(this.currentPage);
		};

		this.prevPage = function() {
			this.currentPage = Math.max(this.currentPage - 1, 0);
			this.initPage(this.currentPage);
		};

		this.onSearch = function(searchResults) {
			this.imagesView = searchResults;
			this.currentPage = 0;
			this.initPage(this.currentPage);
		};

		this.clear = function() {
			this.imagesView = this.images;
			this.currentPage = 0;
			this.initPage(this.currentPage);
		};

		$scope.init = function(gallery) {
			$http.get("images.json").then(function(data) {
				gallery.images = data.data;
				gallery.imagesView = data.data;
				gallery.currentPage = 0;
				gallery.initPage(gallery.currentPage);
			});
		};

		$scope.range = function(number) {
			range = [];
			for (var i = 0; i < number; i++) {
				range.push(i);
			}
			return range;
		};

		$scope.init(this);
	}])
	.directive('gallery', function() {
		return {
			restrict: 'E',
			templateUrl: "gallery.html"
		};
	})
})();

/* Search module */
(function() {
	angular.module('search', [])
	.controller('SearchController', ['$scope', function($scope) {
		this.search = function(keyword) {
			var content = $scope.content;
			var results = [];
			for (item in content) {
				if (content[item].title.includes(keyword)) {
					results.push(content[item]);
				}
			}
			$scope.callback({results});
		};

		this.clear = function() {
			$scope.searchText = "";
			$scope.clear();
		}
	}])
	.directive('search', function() {
		return {
			restrict: 'E',
			templateUrl: "search.html",
			scope: {
				content: '=',
				callback: '&',
				clear: '&'
			}
		};
	});
})();