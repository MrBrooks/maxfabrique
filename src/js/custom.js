/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/
$(window).load(function(){
  $(window).trigger('resize');
});

$(document).ready(function() {

    /* Custom */

 /*    //= ./common/material-init.js */
 /*    //= ./common/google-analytics.js */

  $.jMaskGlobals = {
    maskElements: 'input,td,span,div',
    dataMaskAttr: '*[data-mask]',
    dataMask: true,
    watchInterval: 300,
    watchInputs: true,
    watchDataMask: true,
    byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
    translation: {
        '0': {pattern: /\d/},
        '9': {pattern: /\d/, optional: true},
        '#': {pattern: /\d/, recursive: true},
        'A': {pattern: /[a-zA-Z0-9]/},
        'S': {pattern: /[a-zA-Z]/}
    }
  };

  $(".slider").owlCarousel({
   items: 1,
   nav: true,
   dots: false,
   loop: true,
   navText: ['<div></div>','<div></div>']
  });
  var content_slider = $(".content-slider").owlCarousel({
   items: 1,
   nav: true,
   dots: false,
   loop: true,
   navText: ['<div></div>','<div></div>'],
  });
  var tabs_slider = $("#tabs-slider").owlCarousel({
   items: 1,
   nav: false,
   dots: false,
  });
  if($(window).width() < 768){
    var mobile_team_slider = $("#team .people").addClass("owl-carousel").owlCarousel({
      items: 1,
      nav: true,
      dots: false,
      loop: true,
      navText: ['<div></div>','<div></div>']
    });
  }

 var calc1 = new Calculator();
 var calc2 = new Calculator({
  calc: "#calc2"
 });

 var scroll_anim = new AnimOnScroll({
  selector: ".down-up",
  visible: "visible"
 });

  var autoplay = new AutoPlay({
    selector: ".cyclic-anim li",
    class: 'active',
    prev: 'prev',
    pause: 3000
  });
  autoplay.start();
 // $('.money').mask("### ###", {reverse: true, optional: true});
 // $.applyDataMask();
 mobilePictures();
 mobilePopup();

  $("input[name='phone']").mask('+7 (000) 000-00-00');

  content_slider.on("changed.owl.carousel",function(e){
  // console.log(e);
  // console.log(e.item.index % e.item.count);
  // console.log(e.item.index);
  var moved_index = e.item.index % e.item.count;
  if(moved_index == 2 || moved_index == 3){
    // console.log("1");
    tabs_slider.trigger("to.owl.carousel", [0, 300, true]);
  } else{
    // console.log("2");
    tabs_slider.trigger("to.owl.carousel", [1, 300, true]);
  }

  });

  var menu = new FloatingMenu();
  var logo = new Logo();

  var window_updater = new WindowUpdater([
    {
      event: "scroll",
      actions: [
        scroll_anim.updateView,
        logo.update,
        // video_control.update,
        // video_play.scrollControl,
        // econtenta_pixel.checkScrollConditions,
        menu.update
      ]
    },
    {
      event: "resize",
      actions: [
        scroll_anim.updateItems,
        logo.resize,
        // full_height.update
      ]
    }
  ]);
  $('a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
    && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target
      || $('[name=' + this.hash.slice(1) +']');
      if ($target.length) {
        var targetOffset = $target.offset().top;
        $('html,body')
        .animate({scrollTop: targetOffset}, 1000);
       return false;
      }
    }
  });

  $(window).trigger('scroll');
});

function Calculator(options){
  var defs = {
    multi: 149,
    calc: "#calc1",
    input: "input",
    target: "#calc-result span",
    submit_btn: "#eval",
  };

  var opts = $.extend(defs, options);
  var calc = $(opts.calc);
  var btn = calc.find(opts.submit_btn),
      input = calc.find(opts.input),
      target = calc.find(opts.target);

  function init(){
    target.mask("### ###", {reverse: true, optional: true});
    btn.on("click",function(){
      if(input.val() != ""){
        target.text(parseInt(input.val())* opts.multi).unmask().mask("### ###", {reverse: true, optional: true});
      }
    });
  }
  init();
}

function WindowUpdater(opts){ 
  var self = this, timer;

  self.add = function(event, func){
    for(var i = 0; i < opts.length; i++){
      if(opts[i].event === event){
        opts[i].actions.push(func);
        break;
      }
    }
  };

  self.update = function(event){
    clearTimeout(timer);
    timer = setTimeout(function(){
      if(event.data !== null){
        for(var i = 0; i < opts[event.data].actions.length; i++){
          opts[event.data].actions[i]();
        }
      }
      //do smthng
    },50);
  };

  self.onEvents = function(){
    for(var i = 0; i < opts.length; i++){
      $(window).on(opts[i].event, i, self.update);
    }
  };

  self.onEvents();
}

function AnimOnScroll(options){
  var def = {
    selector: ".scroll-anim",
    visible: "visible",
    delay: 300
  };

  var self = this;
  var opt = $.extend(def, options);

  var select = $(opt.selector);
  var items = [], anim_on = false;
  var H = $(window).height(), if_mobile = $(window).width() < 768? true : false;

  
  function isHidden(elem){
    var ws = $(window).scrollTop();
    if( (elem.top >= ws + H) || (elem.top + elem.height <= ws)){
      return true;
    }
    return false;
  }

  function isVisible(elem){
    var ws = $(window).scrollTop();
    if( ((elem.top > ws) && (elem.top < ws+H)) || (elem.top + elem.height > ws && elem.top < ws)){
      return true;
    }
    return false;
  }

  function isFullyVisible(elem){
    var ws = $(window).scrollTop();
    if(elem.top > ws && elem.top + elem.height < ws + H){
      return true;
    }
    return false;
  }

  function filterVisible(){
    items = _.reject(items,function(item){
      return item.item.hasClass(opt.visible);
    });
    // console.log(items.length);
  }

  self.updateItems = function (){
    items = [];
    H = $(window).height();
    select.each(function(){
      items.push({
        item: $(this),
        top: $(this).offset().top,
        height: $(this).height()
      });
    });
  };

  self.updateView = function(){
    var counter = 0, mass = [];
    for(var i = 0; i < items.length; i++){
      if(!items[i].item.hasClass(opt.visible)){
        if(isVisible(items[i])){
          mass.push(i);
          setTimeout(function(){
            try{
              items[mass[counter++]].item.addClass(opt.visible);
            } catch (e){
              // console.log(e);
            }
          },opt.delay*(counter++))
        }
      }
    }
    setTimeout(filterVisible, opt.delay*counter+100);
    counter = 0;
  };
  self.updateItems();

  if(if_mobile){
    select.addClass(opt.visible);
  }
}

function FloatingMenu(options){
  var defs = {
    points: [0,100],
    classes: ["","dark"],
    menu: ".menu"
  };
  var opts = $.extend(defs, options);
  var menu = $(opts.menu);
  var active_class = '';
  var links = menu.find("li");
  var hashes = [], offsets = [];



  var scrollTop = $(window).scrollTop();

  function init(){
    menu.find("a").each(function(){
      hashes.push($(this).attr("href"));
    });
    // console.log(hashes);

    for(var i = 0; i < hashes.length; i++){
      offsets.push($(hashes[i]).offset().top);
    }
    // console.log(offsets);
  }

  this.update = function(){
    scrollTop = $(window).scrollTop();
    // var i = 0;
    var flag = false;
    // while(scrollTop < opts.points[i] && i++ < opts.points.length){
    //   ++i;
    // }
    for(var i = 0; i < opts.points.length; i++){
      if( i == opts.points.length-1 && scrollTop >= opts.points[i]){
         menu.addClass(opts.classes[i]);
      } 
      else{
        if(scrollTop >= opts.points[i] && scrollTop < opts.points[i+1]){
          menu.addClass(opts.classes[i]);
        } else{
          menu.removeClass(opts.classes[i]);
        }
      }
    }
    for (i = 0; i < offsets.length; i++){
      if(i == offsets.length - 1 && scrollTop >= offsets[i]){
        $(links.get(i)).addClass("active");
      } else{
        if(scrollTop >= offsets[i] && scrollTop < offsets[i+1]){
          $(links.get(i)).addClass("active");
        }
        else{
          $(links.get(i)).removeClass("active");
        }
      }
    }
    // i = 0; 
    // while(i < offsets.length && scrollTop <= offsets[i]){
    //   ++i;
    // }
    // if(i < offsets.length){
    //   $(links.get(i)).addClass("active").siblings().removeClass("active");
    // } else{

    // }
  };

  function updateOptions(opts2){
    opts = $.extend(opts2);
  }
  init();
}

function AutoPlay(options){
  var def = {
    selector: ".auto-play",
    class: 'active',
    prev: 'prev',
    pause: 7000
  };
  var self = this;
  var opt = $.extend(def, options);

  var items, timer, count, iter;

  function init(){
    items = $(opt.selector);
    count = items.length;
    iter = 0;
    if(count > 0){
      $(items.get(iter)).addClass(opt.class);
    }
  }

  self.start = function (){
    if (count > 0){
      timer = setInterval(function(){
          $(items).removeClass(opt.prev);
          $(items.get(iter % count)).addClass(opt.prev);
          $(items.get(++iter % count)).addClass(opt.class).siblings().removeClass(opt.class);
      },opt.pause);
    }
  };

  self.stop = function (){
    clearInterval(timer);
  };

  init();
}


function Logo(){
  var logo = $("#logo"), logo_el = $("#logo-element"), sections = $("section"), offsets = [];
  var current_section = 0, classes = ["","svg-sprite--symbols-01","svg-sprite--symbols-02","svg-sprite--symbols-03","svg-sprite--symbols-04","svg-sprite--symbols-05","svg-sprite--symbols-06","svg-sprite--symbols-07","svg-sprite--symbols-08","svg-sprite--symbols-09","svg-sprite--symbols-10"];

  var delay = 350;

  this.update = function(){
    onScroll();
  };
  this.resize = function(){
    onResize();
  };

  function init(){
    sections.each(function(){
      offsets.push($(this).offset().top);
    });
    // console.log(sections);
    // console.log(offsets);
    // offsets.shift();
    // offsets.push(offsets[offsets.length-1]+2000);
    if(offsets.length !== classes.length){
      console.log("Sections("+offsets.length+") and classes("+classes.length+") count don't match!");
    }
  }
  function logoUpdate(index){
    logo_el.attr("class", classes[i]);
    if(index === 0){
      logo.attr("class", "svg-sprite--logo-white");
    } else{
      logo.attr("class", "svg-sprite--logo");
    }
  }

  function onScroll(){
    var scrolltop = $(window).scrollTop();
    i = 0;
    while (scrolltop >= offsets[i] && i <= offsets.length){
      ++i;
    }
    // console.log(i);
    // console.log(scrolltop);
    // console.log(offsets);
    if(current_section != --i){
      current_section = i;
      changeLogo();
    }
  }

  function onResize(){
    console.log("Logo onresize");
    offsets = [];
    init();
  }
  function logoOut(){
    logo_el.removeClass("in").addClass("out");
  }
  function logoIn(){
    logoUpdate(current_section);
    logo_el.removeClass("out").addClass("in");
  }
  function changeLogo(){
    // logo_el.addClass("out");
    logoOut();
    _.delay(logoIn, delay);
  }
  init();
}

function mobilePictures(){
  var imgs = $("[data-msrc]");
  var originals = [];

  function init(){
    imgs.each(function(){
      originals.push($(this).attr("src"));
      $(this).attr("src",$(this).attr("data-msrc"));
    });

  }
  if($(window).width() < 768){
    init();
  }
}
function mobilePopup(){
  var popups = $("#mobile-popups .popup"),
      btns_open = $(".mobile-popup-open"),
      btns_close = $(".popup-close-btn");

  function init(){
    btns_open.on("click",function(){
      var index = parseInt($(this).attr("data-index")) - 1;
      $(popups.get(index)).addClass("active");
    });
    btns_close.on("click",function(){
      var index = parseInt($(this).attr("data-index")) - 1;
      $(popups.get(index)).removeClass("active");
    });

  }

  init();
}

