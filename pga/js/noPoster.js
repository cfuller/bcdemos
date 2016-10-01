videojs.plugin('noPoster', function() {
  var player = this;
  player.on('loadedmetadata', function() {
    var player = this;
    player.poster('');
  });
});