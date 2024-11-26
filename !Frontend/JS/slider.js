$(".top-slider .slides").slick({
    dots: false,
    arrows: false,
    infinite: true,
    loop: true,
    speed: 1000,
    autoplay: false,
    focusOnSelect: true,
    autoplaySpeed: 3000,
    centerMode: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor:
      ".middle-slider .slides, .bottom-slider .slides, .three-slide-slider .slides",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });