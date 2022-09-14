class ProductMediaSlider extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.container = this.querySelector('.swiper')
    const navigation = this.dataset.showNavigation && this.dataset.showNavigation == 'true' ? true : false
    const pagination = this.dataset.showPagination && this.dataset.showPagination == 'true' ? true : false
    const zoom = this.dataset.zoomActive && this.dataset.zoomActive == 'true' ? true : false
    const thumb = this.dataset.thumbActive && this.dataset.thumbActive == 'true' ? true : false
    this.settings = {}

    if(pagination) {
      const paginationElement = this.querySelector('.swiper-pagination')
      if(paginationElement) {
        this.settings.pagination = {
          el: paginationElement,
          type: 'bullets',
        }
      }
    }

    if(navigation) {
      const prev = this.querySelector('.slide--prev-btn')
      const next = this.querySelector('.slide--next-btn')

      if(next && prev) {
        this.settings.navigation = {
          nextEl: next,
          prevEl: prev
        }
      }
    }

    if(thumb) {
      this.thumbContainer = this.querySelector('.thumb--slider')
      this.thumb = new Swiper(this.thumbContainer, {
        slidesPerView: 4,
        spaceBetween: 10,
        breakpoints: {
          768: {
            spaceBetween: 20,
          }
        }
      })

      this.settings.thumbs = {
        swiper: this.thumb,
      }
    }

    // if(zoom) {
    //   this.settings.zoom = {
    //     maxRatio: 2
    //   }
    //   const images = this.querySelectorAll('.swiper-zoom-container img')
    //   images.forEach(image => {
    //     image.addEventListener('mouseover', () => {
    //       this.slider.zoom.in()
    //     })
    //     image.addEventListener('mouseout', () => {
    //       this.slider.zoom.out()
    //     })
    //   })
    // }

    this.slider = new Swiper(this.container, this.settings)
  }
}
customElements.define('product-media-slider', ProductMediaSlider)