class DynamicCart extends HTMLElement{
  constructor(){super()}
  connectedCallback(){
    this.button=this.querySelector('button[data-form-id]')
    this.id=this.button.dataset.formId
    this.form=document.querySelector(`form[id="${this.id}"]`)
    this.buy = this.form.querySelector('.product-buy-buttons--primary .product-buy-buttons--cta')
    this.button.on('click',this.handleSubmit.bind(this))
  }
  handleSubmit(e){
    e.preventDefault()
    this.buy.click()
  }
}
customElements.define("dynamic-cart-root",DynamicCart);