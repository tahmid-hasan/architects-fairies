class Modal extends HTMLElement{
  constructor(){super()}
  connectedCallback(){
    this.fullscreen="true"===this.getAttribute("data-modal-fullscreen"),
    this.custom_close_button=this.getAttribute("data-modal-custom-close"),
    this.force_view=this.getAttribute("data-force-view"),
    this.view=this.getAttribute("data-modal-view"),
    this.nested_links=this.querySelectorAll(":scope .modal--root .modal--link"),
    this.nested_content=this.querySelectorAll(":scope .modal--root .modal--content"),
    this.links=this.querySelectorAll(".modal--link").not(this.nested_links),
    this.content=this.querySelectorAll(".modal--content").not(this.nested_content),
    this.window=document.querySelector(".modal--window"),
    this.window_container=this.window.querySelector(".modal--container"),
    this.mask=this.window.querySelector(".modal--mask"),
    this.close_button=this.window.querySelector(".modal--close"),
    this.next_button=this.window.querySelector(".modal--next"),
    this.prev_button=this.window.querySelector(".modal--prev"),
    this.slides=null,this.openListeners(),
    this.transitionListeners(),
    this.modal_state="closed",
    this.nav_lock=!1
    this.alternate_colse_buttons=this.querySelectorAll('.modal--close-button')
    this.alternate_colse_buttons.forEach(_button => {
      _button.addEventListener('click', ()=>this.close())
    })
  }
  openListeners(){
    this.links.on("keypress.CoreModal click.CoreModal quick-open",o=>{
      console.log(o)
      if("keypress"!==o.type||!1!==theme.a11y.click(o)){
        const i=o.target;
        this.links.forEach((t,e)=>{
          t===i&&("quick-open"===o.type?this.open(e,!0):this.open(e))
        }),
        o.preventDefault(),
        o.stopPropagation()
      }
    })
  }
  open(t,e=!1){
    var o;
    "closed"===this.modal_state&&(this.modal_state="opened",document.body.setAttribute("data-modal-open",!0),
    window.trigger("theme:modal:opened"),
    this.window.setAttribute("data-modal-fullscreen",this.fullscreen),
    this.window.setAttribute("data-modal-custom-close",this.custom_close_button),
    this.window.setAttribute("data-modal-view",this.view),
    theme.off_canvas.style.overflow="hidden",
    this.closeListeners(),
    this.positionListeners(),
    o=window.pageYOffset,
    theme.off_canvas.main_content.style.position="fixed",
    theme.off_canvas.main_content.style.top=`-${o}px`,
    this.moveContentToWindow(),
    1<this.slides.length&&(this.next_button.style.display="block",this.prev_button.style.display="block",this.prevListeners(),this.nextListeners()),
    this.window.style.visibility="visible",
    this.window_container.style.display="block",e?(this.slides[t].classList.add("active"),this.position()):(this.mask.setAttribute("data-transition","forwards"),
    this.loadModal(this.slides[t],()=>{
      const t=this.window_container.querySelector('input[type="text"]');
      t&&setTimeout(()=>t.focus(),0)
    })))
  }
  moveContentToWindow(){
    const t=this.querySelectorAll(".modal--content").not(this.nested_content);
    t.length&&t.forEach(t=>this.window_container.appendChild(t)),
    this.slides=this.window_container.querySelectorAll(".modal--content")
  }
  extractVideoType(t){
    let e=/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i;
    return e.exec(t)?"youtube":(e=/^.*(vimeo)\.com\/(?:watch\?v=)?(.*?)(?:\z|$|&)/).exec(t)?"vimeo":!!(e=/^.*(kickstarter)\.com/g).exec(t)&&"kickstarter"
  }
  extractVideoId(t,e){
    let o,i;
    if("youtube"===e){
      if(o=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,(i=t.match(o))&&11===i[2].length)return i[2]
    }
    else if("vimeo"===e){
      if(o=/^.*(vimeo)\.com\/(?:watch\?v=)?(.*?)(?:\z|$|&)/,i=t.match(o))return i[2]
    }
    else if("kickstarter"===e&&(o=/(?:kickstarter\.com\/projects\/)(.*)(|\?)/,i=t.match(o)))return i[1]
  }
  createIframe(t,e){
    return"youtube"===t?`<iframe src='//www.youtube.com/embed/${e}?autoplay=1' frameborder='0' allowfullwidth></iframe>`:"vimeo"===t?`<iframe src='//player.vimeo.com/video/${e}?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff&amp;autoplay=1?' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`:"kickstarter"===t?`<iframe src='//www.kickstarter.com/projects/${e}/widget/video.html' frameborder='0' webkitallowfullwidth mozallowfullwidth allowfullwidth></iframe>`:void 0
  }
  loadModal(t,e){
    t.classList.add("active"),this.position(),e&&e(),this.nav_lock=!1
  }
  position(){
    let e=!1;
    if(this.window_container&&this.window_container.removeAttribute("style"),e=this.content.find(t=>t.classList.contains("active"))){
      this.window.classList.remove("fixed");
      var o=e.offsetHeight;let t=o;
      0<this.window.style.paddingTop&&(t+=parseInt(this.window.style.paddingTop)),
      0<this.window.style.paddingBottom&&(t+=parseInt(this.window.style.paddingBottom)),
      this.fullscreen||(e.classList.contains("type--image")&&(t=o),window.innerHeight>=t&&"absolute"!==this.force_view?this.window.classList.add("fixed"):(document.querySelectorAll("html, body").forEach(t=>t.scrollTo(0,0)),this.window.classList.remove("fixed")))
    }
  }
  positionListeners(){
    window.on("resize.CoreModal",()=>this.position())
  }
  nextListeners(){
    document.documentElement.on("keydown.CoreModal",t=>{
      39===t.keyCode&&this.next()
    }),
    this.next_button.on("click.CoreModal keydown.CoreModal",t=>{
      "keydown"===t.type&&"Enter"!==t.key||this.next()
    })
  }
  next(){
    this.nav_lock||(this.nav_lock=!0);
    let t;
    var e=[...this.slides].findIndex(t=>t.classList.contains("active"));
    this.slides[e].classList.remove("active"),
    t=e+1===this.slides.length?this.slides[0]:this.slides[e+1],this.loadModal(t)
  }
  prevListeners(){
    document.documentElement.on("keydown.CoreModal",t=>{
      37===t.keyCode&&this.prev()
    }),
    this.prev_button.on("click.CoreModal keydown.CoreModal",t=>{
      "keydown"===t.type&&"Enter"!==t.key||this.prev()
    })
  }
  prev(){
    this.nav_lock||(this.nav_lock=!0);
    let t;
    var e=[...this.slides].findIndex(t=>t.classList.contains("active"));
    this.slides.forEach(t=>t.classList.remove("active")),
    t=0===e?this.slides[this.slides.length-1]:this.slides[e-1],this.loadModal(t)
  }
  closeListeners(){
    document.documentElement.on("keydown.CoreModal",t=>{"Escape"===t.code&&this.close()}),
    this.close_button.on("click.CoreModal keydown.CoreModal",t=>{"keydown"===t.type&&"Enter"!==t.key||this.close()}),
    [this.mask,this.window_container].on("click.CoreModal",()=>this.close()),this.content.on("click.CoreModal",t=>t.stopPropagation()),window.on("theme:modal:close",()=>this.close())
  }
  close(t=!1){
    var e=-1*parseInt(theme.off_canvas.main_content.style.top);
    document.body.setAttribute("data-modal-open",!1),
    window.trigger("theme:modal:closed"),
    theme.off_canvas.main_content.style.top="0",
    theme.off_canvas.main_content.style.position="relative",
    theme.off_canvas.style.overflow="unset",window.scrollTo(0,e),
    this.putBackContent(),
    this.next_button.style.display="none",
    this.prev_button.style.display="none",
    this.window.style.visibility="hidden",
    t?(this.mask.style.display="none",this.window_container.innerHTML="",this.modal_state="closed"):this.mask.setAttribute("data-transition","backwards"),
    this.removeListeners()
  }
  putBackContent(){
    this.slides.forEach(t=>{
      t.classList.remove("active"),
      this.appendChild(t)
    })
  }
  removeListeners(){
    document.documentElement.off("keydown.CoreModal"),
    document.body.off("DOMMouseScroll.CoreModal mousewheel.CoreModal touchmove.CoreModal"),
    window.off("resize.CoreModal"),
    this.mask.off("click.CoreModal"),
    this.window_container.off("click.CoreModal"),
    [this.next_button,this.prev_button,this.close_button].off("click.CoreModal keydown.CoreModal")
  }
  transitionListeners(){
    this.mask.on("transition:at_start",()=>{
      this.window_container.innerHTML="",this.modal_state="closed"
    })
  }
}
  customElements.define("modal-root",Modal);