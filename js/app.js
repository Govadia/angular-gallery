(function() {
	var app = angular.module("gallery", []);
	
	app.controller('GalleryController', ['$scope', function($scope) {
		this.currentPage = 0;
		this.imagesPerPage = 4;
		this.images = [
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "https://d1eipm3vz40hy0.cloudfront.net/images/p-apps-marketplace/apps/27281/logo.png"},
		{ path: "https://d1eipm3vz40hy0.cloudfront.net/images/p-apps-marketplace/apps/27281/logo.png"},
		{ path: "https://d1eipm3vz40hy0.cloudfront.net/images/p-apps-marketplace/apps/27281/logo.png"},
		{ path: "https://d1eipm3vz40hy0.cloudfront.net/images/p-apps-marketplace/apps/27281/logo.png"},
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" }
		];

		this.currentPageImages = [];

		var calcNumPages = function(images, imagesPerPage) {
			return Math.floor(images.length / imagesPerPage) + 1;
		};

		this.initPage = function(page) {
			startIndex = page * this.imagesPerPage;
			this.currentPageImages = [];
			for (var i=0; i < this.imagesPerPage && startIndex+i < this.images.length; i++) {
				this.currentPageImages.push(this.images[startIndex + i]);
			}
		};

		this.setPage = function(page) {
			if (page >= 0 && page <= calcNumPages(this.images, this.imagesPerPage)) {
				this.currentPage = page;
				this.initPage(this.currentPage);
			}
		};

		this.nextPage = function() {
			var numPages = calcNumPages(this.images, this.imagesPerPage);
			var lastPageIndex = numPages - 1;
			this.currentPage = Math.min(this.currentPage + 1, lastPageIndex);
			this.initPage(this.currentPage);
		};

		this.prevPage = function() {
			this.currentPage = Math.max(this.currentPage - 1, 0);
			this.initPage(this.currentPage);
		};

		$scope.init = function(gallery) {
			gallery.initPage(gallery.currentPage);
		};

		$scope.init(this);
	}]);
})();
