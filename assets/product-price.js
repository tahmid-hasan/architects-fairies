class ProductPrice extends HTMLElement{
  constructor(){super()}
  connectedCallback(){
    this.compare_price=this.querySelector(".product-price--compare"),
    this.price=this.querySelector(".product-price--original"),
    this.reference_unit=this.querySelector(".product-price--reference-unit"),
    this.reference_value=this.querySelector(".product-price--reference-value"),
    this.root=this.closest(`[data-product-id='${this.dataset.id}']`),
    this.unit_price=this.querySelector(".product-price--unit-price"),
    this.unit_price_container=this.querySelector(".product-price--unit-container"),
    this.updatePriceListener()
    document.addEventListener("variant-change", this.handleVariantChange.bind(this));
  }
  handleVariantChange(e){
    this.updatePrices(e.detail)
  }
  disconnectedCallback(){
    this.root.off("variantUpdated.productPrice")
  }
  updatePriceListener(){
    this.root.on("variantUpdated.productPrice",e=>{
      this.updatePrices(e.detail)
    })
  }
  updatePrices(e){e?(this.style.display="block",this.price.innerHTML=theme.utils.formatMoney(e.price),e.compare_at_price>e.price?(this.compare_price.innerHTML=theme.utils.formatMoney(e.compare_at_price),this.compare_price.style.display="inline-block"):this.compare_price.style.display="none",e.unit_price_measurement?(this.unit_price.innerHTML=theme.utils.formatMoney(e.unit_price),this.reference_unit.innerHTML=e.unit_price_measurement.reference_unit,1===e.unit_price_measurement.reference_value&&this.reference_value?this.reference_value.style.display="none":this.reference_value&&(this.reference_value.innerHTML=e.unit_price_measurement.reference_value,this.reference_value.style.display="block"),this.unit_price_container.style.display="flex"):this.unit_price_container.style.display="none"):this.style.display="none"}}customElements.define("product-price-root",ProductPrice);