interface FormElement {
  before: HTMLInputElement
  after: HTMLInputElement
}
interface FormValues {
  before: string
  after: string
}
let forms = (document.forms as any)['options'].elements as FormElement
chrome.storage?.sync.get(['options'], (items) => {
  if (!items.options) return
  let values = items.options as FormValues

  if (values.before) {
    forms.before.value = values.before
  }
  if (values.after) {
    forms.after.value = values.after
  }
})
let timeout: NodeJS.Timeout
let submitButton = document.body.querySelector('#submit')!
submitButton.addEventListener('click', () => {
  let postData = {
    before: forms.before.value,
    after: forms.after.value,
  }
  let msgElement = document.querySelector('#msg')! as HTMLDivElement
  msgElement.innerText = 'Saved!...'
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    msgElement.innerText = ''
  }, 2000)
  chrome.runtime?.sendMessage({ options: postData }, () => {
    return true
  })
})
