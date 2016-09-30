videojs.plugin('noPoster', function() {
  console.log('here');
  var player = this;
  player.on('loadedmetadata', function() {
    var player = this;
    player.poster('');
  });
});