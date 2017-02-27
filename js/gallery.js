/* Gallery module */
(function() {
	angular.module("gallery", ["search"])
	.controller('GalleryController', ['$scope', '$http', function($scope, $http) {
		this.currentPage = 0;
		this.imagesPerPage = 4;
		this.images = [];
		this.currentPageImages = [];

		var gallery = this;
		$http.get("images.json").then(function(data) {
			gallery.images = data.data;
			$scope.init(gallery);
		});

		this.numPages = function() {
			return Math.floor(this.images.length / this.imagesPerPage) + 1;
		};

		this.initPage = function(page) {
			startIndex = page * this.imagesPerPage;
			this.currentPageImages = [];
			for (var i=0; i < this.imagesPerPage && startIndex+i < this.images.length; i++) {
				this.currentPageImages.push(this.images[startIndex + i]);
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
			this.images = searchResults;
			$scope.init(this);
		};

		$scope.init = function(gallery) {
			gallery.currentPage = 0;
			gallery.initPage(gallery.currentPage);
		};

		$scope.range = function(number) {
			range = [];
			for (var i = 0; i < number; i++) {
				range.push(i);
			}
			return range;
		};
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
	}])
	.directive('search', function() {
		return {
			restrict: 'E',
			templateUrl: "search.html",
			scope: {
				content: '=',
				callback: '&'
			}
		};
	});
})();