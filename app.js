'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
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

let url = 'https://egghead.io/playlists/learn-about-recursion-80ae94c4';

x(url, {
	title: 'section.hero h1.title',
	list: x('#lesson-list h4.title', [{
    title: 'a',
    link: 'a@href'
	}])
})(function(err, lesson) {
    if (err) {
        console.error(err);
    } else {
				console.log(lesson);
				let dir = './' + lesson.title.replace(/\./g, '') + '/';
				if (!fs.existsSync(dir)){
				    fs.mkdirSync(dir);
				}
				_.each(lesson.list, function(value, index, list) {
	        if (index < 9) {
	            value.filename = dir + '0' + (index+1) + '. ' + value.title + '.mp4';
	            // console.log(filename);
	        } else {
	            value.filename = dir + (index+1) + '. ' + value.title + '.mp4';
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
