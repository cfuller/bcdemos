videojs.plugin('tfepm', function() {

  base_url = 'http://players.brightcove.net/4365621380001/thermo/';
  //base_url = '';
  var player = this;

  player.on('loadedmetadata', function () {
    if (window.mobileAndTabletcheck()) {
      player.controls(true);
      player.on('ended', function () {
        player.currentTime(.01);
        player.play();
      })
    }
    else {
      player.controls(false);
      player.loop(true);
    }
  });

  player.one('play', function () {
    player.poster('');
    $.getJSON(base_url + 'config.json', function (conf) {
      setTimeout(function () {
        overlay(player, conf)
      }, 2000);
    }).fail(function() {
      console.log( "error loading JSON configuration File." );
    });
  });

  /**
   * Create clickable hotspot overlay
   * @param player
   * @param conf
   */
  function overlay(player, conf) {
    //Loop through products array in conf file
    for (i = 0; i < conf.products.length; i++) {
      var h, c, o, a, hs, img, name, desc, top, left;

      //create hotspot dom elements and populate with hotspot images
      h = document.createElement('div');
      hs = '<a href="#" class="hotspot-img product-' + i + '"></a>';
      h.innerHTML = hs;

      //add positioning
      top = (conf.products[i].hotspot_y/768) * 100;
      left = (conf.products[i].hotspot_x/1024) * 100;
      a = document.createAttribute('style');
      a.value = 'position: absolute; top: ' + top + '%; left: ' + left + '%; max-width: 40px; max-height: 40px; width: 10%; height: 10%';
      h.setAttributeNode(a);

      //add class for manipulation later
      a = document.createAttribute('class');
      a.value = 'hotspot';
      h.setAttributeNode(a);

      //append hostpot to player
      document.getElementById('vjs_video_3').appendChild(h);

      //add click handler for hotspot to show product info
      $('.video-js a.product-' + i).click(function() {
        //since we've lost scope for i here we need to get it back from the class name of the a element clicked
        var i = $(this).attr('class').replace('hotspot-img product-', '');
        var p = conf.products[i];
        var closing = $('.video-js .tooltip-image-' + i).length;
        hideProducts(conf);
        if (!closing) {
          showProduct(p, player, $(this));
        }
      });
    }
    //Once all the products are loaded, fade in the hotspots
    $('.video-js .hotspot').animate({opacity: 1}, 700);
  }

  /**
   * Hide all open product detail tooltips
   * @param conf
   * @returns {boolean}
   */
  function hideProducts(conf) {
    $('.video-js .tooltip').remove();
  }

  /**
   * Open a product detail tooltip
   * @param p
   */
  function showProduct(p, player, el) {
    var c, h, a, t, i;
    i = $(el).attr('class').replace('hotspot-img product-', '');
    //create the html template for the tooltip
    t = '<div class="tooltip-image tooltip-image-' + i +'"><img src="' + base_url + p.image + '"/></div>';
    t += '<div class="tooltip-text"><span class="tooltip-name">' + p.name + ' </span><span class="tooltip-description">' + p.short_description + '</span></div>';
    t += '<div class="tooltip-buttons">' +
      '<a href="' + p.product_url + '"><span class="btn-learn-more">Learn More</span></a> ' +
      '<a href="' + p.quote_url + '"><span class="btn-quote">Request A Quote</span></a>' +
      '</div>';

    //create the tooltip container and add the templated html
    c = document.createElement('div');
    c.innerHTML = t;
    a = document.createAttribute('class');
    a.value = 'tooltip';
    c.setAttributeNode(a);

    //handle positioning
    var x, y, pos, wd, ht, top, left, off;
    wd = 525;
    ht = 273;
    off = 30;
    x = $(el).offset().left;
    y = $(el).offset().top;
    pos = p.rollover_anchor;
    switch(pos) {
      case 'top_left':
        top = y + off;
        left = x + off;
        break;
      case 'top_right':
        top = y;
        left = x - wd;
        break;
      case 'bottom_right':
        top = y - off;
        left = x - off;
        break;
      case 'bottom_center':
        top = y - ht;
        left = x - wd/2;
    }
    a = document.createAttribute('style');
    a.value = 'position: absolute; top:' + top + 'px; left: ' + left + 'px;';
    c.setAttributeNode(a);

    //add the node to the DOM
    e = document.getElementById('vjs_video_3').appendChild(c);
    $(e).animate({opacity: 1}, 500);
  }

  window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
});