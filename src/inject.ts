let _currentURL = ''
document.body.addEventListener('mouseover', async (e) => {
  let Element = e.target as HTMLElement
  let anchorElement = (Element as HTMLAnchorElement).href
    ? (Element as HTMLAnchorElement)
    : (Element.closest('a') as HTMLAnchorElement)
  let url = ''
  if (anchorElement && anchorElement.href) {
    anchorElement.focus()
    url = anchorElement.href
  }
  if (url && url !== _currentURL) {
    _currentURL = url
    if (document.hasFocus()) {
      chrome.runtime.sendMessage({ focus: true }, (res) => {})
    } else {
      chrome.runtime.sendMessage({ focus: false }, (res) => {})
    }
    chrome.runtime.sendMessage({ url }, (res) => {
      if (!res?.success) {
        console.log('error')
      } else {
        console.log('res', res)
      }
    })
  }
})
