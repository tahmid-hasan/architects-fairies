class ProductBuyButtons extends HTMLElement{
  constructor(){super()}
  connectedCallback(){
    this.button_container=this.querySelector(".product-buy-buttons--primary"),
    this.button_text=this.querySelector(".product-buy-buttons--cta-text"),
    this.form=this.querySelector(".product-buy-buttons--form"),
    this.root=this.closest(`[data-product-id='${this.dataset.id}']`),
    this.select_input=this.querySelector(".product-buy-buttons--select"),
    this.smart_button=this.querySelector(".product-buy-buttons--smart"),
    this.primary_button=this.querySelector(".product-buy-buttons--cta"),
    this.addToCartListener(),
    this.updateViewListener()
    this.hasOptions=true
    document.querySelector('body').addEventListener("productOptionsLoadedJS", this.productOptionsLoadedListener.bind(this))
  }
  productOptionsLoadedListener(e){
    const option_container=this.querySelector('.w3-product-options.loaded .product-options-control-container')
    if(!option_container){
      this.hasOptions=false
    }
    else{
      this.hasOptions=true
    }
  }
  addToCartListener(){
    this.form.on("submit",async t=>{
      t.preventDefault();
      var e=t.target,
      s=theme.utils.getAvailableQuantity(e);
      if(!this.hasOptions) {
        "drawer"!==theme.settings.cart_type&&!1!==s||(t.preventDefault(),t.stopPropagation()),
        s&&this.button_container.setAttribute("data-loading",!0),
        "drawer"===theme.settings.cart_type&&s&&(t=await theme.cart.addItem(e),this.button_container.setAttribute("data-loading",!1),t&&(await theme.cart.updateAllHtml(),this.addProductComplete()))
      }
      else{
        const errorElement = this.querySelector('.product-options-errors')
        const error_container = document.querySelector('.product--options-errors')
        if(errorElement) {
          const errorCopy = errorElement.cloneNode(true)
          if(!error_container.classList.contains('show')) error_container.classList.add('show')
          error_container.innerHTML=""
          error_container.appendChild(errorCopy)
          setTimeout(()=>{error_container.classList.remove('show'),error_container.innerHTML=""},4000)
        }
      }
    })
  }
  addProductComplete(){
    theme.off_canvas.toggleView("cart"),
    "closed"===theme.off_canvas.state&&(theme.off_canvas.openRight(),
    theme.off_canvas.last_trigger=this.primary_button)
  }
  updateViewListener(){
    this.root.on("variantUpdated",t=>{
      t=t.detail;const e=this.select_input.querySelector("option[selected]");
      e&&e.removeAttribute("selected"),t&&t.available?(this.selectVariant(t.id),this.updateView(!0,!0)):t&&!t.available?(this.selectVariant(t.id),this.updateView(!1,!0)):this.updateView(!1,!1)
    })
  }
  selectVariant(t){
    const e=this.select_input.querySelector(`option[value='${t}']`);
    e.setAttribute("selected",!0)
  }
  updateView(t,e){
    t?(this.primary_button.removeAttribute("disabled"),this.button_text.innerText=theme.translations.add_to_cart,this.smart_button&&(this.smart_button.style.display="block")):(this.primary_button.setAttribute("disabled",!0),this.smart_button&&(this.smart_button.style.display="none"),this.button_text.innerText=e?theme.translations.out_of_stock:theme.translations.unavailable)
  }
}
customElements.define("product-buy-buttons-root",ProductBuyButtons);