new class{
  constructor(){
    this.loadSwipeLibrary(),
    this.configureLinks(),
    this.checkFlexBoxGap(),
    this.sectionListeners(),
    document.head.querySelector(`link[href='${theme.assets.stylesheet}'][media]`).loaded?this.load():window.on("theme:styleSheet:loaded",()=>this.load())
  }
  load(){
    document.body.setAttribute("data-assets-loaded",!0),
    document.documentElement.className=document.documentElement.className.replace("no-js","js"),
    window.trigger("theme:loaded")
  }
  loadSwipeLibrary(){
    theme.utils.libraryLoader("swipe",theme.assets.swipe,()=>{
      theme.utils.disable_prevent_scroll=!1,theme.utils.disable_swipe_listener=!1;
      const e=document.querySelectorAll("input, textarea");
      e.on("focus",()=>theme.utils.disable_prevent_scroll=!0),
      e.on("blur",()=>theme.utils.disable_prevent_scroll=!1),
      SwipeListener(document,{
        preventScroll:e=>{
          var t;if(!theme.utils.disable_prevent_scroll)return t=Math.abs(e.detail.x[0]-e.detail.x[1]),2*Math.abs(e.detail.y[0]-e.detail.y[1])<t
        }
      }),
      document.addEventListener("swipe",t=>{
        if(!theme.utils.disable_swipe_listener){
          t=t.detail.directions;
          let e;
          t.left?e="theme:swipe:left":t.right?e="theme:swipe:right":t.top?e="theme:swipe:up":t.bottom&&(e="theme:swipe:down"),
          document.documentElement.trigger(e)
        }
      })
    })
  }
  configureLinks(){
    document.querySelectorAll('[data-item="hidden-text"] a').forEach(e=>e.setAttribute("tabindex","-1"))
  }
  checkFlexBoxGap(){
    const e=document.createElement("div");
    e.style.display="flex",
    e.style.flexDirection="column",
    e.style.rowGap="1px",
    e.appendChild(document.createElement("div")),e.appendChild(document.createElement("div")),document.body.appendChild(e);
    var t=0<e.scrollHeight;
    e.remove(),
    t||(document.documentElement.classList.remove("flexbox-gap"),document.documentElement.classList.add("no-flexbox-gap"))
  }
  sectionListeners(){document.addEventListener("shopify:section:load",e=>{const t=e.target.querySelector("[data-section-id]");t.trigger("theme:section:load")}),document.addEventListener("shopify:section:unload",e=>{const t=e.target.querySelector("[data-section-id]");t.trigger("theme:section:unload")}),document.addEventListener("shopify:section:select",e=>{const t=e.target.querySelector("[data-section-id]");t.trigger("theme:section:select")}),document.addEventListener("shopify:section:deselect",e=>{const t=e.target.querySelector("[data-section-id]");t.trigger("theme:section:deselect")}),document.addEventListener("shopify:block:select",e=>{const t=e.target;t.trigger("theme:block:select")}),document.addEventListener("shopify:block:deselect",e=>{const t=e.target;t.trigger("theme:block:deselect")})}};