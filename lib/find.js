(function() {
  module.exports = function(query, next) {
    var request = require('request');
    var cheerio = require('cheerio');

    var uri = 'https://9gag.com/search?query=' + query;

    var result = {
      query: null,
      sectionHeader: null,
      result: []
    };

    request({
      uri: uri,
      method: 'GET'
      }, function(err, res, html) {

      if (err) {
        return next(err, null);  
      }
      var $ = cheerio.load(html);
      
      result.query = query;
      result.sectionHeader = $('div.section-header h3').text();
      result.result = $('.badge-entry-collection > article').map(function() {
        var item = {
          title: null,
          id: null,
          url: null,
          image: null
        };
        item.title = $(this).children('header').children('h2').text().trim();
        item.id = $(this).attr('data-entry-id');
        item.url = $(this).attr('data-entry-url');
        item.video = $(this).children('.post-container').find('.gif-post').attr('data-mp4');
        item.image = $(this).children('.post-container').find('img').attr('src');
        return item;
      }).get();

      return next(null, result);
    });
  }
}());
