/*
 * Skip button plugin for Brightcove Player 2.x
 */

(function(window, document, videojs) {
  var skipButton = function(settings) {
    var player = this
    var options = {}
    
    options = (typeof videojs.mergeOptions === 'function' ? videojs.mergeOptions(options, settings) : videojs.util.mergeOptions(options, settings))
    
    videojs.addLanguage('de', {
      "Skip ahead {{seconds}} seconds": "VorwÃ¤rts {{seconds}} Sekunden",
      "Skip back {{seconds}} seconds": "ZurÃ¼ck {{seconds}} Sekunden"
    })
    
    var Button = videojs.getComponent('Button')
    
    var SkipButton = videojs.extend(Button, {
      constructor: function(player, options) {
        Button.call(this, player, options)
        if (this.options_.direction === 'forward') {
          this.controlText(this.localize('Skip ahead {{seconds}} seconds').replace('{{seconds}}', this.options_.seconds))
        } else if (this.options_.direction === 'back') {
          this.controlText(this.localize('Skip back {{seconds}} seconds').replace('{{seconds}}', this.options_.seconds))
        }
      },
      
      buildCSSClass: function() {
        /* Each button will have the classes:
           `vjs-skip`
           `skip-forward` or `skip-back`
           `skip-n` where `n` is the number of seconds
           So you could have a generic icon for "skip back" and a more
           specific one for "skip back 30 seconds"
        */
        return 'vjs-skip skip-' + this.options_.direction + ' skip-' + this.options_.seconds + ' ' + Button.prototype.buildCSSClass.call(this)
      },
      
      handleClick: function() {
        var now = player.currentTime()
        if (this.options_.direction === 'forward') {
          player.currentTime(now + this.options_.seconds)
        } else if (this.options_.direction === 'back') {
          player.currentTime(now - this.options_.seconds)
        }
      }
    })
    
    videojs.registerComponent('SkipButton', SkipButton)
    
    if (options.forward && options.forward > 0) {
      player.controlBar.skipForward = player.controlBar.addChild('skipButton', {direction: "forward", seconds: options.forward})
      player.controlBar.el().insertBefore(player.controlBar.skipForward.el(), player.controlBar.el().firstChild.nextSibling)
    }
    
    if (options.back && options.back > 0) {
      player.controlBar.skipBack = player.controlBar.addChild('skipButton', {direction: "back", seconds: options.back})
      player.controlBar.el().insertBefore(player.controlBar.skipBack.el(), player.controlBar.el().firstChild.nextSibling)
    }
    
  }
  
  videojs.plugin('skipButton', skipButton)
})(window, document, videojs)