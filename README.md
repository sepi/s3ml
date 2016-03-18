# s3ml
Small, simple and stupid media listing

A small javascript library that can generate nice image blogs from images stored on a webserver 
and accessible via a directory listing ([Apache](https://wiki.apache.org/httpd/DirectoryListings), 
[nginx](http://nginx.org/en/docs/http/ngx_http_autoindex_module.html)) function. Have a look at 
[index.html](index.html) for a usage example.

The site will not be visible on browsers that don't support javascript or have it disabled but
a fallback link to the directory listing page will be shown instead.

The images will be presented in the order they are presented in the directory listing. This order 
can be adjusted easily on apache using the `request_params` attribute as shown in
[index.html](index.html).
