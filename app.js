'use strict';

const os = require('os');
const path = require('path');
const vo = require('vo');

const Xray = require('x-ray');
const x = Xray();

const _ = require('underscore');

const Nightmare = require('nightmare');
const Downloader = require('mt-files-downloader');
const downloader = new Downloader();

const handleEvents = require('./_handleEvents');
const printStats = require('./_printStats');

var registerDlEvents = function(num, dl) {
	handleEvents(dl, num);
	printStats(dl, num);
};

let url = 'https://egghead.io/series/step-by-step-async-javascript-with-rxjs?utm_source=drip&utm_medium=email&utm_campaign=async-programming-with-rxjs';

x(url, '.title', [{
    title: 'a',
    link: 'a@href'
}])(function(err, arr) {
    if (err) {
        console.error(err);
    } else {
		_.each(arr, function(value, index, list) {
	        if (index < 9) {
	            value.filename = '0' + (index+1) + '. ' + value.title + '.mp4';
	            // console.log(filename);
	        } else {
	            value.filename = (index+1) + '. ' + value.title + '.mp4';
	            // console.log(filename);
	        }

			videoDownload(value, index);
	    });
    }
});

function videoDownload(article, idx, filename) {
	vo(function* () {
		var nightmare = new Nightmare();
		var link = yield nightmare
			.goto(article.link)
			.evaluate(function() {
				return document.querySelector('video source').src;
			});
		yield nightmare.end();
		return link;
	})(function(err, videoLink) {
		if (err) return console.log(err);
		console.log(article.filename);
		console.log(videoLink);
		let dl = downloader.download(videoLink, article.filename).start();
	    registerDlEvents(idx, dl);
	});
}
