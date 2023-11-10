
    // active class move on td data

function clicktable () {
    $('.symbol-name ').click(function () {
      $('#screenerdata').addClass('active-selector')
      $('#screenerdata').removeClass(['company-selector', 'market-selector', 'pe-selector', 'sector-selector', 'industry-selector', 'country-selector' , 'price-selector','change-selector', 'volume-selector', 'avg-volu-selector' ])
    });

    // 2nd td
    $('.company-name ').click(function () {
      $('#screenerdata').addClass('company-selector')
      $('#screenerdata').removeClass(['active-selector', 'market-selector', 'pe-selector', 'sector-selector', 'industry-selector', 'country-selector', 'price-selector','change-selector', 'volume-selector', 'avg-volu-selector'  ])
    });

    // 3rd td
    $('.market-cap').click(function () {
      $('#screenerdata').addClass('market-selector') 
      $('#screenerdata').removeClass(['company-selector', 'active-selector', 'pe-selector', 'sector-selector', 'industry-selector', 'country-selector', 'price-selector','change-selector' , 'volume-selector', 'avg-volu-selector' ])
    });

    // 4th td
    $('.pe ').click(function () {
      $('#screenerdata').addClass('pe-selector')
      $('#screenerdata').removeClass(['company-selector', 'active-selector', 'market-selector', 'sector-selector', 'industry-selector', 'country-selector', 'price-selector','change-selector', 'volume-selector', 'avg-volu-selector'  ])
    });

      // 5th td
    $('.sector  ').click(function () {
      $('#screenerdata').addClass('sector-selector')
      $('#screenerdata').removeClass(['company-selector', 'active-selector', 'market-selector', 'pe-selector', 'industry-selector', 'country-selector', 'price-selector' ,'change-selector', 'volume-selector', 'avg-volu-selector' ])
    });

    // 6th
    $('.industry').click(function () {
        $('#screenerdata').addClass('industry-selector')  
        $('#screenerdata').removeClass(['company-selector', 'active-selector', 'market-selector', 'pe-selector', 'sector-selector', 'country-selector', 'price-selector' ,'change-selector', 'volume-selector', 'avg-volu-selector' ])
    });

  // 7 th
  $('.country').click(function () {
    $('#screenerdata').addClass('country-selector')      
    $('#screenerdata').removeClass(['company-selector', 'active-selector', 'market-selector', 'pe-selector', 'sector-selector', 'industry-selector', 'price-selector','change-selector' , 'volume-selector', 'avg-volu-selector' ])
  }); 

  // 8th
  $('.price').click(function () {
      $('#screenerdata').addClass('price-selector')      
      $('#screenerdata').removeClass(['company-selector', 'active-selector', 'market-selector', 'pe-selector', 'sector-selector', 'industry-selector', 'country-selector', 'change-selector' , 'volume-selector', 'avg-volu-selector' ])
  }); 

  // 9th
  $('.change').click(function () {
      $('#screenerdata').addClass('change-selector')      
      $('#screenerdata').removeClass(['company-selector', 'active-selector', 'market-selector', 'pe-selector', 'sector-selector', 'industry-selector', 'country-selector', 'price-selector', 'volume-selector', 'avg-volu-selector'  ])
  });

  // 10 th
  $('.volume').click(function () {
      $('#screenerdata').addClass('volume-selector')      
      $('#screenerdata').removeClass(['company-selector', 'active-selector', 'market-selector', 'pe-selector', 'sector-selector', 'industry-selector', 'country-selector', 'price-selector', 'change-selector', 'avg-volu-selector'  ])
  }); 

  // 11
  $('.avg-volu').click(function () {
      $('#screenerdata').addClass('avg-volu-selector')      
      $('#screenerdata').removeClass(['company-selector', 'active-selector', 'market-selector', 'pe-selector', 'sector-selector', 'industry-selector', 'country-selector', 'price-selector', 'change-selector', 'volume-selector'  ])
  });  
  
  setTimeout(function(){ 
    $('#owl-sliding').owlCarousel({
        loop: true,
        nav: true,
        dots: true,
        autoplayHoverPause: true,
        autoplay: true,
        margin:0,
        navText: [
            "<i class='bx bx-chevron-left'></i>",
            "<i class='bx bx-chevron-right'></i>"
        ],
        responsive: {
            0: {
                items: 2,
            },
            576: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            }
        }
    });
    }, 2000);
}
