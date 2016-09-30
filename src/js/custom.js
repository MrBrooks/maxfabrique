/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/

$(document).ready(function() {

    /* Custom */

 /*    //= ./common/material-init.js */
 /*    //= ./common/google-analytics.js */
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

 var calc1 = new Calculator();
 var calc2 = new Calculator({
  calc: "#calc2"
 });

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

  var window_updater = new WindowUpdater([
    {
      event: "scroll",
      actions: [
        // scroll_anim.updateView,
        // video_control.update,
        // video_play.scrollControl,
        // econtenta_pixel.checkScrollConditions,
        menu.update
      ]
    },
    {
      event: "resize",
      actions: [
        // anim_on_scroll.updateItems,
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
    btn.on("click",function(){
      if(input.val() != ""){
        target.text(parseInt(input.val())* opts.multi);
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
    },10);
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
    visible: "visible"
  };

  var self = this;
  var opt = $.extend(def, options);

  var select = $(opt.selector);
  var items = [];
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
    for(var i = 0; i < items.length; i++){
      if(!items[i].item.hasClass(opt.visible)){
        if(isVisible(items[i])){
          items[i].item.addClass(opt.visible);
        }
      }
    }
  };
  self.updateItems();

  if(if_mobile){
    select.addClass(opt.visible);
  }
}

function FloatingMenu(options){
  var defs = {
    points: [0,700],
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
      if(i == offsets.length - 1 && scrollTop >= offsets[i] && scrollTop < offsets[i+1]){
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