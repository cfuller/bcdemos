/**
 *
 */

videojs.plugin('loginForm', function() {

  var player, overlayTemplate, loginFormTemplate, lockTemplate, playerHeight;

  player = this;
  player.controls(false);
  playerHeight = $('#' + player.id_).height();
  overlayTemplate = '<div class="lock-overlay">{{content}}</div>';
  loginFormTemplate = '<form class="auth-form">' +
    '<div class="form-group">' +
    '<label for="username">Username</label> ' +
    '<input type="text" name="username" id="username" class="form-control" value="" /> ' +
    '</div>' +
    '<div class="form-group">' +
    '<label for="password">Password</label> ' +
    '<input type="password" name="password" id="password" class="form-control" value="" /> ' +
    '</div>' +
    '<button type="submit" class="btn btn-default login-submit">Submit</button>' +
    '</form>';
  lockTemplate = '<img src="img/lock-512.gif" width="100" class="lock-image" />';

  player.on('loadedmetadata', function() {
    var content = overlayTemplate.replace('{{content}}', lockTemplate);
    overlay(player, content);
    $('.lock-overlay').click(function() {
      content = overlayTemplate.replace('{{content}}', loginFormTemplate);
      $('.lock-overlay').remove();
      overlay(player, content);
      $('.auth-form').submit(function()  {
        var data = {username: $('#username').val(), password: $('#password').val()};
        $.ajax('login.php', {
          data: data,
          type: 'POST',
          success: function(data) {
            var username = data.replace('"', '').replace('"', '');
            playVideo(username, player);
          }
        });
        return false;
      })
    });
  });

  function overlay(player, content) {
    $('#' + player.id_).append(content);
  }

  function playVideo(username, player) {
    $('.lock-overlay').remove();
    player.controls(true);
    player.play();
    showUsername(username);
    var intId = setInterval(function() {
      showUsername(username);
    }, 5000);
    player.on('pause', function() {
      clearInterval(intId);
    });
  }

  function showUsername(username) {
    var top = Math.floor((Math.random() * 85) + 1);
    var left = Math.floor((Math.random() * 70) + 1);
    var content = '<div class="username-overlay" style="top:' + top + '%; left:' + left + '%;">' + username + '</div>';
    $('.username-overlay').remove();
    overlay(player, content);
  }
});