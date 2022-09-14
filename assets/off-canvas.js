class OffCanvas extends HTMLElement{
  constructor(){super()}
  connectedCallback(){
    this.focus_triggers=this.querySelectorAll(".off-canvas--focus-trigger"),
    this.left_sidebar=this.querySelector(".off-canvas--left-sidebar"),
    this.main_content=this.querySelector(".off-canvas--main-content"),
    this.overlay=this.querySelector(".off-canvas--overlay"),
    this.right_sidebar=this.querySelector(".off-canvas--right-sidebar"),
    this.state="closed",
    (theme.off_canvas=this).load()
  }
  load(){
    this.close=document.querySelectorAll("[data-off-canvas--close]"),
    this.triggers=document.querySelectorAll("[data-off-canvas--open]"),
    this.setViewPortHeight(),
    this.viewPortHeightListener(),
    this.toggleListeners(),
    this.touchListener(),
    this.closeListeners(),
    this.transitionListeners()
  }
  reset(){
    [...this.triggers,this.overlay,this.close].forEach(t=>t.off("click keydown")),
    this.load()
  }
  setState(t){
    this.state=t,
    this.setAttribute("data-off-canvas--state",t),
    "left--opening"===this.state&&(this.left_sidebar.setAttribute("data-transition","forwards"),this.overlay.setAttribute("data-transition","forwards")),
    "left--closing"===this.state&&(this.left_sidebar.setAttribute("data-transition","backwards"),this.overlay.setAttribute("data-transition","backwards")),
    "right--opening"===this.state&&(this.right_sidebar.setAttribute("data-transition","forwards"),this.overlay.setAttribute("data-transition","forwards")),
    "right--closing"===this.state&&(this.right_sidebar.setAttribute("data-transition","backwards"),this.overlay.setAttribute("data-transition","backwards"))
  }
  setViewPortHeight(){
    this.style.minHeight=window.innerHeight+"px"
  }
  viewPortHeightListener(){
    window.on("resize",()=>this.setViewPortHeight())
  }
  toggleListeners(){
    this.triggers.on("click keydown",t=>{
      if("keydown"!==t.type||"Enter"===t.key){
        const s=t.target;
        var e=s.getAttribute("data-off-canvas--open"),i=(this.last_trigger=s).getAttribute("data-handle");
        if("left-sidebar"===e)this.toggle("left-sidebar");
        else if("right-sidebar"===e){
          if(this.toggleView(s.getAttribute("data-off-canvas--view")),"product-form"===this.right_sidebar_view)theme.quick_add.initForm(s);
          else if("filter"===this.right_sidebar_view){
            e=s.getAttribute("data-toggle-menu");
            window.trigger("theme:navigation:toggleFilterMenu",e)
          }
          else if("cart"===this.right_sidebar_view&&i)return t.preventDefault(),t.stopPropagation(),theme.quick_add.addToCart(s),!1;this.toggle("right-sidebar")
        }
        t.preventDefault(),t.stopPropagation()
      }
    })
    ,[...this.close,this.overlay].on("click keydown",t=>{
      "keydown"===t.type&&"Enter"!==t.key||("left--opened"===this.state?this.toggle("left-sidebar"):"right--opened"===this.state&&this.toggle("right-sidebar"))
    })
  }
  closeListeners(){window.on("keydown",t=>{"Escape"===t.key&&("left--opened"===this.state?this.toggle("left-sidebar"):"right--opened"===this.state&&this.toggle("right-sidebar"))}),this.focus_triggers.on("focus",()=>{"left--opened"===this.state?this.toggle("left-sidebar"):"right--opened"===this.state&&this.toggle("right-sidebar")})}toggleView(t){this.right_sidebar.setAttribute("data-active",t),this.right_sidebar_view=t}toggle(t){"left-sidebar"===t&&"closed"===this.state?this.openLeft():"left-sidebar"===t&&"left--opened"===this.state?this.closeLeft():"right-sidebar"===t&&"closed"===this.state?this.openRight():"right-sidebar"===t&&"right--opened"===this.state&&this.closeRight()}openLeft(){this.style.overflow="hidden",this.left_sidebar.style.display="block",this.window_offset=window.pageYOffset,this.main_content.style.top=`-${this.window_offset}px`,this.main_content.style.position="fixed",this.setState("left--opening"),window.scrollTo(0,0)}openRight(){this.style.overflow="hidden",this.right_sidebar.style.display="block",this.window_offset=window.pageYOffset,this.main_content.style.top=`-${this.window_offset}px`,this.main_content.style.position="fixed",this.setState("right--opening"),window.scrollTo(0,0)}openComplete(t){let e;"right-sidebar"===t?(e=this.right_sidebar.querySelector(`[data-view='${this.right_sidebar_view}']`),window.trigger("theme:offCanvas:rightOpened")):"left-sidebar"===t&&(e=this.left_sidebar.querySelector("[data-view='menu']"),window.trigger("theme:offCanvas:leftOpened"));const i=theme.a11y.getFocusableEl(e);i.length&&i[0].focus()}closeLeft(){this.setState("left--closing"),this.last_trigger.focus()}closeRight(){this.setState("right--closing"),this.last_trigger.focus()}closeComplete(){this.style.overflow="unset",this.left_sidebar.style.display="none",this.right_sidebar.style.display="none",this.main_content.style.position="relative",this.main_content.style.top="initial",window.scrollTo(0,this.window_offset)}touchListener(){theme.utils.isTouchDevice()&&(document.documentElement.on("theme:swipe:left",()=>{"left--opened"===this.state&&this.toggle("left-sidebar")}),document.documentElement.on("theme:swipe:right",()=>{"right--opened"===this.state&&this.toggle("right-sidebar")}))}transitionListeners(){this.overlay.on("transition:at_start",()=>{this.setState("closed"),this.closeComplete()}),this.overlay.on("transition:at_end",()=>{"left--opening"===this.state&&(this.setState("left--opened"),this.openComplete("left-sidebar")),"right--opening"===this.state&&(this.setState("right--opened"),this.openComplete("right-sidebar"))})}}customElements.define("off-canvas-root",OffCanvas);