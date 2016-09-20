/**
 *
 */

videojs.plugin('loginForm', function() {

  var player = this;
  var loginFormTemplate = '<div class="auth-form"> ' +
    '<label for="username">Username</label> ' +
    '<input type="text" name="username" value="" /> ' +
    '<label for="password">Password</label> ' +
    '<input type="password" name="password" value="" /> ' +
    '</div>';

  alert("loginForm");
  player.on('loadedmetadata', function() {
    var player = this;
    alert('metadata loaded')
    $(player).append(loginFormTemplate)
  });

});