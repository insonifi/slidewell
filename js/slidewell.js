(function (Slidewell, $) {
  var slideArr = function (idx) {
    var indices = [idx - 1, idx, idx + 1],
        nIdx = 0,
        len = this.length,
        offsetArr = [],
        i = 3;
    for (;i--;) {
      nIdx = (indices[i] + len) % len
      offsetArr.push(this[nIdx]);
    }
    return offsetArr;
  },
  getId = function () {
    return Math.random().toString().slice(2,7);
  },
  updateActive = function (e, delta) {
    var $this = $(this),
        id = this.id,
        state = Slidewell[id],
        $pad = $this.find('.pad'),
        pad = $pad[0],
        frameHeight = state.frameHeight,
        slides = state.slides,
        active = (state.active + delta + slides.length) % slides.length,
        rate = Slidewell.rate;
    state.active = active;
    $pad.stop(true, true);
    if (delta > 0) {
      initSlide($pad.find('.slide:first'), state);
    }
    $pad.animate({
      top: '+=' + (delta * frameHeight) + 'px',
    }, rate, function () {
      var newSlides = slideArr.call(slides, active);
      pad.style.top = state.pos;
      $pad.empty()
      $pad.append(newSlides);
    });
    return true;
  },
  updateItem = function (e, delta) {
    var $this = $(this),
        id = this.id,
        state = Slidewell[id],
        rate = Slidewell.rate,
        $pad = $this.find('.pad'),
        $slide = $pad.find('.slide').eq(1),
        nextItem = state.lastItem + delta;
    if (nextItem < 0) {
      console.debug('%s < 0', nextItem);
      state.lastItem = -1;
      return
    }
    if (nextItem > (state.items)) {
      console.debug('%s > %s', nextItem, state.items);
      state.lastItem = state.items;
      return
    }
    console.log(nextItem);
    $slide.find('[order="#"]'.replace('#', nextItem)).toggle(rate);
    if (delta === 0) {
      state.lastItem -= 1;
    } else {
      state.lastItem = nextItem;
    }
  },
  init = function () {
    var $this = $(this),
        id = this.id,
        state = Slidewell[id],
        slides = state.slides,
        $pad = $(document.createElement('div'));
    $pad.addClass('pad')
    .append([slides[slides.length - 1], initSlide(slides[0], state), slides[1]])
    .appendTo($this);
    state.frameHeight = $this.height();
    state.pos = -$this.find('.slide')[1].offsetTop;
    $pad[0].style.top = state.pos;
    console.log('populate');
  },
  initSlide = function (slide, state) {
    var $items = $(slide).find("[order]"),
        $last = $items.last();
    state.lastItem = -1;
    state.items = $last.length === 0 ? 0 : ($last.attr('order') | 0);
    $items.hide();
    slide.setAttribute('item', 0);
    return slide
  },
  processKey = function (e) {
    var inputRate = Slidewell.rate / 5;//ms
    clearTimeout(Slidewell.throttleTimer);
    Slidewell.throttleTimer = setTimeout(function () {
      if (e.keyCode === 39) {
        $('.frame').trigger('update-active', 1);
        //console.log('<<');
      }
      if (e.keyCode === 37) {
        $('.frame').trigger('update-active', -1);
        //console.log('>>');
      }
      if (e.keyCode === 38) {
        $('.frame').trigger('update-item', 0);
        //console.log('^');
      }
      if (e.keyCode === 40) {
        $('.frame').trigger('update-item', 1);
        //console.log('_');
      }
    }, inputRate);
  };
  Slidewell.rate = 300;
  $('.frame').on('update-active', updateActive)
  .on('update-item', updateItem)
  .on('init', init);
  $('body').keydown(processKey)
  .click(function (e) {
    e.preventDefault();
  });
  $('.frame').each(function () {
    var $this = $(this),
        id = getId();
    this.id = id;
    Slidewell[id] = {};
    Slidewell[id].slides = $this.find('.slide').css({
      width: $this.width(),
      height: $this.height()
    }).detach();
    Slidewell[id].active = 0;
    $this.trigger('init');
  });
}) (window.Slidewell || {}, window.jQuery)
