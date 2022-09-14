class StampedReviews extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.container = this.querySelector('.review--data')
    this.sliderWrapper = this.querySelector('.swiper-wrapper')
    this.reviewCountElement = this.querySelector('.review-count')
    this.reviews = []
    this.uniqueReviews = []
    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          const reviews = this.querySelectorAll('#stamped-carousel-scroll-wrapper .block')
          reviews.forEach(item => {
            const data = {}
            data.star = item.querySelector('.stamped-reviews-rating')
            data.date = item.querySelector('.stamped-reviews-date')
            data.title = item.querySelector('.stamped-reviews-title')
            data.image = item.querySelector('.stamped-reviews-image a')
            data.message = item.querySelector('.stamped-reviews-message')
            data.author = item.querySelector('.stamped-reviews-author')

            const date = data.date.innerText
            const author = data.author.innerText

            const uniqueString = date+author
            if(!this.uniqueReviews.includes(uniqueString)) {
              this.uniqueReviews.push(uniqueString)
              this.reviews.push(data)
            }
          })
        }
      }

      if(this.reviews.length > 0) {
        this.reviewsCount = this.querySelector('.stamped-carousel-subtitle-count')
        const reviewLoadEvent = new CustomEvent("review-loaded", {
          detail: this.reviews,
          bubbles: true,
          cancelable: true,
          composed: false,
        });

        this.container.dispatchEvent(reviewLoadEvent)
        observer.disconnect();
      }
    })
    observer.observe(this.container, { attributes: true, childList: true, subtree: true });
    this.container.addEventListener('review-loaded', debounce(this.onReviewLoad.bind(this), 500))
  }

  onReviewLoad(e) {
    const reviews = e.detail
    const countText = document.createElement('span')
    countText.classList.add('count--text')
    countText.innerHTML = "(" + this.reviewsCount.innerText + " reviews)"
    const countHeading = document.createElement('span')
    countHeading.innerHTML = 'Product Reviews '

    this.reviewCountElement.appendChild(countHeading)
    this.reviewCountElement.appendChild(countText)
    reviews.forEach(item => {
      const card = this.prepareCard(item)
      const slide = document.createElement('div')
      slide.classList.add('swiper-slide')

      slide.appendChild(card)
      this.sliderWrapper.appendChild(slide)
    })
    this.initSlider()
  }

  prepareCard(data) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('review-card')

    const imageWrapper = document.createElement('div')

    imageWrapper.classList.add('review-image')
    const image = data.image.cloneNode(true)
    image.querySelector('img').classList.add('swiper-lazy')
    const preloader = document.createElement('div')
    preloader.classList.add('swiper-lazy-preloader')
    image.appendChild(preloader)

    imageWrapper.appendChild(image)

    const contentWrapper = document.createElement('div')
    contentWrapper.classList.add('review-content')

    contentWrapper.appendChild(data.title.cloneNode( true ))
    contentWrapper.appendChild(data.message.cloneNode( true ))
    
    const bar = document.createElement('hr')
    bar.classList.add('review-card--bar')
    contentWrapper.appendChild(bar)

    const meta = document.createElement('div')
    meta.classList.add('review-meta')

    const author = document.createElement('span')
    author.classList.add('review-author')
    author.appendChild(data.author.cloneNode(true))

    const date = document.createElement('span')
    date.classList.add('review-date')
    date.appendChild(data.date.cloneNode(true))

    
    meta.appendChild(author)
    meta.appendChild(date)

    contentWrapper.appendChild(meta)

    const stars = document.createElement('div')
    stars.classList.add('review-stars')
    stars.appendChild(data.star.cloneNode(true))

    contentWrapper.appendChild(stars)

    wrapper.appendChild(imageWrapper)
    wrapper.appendChild(contentWrapper)

    return wrapper
  }

  initSlider() {
    const container = this.querySelector('.swiper')
    const prev = this.querySelector('.slider-control--prev')
    const next = this.querySelector('.slider-control--next')
    const pageEl = this.querySelector('.swiper-pagination')
    this.slider = new Swiper(container, {
      slidesPerView: 1,
      speed: 600,
      spaceBetween: 30,
      preloadImages: false,
      lazy: true,
      pagination: {
        el: pageEl,
        dynamicBullets: true
      },
      navigation: {
        nextEl: next,
        prevEl: prev
      },
      breakpoints: {
        768: {
          slidesPerView: 2
        },
        1400: {
          slidesPerView: 3
        }
      }
    })
  }
}
customElements.define('stamped-reviews', StampedReviews)