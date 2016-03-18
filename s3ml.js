function S3ml(conf) {
    this.dom_element = document.getElementById(conf.container_id || "images");
    this.previous_page_link = document.getElementById(conf.previous_page_id || "previous-page");
    this.previous_page_link.addEventListener("click", this.previous_page.bind(this));
    this.next_page_link = document.getElementById(conf.next_page_id || "next-page");
    this.next_page_link.addEventListener("click", this.next_page.bind(this));
    this.previous_page_link.href = this.next_page_link.href = "javascript:void(0)";

    this.img_dir = conf.image_dir || "images";
    this.page_size = conf.page_size || 5;
    this.img_extensions = conf.image_extensions || ["png", "jpg", "jpeg", "gif"];
    this.request_params = conf.request_params || "?C=M;O=D";

    this.page = 0;
    this.image_names = [];

    this.get_image_names();
};

S3ml.prototype.images_in_page = function (page) {
    return this.image_names.slice(page*this.page_size,
				  (page+1)*this.page_size);
};

S3ml.prototype.load_page = function (page) {
    console.log("loading page: " + page);

    imgs_in_page = this.images_in_page(page, this.page_size);
    for (img_name of imgs_in_page) {
	var href = this.img_dir + "/" + img_name;
	this.add_image(href);
	console.log("adding image: " + href);
    }

    if (this.previous_page_available(this.page-1)) {
	this.previous_page_link.style.display = "inline";
    } else {
	this.previous_page_link.style.display = "none";
    }
    if (this.next_page_available(this.page+1)) {
	this.next_page_link.style.display = "inline";
    } else {
	this.next_page_link.style.display = "none";
    }
};

S3ml.prototype.get_image_names = function (complete) {
    var req = new XMLHttpRequest();
    req.open("GET", this.img_dir + this.request_params, true);
    req.responseType = "document"; // Parse result as HTML
    req.onreadystatechange =  (function () {
	if (req.readyState != 4 || req.status != 200) return;
	data = req.responseXML
	
	var sels = this.img_extensions.map(function(e) {return "a:contains(." + e + ")"});
	var selector = sels.join(",");
	var anchors = data.getElementsByTagName("a");
	for (anchor of anchors) {
	    var filename = anchor.href.split("/").pop();
	    var type = filename.split(".").pop();
	    if (this.img_extensions.indexOf(type) != -1) {
		this.image_names.push(filename);
	    }
	}

	console.log("got image names: ", this.image_names);

	if (document.location.hash) {
	    this.page = parseInt(document.location.hash.substring(1));
	}
	this.load_page(this.page);
    }).bind(this);
    req.send();
};

S3ml.prototype.page_count = function () {
    return Math.floor(this.image_names.length / this.page_size);
};

S3ml.prototype.add_image = function (href) {
    this.dom_element.innerHTML += "<article><a href="+href+"><img src='" +href+ "'></a></article>";
};

S3ml.prototype.clear_page = function () {
    this.dom_element.innerHTML = "";
};

S3ml.prototype.next_page_available = function() {
    return (this.images_in_page(this.page+1).length > 0);
};

S3ml.prototype.next_page = function () {
    if (this.next_page_available()) {
	this.page += 1;
	this.clear_page();
	this.load_page(this.page);
	window.location.hash = "#"+this.page;
    }
};

S3ml.prototype.previous_page_available = function () {
    return (this.page > 0);
}
    
S3ml.prototype.previous_page = function () {
    if (this.previous_page_available()) {
	this.page -= 1;
	this.clear_page();
	this.load_page(this.page);
	window.location.hash = "#"+this.page;
    }
}
