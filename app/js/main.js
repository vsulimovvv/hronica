window.addEventListener('DOMContentLoaded', () => {
  // * ===== Mask input
  // $('input[type="tel"]').mask('+7 (999) 999-99-99');


  // $('.mosaic').masonry({
  //   // options...
  //   itemSelector: '.mosaic-item',
  //   columnWidth: 200
  // });

  // * ===== Nice Select
  $('select').niceSelect();

  // * ===== Load Form
  (function loadForm() {
    var $fileInput = $('.file-input');
    var $droparea = $('.file-drop-area');

    // highlight drag area
    $fileInput.on('dragenter focus click', function () {
      $droparea.addClass('is-active');
    });

    // back to normal state
    $fileInput.on('dragleave blur drop', function () {
      $droparea.removeClass('is-active');
    });

    // change inner text
    $fileInput.on('change', function () {
      var filesCount = $(this)[0].files.length;
      var $textContainer = $(this).prev();

      if (filesCount === 1) {
        var fileName = $(this).val().split('\\').pop();
        $textContainer.text(fileName);
      } else {
        $textContainer.text('Выбрано: ' + filesCount);
      }
    });

    // let inputs = document.querySelectorAll('.input-file-upload');
    // Array.prototype.forEach.call(inputs, function (input) {
    //   let label = input.previousElementSibling,
    //     labelVal = label.querySelector('.custom-file-upload span').innerText;

    //   input.addEventListener('change', function (e) {
    //     let countFiles = '';
    //     if (this.files && this.files.length >= 1)
    //       countFiles = this.files.length;

    //     if (countFiles)
    //       label.querySelector('.custom-file-upload span').innerText =
    //         'Выбрано файлов: ' + countFiles;
    //     else
    //       label.querySelector('.custom-file-upload span').innerText = labelVal;
    //   });
    // });
  })();

  // * ===== Accordion
  const toggleAccordion = (accordionControl, accordionContent, accordion) => {
    const filters = document.querySelectorAll(accordionControl);
    filters.forEach((el) => {
      if (el) {
        el.addEventListener('click', (e) => {
          const target = e.target.closest(accordion);
          const content = target.querySelector(accordionContent);
          target.classList.toggle('active');
          if (target.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = null;
          }
        });
      }
    });
  };
  toggleAccordion('.accordion-control-btn', '.accordion-content', '.accordion');

  // * ===== Fixed Header
  (function fixedHeader() {
    function scrollHeader() {
      const nav = document.querySelector('header');
      if (this.scrollY >= window.innerHeight - 230) {
        nav.classList.add('scroll-header');
      } else {
        nav.classList.remove('scroll-header');
      }
    }
    window.addEventListener('scroll', scrollHeader);
    // ! Change
    function changeBg() {
      const header = document.querySelector('header');
      if (window.pageYOffset >= window.innerHeight - 230) {
        header.classList.add('scroll-header');
      }
    }
    changeBg();
  })();

  // * ===== Show Aside
  (function showMenu() {
    const menuBtn = document.querySelector('.header__toggle--anim');
    const menu = document.querySelector('.aside-mobile');
    const body = document.querySelector('body');

    if (menuBtn && menu) {
      menuBtn.addEventListener('click', (e) => {
        menu.classList.toggle('active');
        body.classList.toggle('no-scroll');
        menuBtn.classList.toggle('active');
      });
    }
  })();

  // * ===== Show Menu
  (function showMenu() {
    const menuBtn = document.querySelector('.header__toggle');
    const menu = document.querySelector('.mobile-menu');
    const menuCloseBtn = document.querySelector('.mobile-menu__close');
    const body = document.querySelector('body');
    const overlay = document.querySelector('.overlay');

    if (menu) {
      menuBtn.addEventListener('click', (e) => {
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
      });

      overlay.addEventListener('click', (e) => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
      });

      menuCloseBtn.addEventListener('click', (e) => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
      });
    }
  })();

  // * ===== Modal
  (function modals() {
    function bindModal(openBtn, modal, close) {
      const openBtnEl = document.querySelectorAll(openBtn);
      const modalEl = document.querySelector(modal);
      const closeEl = document.querySelectorAll(close);
      const body = document.querySelector('body');
      if (modalEl) {
        openBtnEl.forEach((el) => {
          el.addEventListener('click', (e) => {
            if (e.target) {
              e.preventDefault();
            }
            modalEl.classList.add('active');
            body.classList.add('no-scroll');
          });
        });
        closeEl.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            modalEl.classList.remove('active');
            body.classList.remove('no-scroll');
          });
        });
        modalEl.addEventListener('click', (e) => {
          if (e.target === modalEl) {
            modalEl.classList.remove('active');
            body.classList.remove('no-scroll');
          }
        });
      }
    }
    bindModal('.btn-prices', '.popup--prices', '.popup__close');
    bindModal('.btn-login', '.popup--login', '.popup__close');
    bindModal('.btn-reg', '.popup--reg', '.popup__close');
  })();

  // * ===== Toggle Tabs
  function someTabs(headerSelector, tabSelector, contentSelector, activeClass) {
    const header = document.querySelectorAll(headerSelector);
    const tab = document.querySelectorAll(tabSelector);
    const content = document.querySelectorAll(contentSelector);
    header.forEach((el) => {
      if (el) {
        hideTabContent();
        showTabContent();
        function hideTabContent() {
          content.forEach((item) => {
            item.classList.remove('active');
          });
          tab.forEach((item) => {
            item.classList.remove(activeClass);
          });
        }
        function showTabContent(i = 0) {
          content[i].classList.add('active');
          tab[i].classList.add(activeClass);
        }
        header.forEach((item) => {
          if (item) {
            item.addEventListener('click', (e) => {
              const target = e.target;
              if (target.classList.contains(tabSelector.replace(/\./, ''))) {
                tab.forEach((item, i) => {
                  if (target == item || target.parentNode == item) {
                    hideTabContent();
                    showTabContent(i);
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  someTabs('.faq-tabs', '.faq-tabs__btn', '.faq-tabs__content', 'active');
  someTabs('.files-tabs', '.files-tabs__btn', '.files-tabs__content', 'active');
});
