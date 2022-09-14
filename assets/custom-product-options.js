function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}
window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelector('body').addEventListener("productOptionsLoadedJS", function(e) {
    const files_input = document.querySelectorAll('input[type="file"]')
    files_input.forEach(file => {
    })
  })
});

// const fields = field_names.forEach(item => item.trim())

function fieldAddedCallback(field, element) {
  const field_names = JSON.parse(document.querySelector('script[data-field-names]') ? document.querySelector('script[data-field-names]').textContent : {"field_names": []}).field_names
  const fields = field_names.map(item => item.trim())
  if((field.type == 'checkbox' || field.type == 'radiobutton')) {
    const container = document.querySelector(`div[data-field-id="${field.id}"][data-group-id="${field.fieldGroupID}"]`)
    const inputs = container.querySelectorAll('input[type="checkbox"], input[type="radio"]')
    inputs.forEach(input => {
      const sibling = input.nextSibling
      const id = create_UUID()
      input.setAttribute('id', id)
      const label = document.createElement('label')
      label.setAttribute('for', id)
      label.innerHTML = sibling.innerHTML
      sibling.parentNode.replaceChild(label, sibling)
    })
    if(fields.includes(field.name)){container.classList.add('checkbox-button')}
    else{container.classList.add('checkbox-default')}
  }

  if(field.type == 'fileupload') {
    const id = `${field.id}_${field.fieldGroupID}`
    const container = document.querySelector(`div[data-field-id="${field.id}"][data-group-id="${field.fieldGroupID}"]`)
    const file_input = container.querySelector('input[type="file"]')
    file_input.setAttribute('id', id)
    file_input.setAttribute('hidden', true)

    const label = document.createElement('label')
    label.classList.add('custom_file_upload_label')
    label.setAttribute('for', id)

    // const upload_text = document.createElement('span')
    // upload_text.innerHTML = "or upload your logo file"

    label.innerHTML = '<span>drag & drop your logo here</span><span class="underline_text">or upload your logo file</span>'
    
    container.insertBefore(label, file_input.nextSibling)

    file_input.addEventListener('change', function() {
      label.innerHTML = `<span class="underline_text">${this.files[0].name}</span>`
    })
  }
}