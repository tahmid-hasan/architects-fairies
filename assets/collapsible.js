class CollapsibleContent extends HTMLElement {
  constructor(){super(),this.expanded=false,this.lineClamp=3}
  connectedCallback(){
    const content = this.querySelector('.__content')
    if(content.hasAttribute('before-initiate')) content.removeAttribute('before-initiate')

    this.content=this.querySelector('.__content')
    this.control = this.querySelector('button.collapsible--control-btn')

    this.control.addEventListener('click', this.toggleContent.bind(this))
    this.lineClamp = this.dataset.lineClamp ? parseInt(this.dataset.lineClamp) : this.lineClamp
    
    this.lineHeight = getComputedStyle(this.content).getPropertyValue('line-height')
    this.fullHeight = this.content.offsetHeight
    console.log('full height: ', this.fullHeight, this.lineHeight)
    
    this.iniateStyle()
    
  }
  toggleContent(){
    this.expanded = !this.expanded
    this.iniateStyle()
  }
  
  iniateStyle(){
    const content_height = parseInt(this.lineHeight.replace('px')) * this.lineClamp
    if(content_height > this.fullHeight){
      this.expanded=true
      this.control.classList.add('hidden')
    }
    if(!this.expanded) {
      this.content.style['height'] = this.fullHeight + 'px'
      setTimeout(()=>{
        this.content.style['height'] = `calc(${this.lineHeight} * ${this.lineClamp})`
        this.content.style['display'] = '-webkit-box'
        this.content.style['-webkit-box-orient'] = 'vertical'
        this.content.style['-webkit-line-clamp'] = this.lineClamp
        this.content.style['overflow'] = 'hidden'
        this.control.innerHTML = "Show more"
      },300)
      
    }
    else {
      this.content.style['-webkit-line-clamp'] = 'unset'
      this.content.style['height'] = this.fullHeight + 'px'
      this.content.style['overflow'] = 'hidden'
      this.control.innerHTML = "Show less"
      setTimeout(()=>{
        this.content.style['height'] = 'unset'
      },300)
    }
  }
}
customElements.define('collapsible-content', CollapsibleContent)