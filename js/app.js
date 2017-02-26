(function() {
	var app = angular.module("gallery", []);
	app.controller('GalleryController', function(){
		this.currentPage = 1;
		this.imagesPerPage = 8;
		this.getImagesForPage = function(page) {
			page-=1; // convert to 0 based
			startIndex = page * this.imagesPerPage;
			pageImages = [];
			for (var i=0; i < this.imagesPerPage && startIndex+i < this.images.length; i++) {
				pageImages.push(this.images[startIndex + i]);
			}
			return pageImages;
		};

		this.images = [
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" },
		{ path: "http://www.estoreware.com/wp-content/uploads/2014/02/Yotpo_600px.jpg" }
		];
	});
})();
