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
        frameHeight = Slidewell[id].frameHeight,
        $pad = $this.find('.pad'),
        pad = $pad[0],
        slides = Slidewell[id].slides,
        active = (Slidewell[id].active + delta + slides.length) % slides.length,
        rate = Slidewell.rate;
    Slidewell[id].active = active;
    $pad.stop(true, true);
    $pad.animate({
      top: '+=' + (delta * frameHeight) + 'px',
    }, rate, function () {
      pad.style.top = Slidewell[id].pos;
      $pad.empty()
      .append(slideArr.call(slides, active))
    });
    return true;
  },
  init = function () {
    var $this = $(this),
        id = this.id,
        slides = Slidewell[id].slides,
        $pad = $(document.createElement('div'));
    $pad.addClass('pad')
    .append([slides[slides.length - 1], slides[0], slides[1]])
    .appendTo($this);
    Slidewell[id].frameHeight = $this.height();
    Slidewell[id].pos = -$this.find('.slide')[1].offsetTop;
    $pad[0].style.top = Slidewell[id].pos;
    console.log('populate');
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
    }, inputRate);
  };
  Slidewell.rate = 300;
  $('.frame').on('update-active', updateActive)
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
