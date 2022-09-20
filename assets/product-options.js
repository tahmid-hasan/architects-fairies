class ProductOptions extends HTMLElement{
  constructor(){super()}
  connectedCallback(){
    this.first_variant_available="true"===this.dataset.firstVariantAvailable,this.is_product_page=null!==this.closest(".product-page--root"),
    this.labels=this.querySelectorAll(".disclosure--root, .radios--header"),
    this.options_container=this.querySelector(".product-options--container"),
    this.option_inputs=this.options_container.querySelectorAll('[data-item="disclosure"], [data-item="radio"]'),
    this.root=this.closest(`[data-product-id='${this.dataset.id}']`),
    this.size_chart=this.querySelector(".product-options--option .product-size-chart--root"),
    this.variants=JSON.parse(this.querySelector(".product-options--json").value),
    this.getAvailableVariants(),
    this.disableEmptyOptions(),
    this.optionChangeListener(),
    this.updateDisabledOptions(this.first_variant_available),this.size_chart&&this.moveSizeChart()
  }
  disconnectedCallback(){
    this.option_inputs.off("change.ProductOptions")
  }
  getAvailableVariants(){
    this.available_variants=[],
    this.variants.forEach(t=>{t.available&&this.available_variants.push(t.options)})
  }
  disableEmptyOptions(){
    const e=this.available_variants.flat(),
    t=this.options_container.querySelectorAll(".radios--input, .disclosure--option-link");
    t.length&&t.forEach(t=>{
      var a=this.getOptionValue(t);e.includes(a)||t.setAttribute("data-empty",!0)
    })
  }
  getOptionValue(t){
    return t.getAttribute("data-value")?t.getAttribute("data-value"):t.value
  }
  optionChangeListener(){
    this.option_inputs.on("change.ProductOptions",t=>{
      const i=[],a=this.options_container.querySelectorAll('[data-item="disclosure"], [data-item="radio"]:checked');
      a.forEach(t=>{var a=t.closest(".product-options--option").dataset.index;i.push({index:a,value:t.value})});
      let s=!1;this.variants.every(a=>{let e=!0;return i.forEach(t=>{e=e&&a.options[t.index]===t.value}),
      !e||(s=a,!1)}),
      this.updateVariant(s,t.target)
      const event = new CustomEvent("variant-change", { "detail": s })
      document.dispatchEvent(event)
    })
  }
  updateVariant(t,a){
    this.updateDisabledOptions(t.available,a),
    this.is_product_page&&this.updateHistoryState(t.id),
    this.root.trigger("variantUpdated",t)
  }
  updateHistoryState(t){
    let a=""+location.origin+location.pathname;t&&(a+="?variant="+t),
    history.replaceState({path:a},"",a)
  }
  updateDisabledOptions(t,e=!1){
    const i=this.options_container.querySelectorAll(".radios--input, .disclosure--option-link");
    if(i.length){const s=[],o=(i.forEach(t=>{t.removeAttribute("data-unavailable"),!t.checked&&"true"!==t.getAttribute("aria-current")||s.push(t)}),
    this.options_container.querySelectorAll(".disclosure--current-option"));
    let a;
    !1===e?(e=s[0],a=this.getOptionValue(e)):e.classList.contains("disclosure--input")?(a=e.value,e=s.find(t=>t.getAttribute("data-value")===a)):a=e.value;
    const r=[],
    n=e.closest(".radios--container, .disclosure--form"),
    l=n.querySelectorAll(".radios--input, .disclosure--option-link"),
    u=(l.forEach(t=>{t=this.getOptionValue(t);t!==a&&r.push(t)}),r);
    this.available_variants.forEach(t=>{t.includes(a)&&t.forEach(t=>u.push(t))}),
    i.forEach(t=>{var a=this.getOptionValue(t);u.includes(a)||t.setAttribute("data-unavailable",!0)}),
    t?o&&o.forEach(t=>t.setAttribute("data-unavailable",!1)):(s.forEach(t=>t.setAttribute("data-unavailable",!0)),o&&o.forEach(t=>t.setAttribute("data-unavailable",!0)))}
  }
  moveSizeChart(){
    const t=this.size_chart.parentNode.querySelector("label").parentNode;t.appendChild(this.size_chart)
  }
}
customElements.define("product-options-root",ProductOptions);