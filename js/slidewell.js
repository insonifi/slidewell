//(function ($) {
  var slideIdx = function (idx, offset) {
    return (idx + offset + this.length) % this.length;
  };
  $('.frame').on('update-active', function (e, delta) {
    var $this = $(this),
        $pad = $this.children(),
        $children,
        slides = $this.data('slides'),
        translateOffset = 0,
        active = slideIdx.call(slides, $this.data('active'), delta),
        newSlide,
        rate = 350,
        idx = 0;
    $this.data('active', active);
    translateOffset = $(window).height()/3;
    idx = slideIdx.call(slides, active, delta);
    newSlide = $(slides[idx]).addClass('slide');
    switch (delta) {
      case 1:
        $pad.append(newSlide);
        //translateOffset = $(window).height()//$children.slice(1,2).height();
        $pad.animate({
          top: '-=' + translateOffset + 'px'
        }, rate, function () {
          $pad.children().first().remove()
          .css({
            top: '0'
          });
        });
        break;
      case -1:
        $pad.prepend(newSlide);
        //translateOffset = $(window).height()//$children.slice(1,2).height();
        $pad.animate({
          top: '+=' + translateOffset + 'px'
        }, rate, function () {
          $pad.children().last().remove()
          .css({
            top: '0'
          });
        });
        break;
    }
  })
  .on('init', function () {
    var $this = $(this),
        slides = $this.data('slides'),
        pad = $(document.createElement('div'));
    pad.addClass('pad')
    .append($([slides[slides.length - 1], slides[0], slides[1]]))
    .appendTo($this);
    console.log('populate');
  });
  $('body').keydown(function (e) {
    switch (e.keyCode) {
      case 37:
        $('.frame').trigger('update-active', 1);
        console.log('<<');
        break;
      case 39:
        $('.frame').trigger('update-active', -1);
        console.log('>>');
        break;
      default:
        break;
    }
    //e.preventDefault();
  });
  $('.frame').each(function () {
    var $this = $(this);
    $this.data('slides', $this.children('.slide').detach())
    .data('active', 0)
    .trigger('init');
  });
//}) (window.jQuery)
