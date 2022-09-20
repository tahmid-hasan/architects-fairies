class Cart extends HTMLElement{
  static external_counts=document.querySelectorAll(".cart--external--total-items");
  static external_icons=document.querySelectorAll(".cart--external--icon");
  static external_prices=document.querySelectorAll(".cart--external--total-price");
  static instances=[];
  constructor(){super()}
  connectedCallback(){
    Cart.instances.push(this),
    this.abort_controllers={},
    this.view=this.getAttribute("data-view"),
    this.eventListeners(),
    this.renderDynamicCheckoutButtons();
    const dataElement = this.querySelector('script[data-promo-product-ids]')
    this.promo_ids=dataElement? JSON.parse(dataElement.textContent):"{}"
    this.updatePromoProduct()
  }
  eventListeners(){
    this.inputBoxListener(),
    this.plusButtonListener(),
    this.minusButtonListener(),
    this.removeButtonListener(),
    this.toggleLoadingOnSubmit(),
    this.noteTypingListener(),
    this.recommendedProductAdd(),
    this.continueShopifyListener()
  }
  recommendedProductAdd(){
    const t=this.querySelectorAll('.recommended--product-cta')
    t.length&&t.on("click",async t=>{
      t.preventDefault()
      t.stopPropagation()
      this.toggleLoadingDisplay(t)
      const d=parseInt(t.currentTarget.dataset.id)
      if(t.currentTarget.hasAttribute('data-remove')){
        this.removeItems([{id:d}])
      }
      else{this.addItem(d)}
    })
  }
  continueShopifyListener(){
    const t=this.querySelectorAll('.cart--continue-shopping')
    t.length&&t.on("click",async t=>{
      t.preventDefault()
      history.back();
    })
  }
  checkAvailable(){
    const t=this.querySelectorAll('.recommended--product-cta')
    const set_type_e=this.querySelector('[data-set-type]')
    const set_type=set_type_e?parseInt(set_type_e.dataset.setType):null
    let max = 2
    if(set_type=='1') max=this.promo_ids.max_product.set_1
    if(set_type=='2') max=this.promo_ids.max_product.set_2
    
    const a=this.querySelectorAll('.recommended--product-cta[data-remove]')
    
    t.forEach(bt=>{
      if(!bt.hasAttribute('data-remove')&&a.length==max){
        if(!bt.hasAttribute('disabled'))bt.setAttribute('disabled', true)
      }
      else{if(bt.hasAttribute('disabled'))bt.setAttribute('disabled', false)}
    })
  }
  addItem(id){
    const d={items:[{id:id,quantity: 1}]}
    fetch('/cart/add.js',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(d)
    })
    .then(s=>s.json())
    .then(async h=>{
      await Cart.updateAllHtml()
      this.checkAvailable()
    })
  }
  renderDynamicCheckoutButtons(){
    if(window.location.pathname===theme.urls.cart){
      const t=document.querySelector(".off-canvas--right-sidebar .cart--additional-buttons");
      if(t&&t.remove(),"small"===theme.mqs.current_window){
        const e=document.querySelector('[data-view="desktop"] .cart--additional-buttons');
        e&&e.remove()
      }
    }
  }
  inputBoxListener(){
    const t=this.querySelectorAll(".cart--quantity--input");
    t.length&&(t.on("keydown",t=>{(t.which<48||57<t.which)&&(t.which<37||40<t.which)&&8!==t.which&&9!==t.which&&t.preventDefault()}),
    t.on("focusout",async t=>{
      const e=t.target;
      var t=e.closest(".cart--item").getAttribute("data-line-num"),
      a=(this.toggleLoadingDisplay(t),
      isNaN(parseInt(e.value))?1:parseInt(e.value)),
      a=await this.updateQuantity(t,a);
      await Cart.updateAllHtml(),a||this.showQuantityError(t)
      this.updatePromoProduct()
    }))
  }
  plusButtonListener(){
    const t=this.querySelectorAll(".cart--plus");
    t.length&&t.on("click keydown",async t=>{
      if("keydown"!==t.type||"Enter"===t.key){
        t.preventDefault();
        const r=t.target.previousElementSibling;
        var t=t.target.closest(".cart--item").getAttribute("data-line-num"),
        e=(this.toggleLoadingDisplay(t),isNaN(parseInt(r.value))?1:parseInt(r.value)+1),
        a=(this.toggleLoadingDisplay(t),
        isNaN(parseInt(e.value))?1:parseInt(e.value)),
        a=await this.updateQuantity(t,a)
        r.value=e
        try{
          var a=await this.updateQuantity(t,e);
          await Cart.updateAllHtml(),a||this.showQuantityError(t)
          this.updatePromoProduct()
          location.reload()
        }
        catch{}
      }
    })
  }
  updatePromoProduct(){
    fetch('/cart.json')
    .then(r=>r.json())
    .then(c=>{
      const b=c.items.filter(item=>this.promo_ids.set_2.includes(item.id)||this.promo_ids.set_1.includes(item.id))
      this.removeItems(b)
    })
  }
  removeItems(v){
    const d={updates:{}}
    v.forEach(c=>d.updates[c.id]=0)
    fetch('/cart/update.js', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(d)
    })
    .then(s=>s.json())
    .then(async h=>{
      await Cart.updateAllHtml()
      this.checkAvailable()
    })
    .catch(e=>console.log(e))
  }
  showQuantityError(t){
    const e=this.querySelector(`.cart--item[data-line-num='${t}']`);
    e&&e.querySelector(".cart--error").removeAttribute("style")
  }
  minusButtonListener(){
    const t=this.querySelectorAll(".cart--minus");
    t.length&&t.on("click keydown",async e=>{
      if("keydown"!==e.type||"Enter"===e.key){
        e.preventDefault();
        const a=e.target.closest(".cart--quantity--container").querySelector("input");
        e=e.target.closest(".cart--item").getAttribute("data-line-num");
        this.toggleLoadingDisplay(e);
        let t=isNaN(parseInt(a.value))?1:parseInt(a.value)-1;
        t<1&&(t=1),a.value=t;
        try{
          await this.updateQuantity(e,t)
          await Cart.updateAllHtml()
          this.updatePromoProduct()
          location.reload()
        }
        catch{}
      }
    })
  }
  removeButtonListener(){
    const t=this.querySelectorAll(".cart--item--remove");
    t.length&&t.on("click",async t=>{
      t.preventDefault();
      t=t.target.closest(".cart--item").getAttribute("data-line-num");
      this.toggleLoadingDisplay(t);
      try{
        await this.updateQuantity(t,0)&&Cart.updateAllHtml()
      }
      catch{}
    })
  }
  toggleLoadingOnSubmit(){
    this.checkout_button=this.querySelector(".cart--checkout-button button"),
    this.checkout_button&&this.checkout_button.on("click",()=>this.checkout_button.setAttribute("data-loading",!0))
  }
  toggleLoadingDisplay(t){
    const e=this.querySelector(`.cart--item[data-line-num='${t}'] input`),
    a=(e&&e.setAttribute("data-loading",!0),
    this.checkout_button.setAttribute("disabled",!0),
    this.querySelector(".cart--additional-buttons"));
    a&&(a.style.visibility="hidden")
  }
  async updateQuantity(t,e){
    this.abort_controllers.line_num&&this.abort_controllers.line_num.abort(),
    this.abort_controllers.line_num=new AbortController;
    const a=this.querySelector(`.cart--item[data-line-num='${t}']`);
    var r=a.getAttribute("data-inventory-management"),
    n=a.getAttribute("data-inventory-policy"),i=parseInt(a.getAttribute("data-inventory-quantity"));
    let o=!1;i<e&&"shopify"===r&&"continue"!==n&&(o=!0,e=i);
    try{
      var s=await fetch(theme.urls.cart_change+".js",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({line:t,quantity:e}),
        signal:this.abort_controllers.line_num.signal
      });
      if(s.ok)return Cart.updateTotals(),!o;
      throw new Error(s.statusText)
    }
    catch{throw new Error("aborted")}
  }
  noteTypingListener(){
    const t=this.querySelector(".cart--notes--textarea");
    t&&t.on("input",()=>this.updateNote(t.value))
  }
  async updateNote(t){
    this.abort_controllers.note&&this.abort_controllers.note.abort(),
    this.abort_controllers.note=new AbortController;
    try{
      var e=await fetch(theme.urls.cart+"/update.js",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({note:t}),
        signal:this.abort_controllers.note.signal
      });
      if(!e.ok)throw new Error(e.statusText);
      Cart.instances.not(this).forEach(t=>t.updateHtml())
    }
    catch{}
  }
  async updateHtml(){
    const t=await fetch(theme.urls.cart+"?view=ajax-"+this.view);
    if(t.ok){
      var e=await t.text();
      const a=theme.utils.parseHtml(e,".cart--root"),
      r=this.querySelector(".cart--form");
      e=a.querySelector(".cart--form"),
      e=this.swapInImages(r,e);
      return r&&e&&r.replaceWith(e),"drawer"===this.view&&theme.off_canvas.reset(),this.eventListeners(),window.trigger("theme:cart:updated"),!0
    }
    throw new Error(t.statusText)
  }
  swapInImages(r,t){const e=t.querySelectorAll(".cart--item");if(0!==e.length)return e.forEach(t=>{var e=t.getAttribute("data-variant-id");const a=t.querySelector(".cart--item--image");r&&(t=r.querySelector(`[data-variant-id='${e}'] .cart--item--image`))&&a&&a.replaceWith(t)}),t}static updateAllHtml(){const e=[];return Cart.instances.forEach(t=>e.push(t.updateHtml())),Promise.allSettled(e)}static async addItem(t){t=new FormData(t),t=new URLSearchParams(t).toString(),t=await fetch(theme.urls.cart_add+".js",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t});if(t.ok)return Cart.updateTotals(),!0;throw new Error(t.statusText)}static async updateTotals(){const t=await fetch(theme.urls.cart+".js");if(!t.ok)throw new Error(t.statusText);{const e=await t.json(),a=(Cart.setItems(e.items),theme.utils.formatMoney(e.total_price));Cart.external_counts.forEach(t=>t.textContent=e.item_count),Cart.external_icons.forEach(t=>t.setAttribute("data-item-count",e.item_count)),Cart.external_prices.forEach(t=>t.textContent=a),Cart.instances.forEach(t=>t.setAttribute("data-has-items",0<e.item_count))}}
  static setItems(t){
    const e={};
    t.forEach(t=>e[t.id]=t.quantity),
    localStorage.setItem(theme.local_storage.cart_items,JSON.stringify(e))
  }
}
theme.cart=Cart,theme.cart.updateTotals(),
customElements.define("cart-root",Cart);

class ProductQuantityInput extends HTMLElement{
  constructor(){super()}
  connectedCallback(){
    this.plusButtonListener()
    this.minusButtonListener()
  }
  plusButtonListener(){
    const t=this.querySelectorAll(".product-quantity--plus");
    t.length&&t.on("click keydown",async t=>{
      if("keydown"!==t.type||"Enter"===t.key){
        t.preventDefault();
        this.updateInputValue('plus')
      }
    })
  }
  minusButtonListener(){
    const t=this.querySelectorAll(".product-quantity--minus");
    t.length&&t.on("click keydown",async t=>{
      if("keydown"!==t.type||"Enter"===t.key){
        t.preventDefault();
        this.updateInputValue('minus')
      }
    })
  }
  updateInputValue(t){
    const i=this.querySelector('.product-quantity--input')
    let currentValue=parseInt(i.value)
    if(t=='plus') i.value=currentValue + 1
    if(t=='minus') {
      if(currentValue!=1) i.value=currentValue - 1
    }
  }
}
customElements.define("product-quantity-root",ProductQuantityInput);