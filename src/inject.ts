document.body.addEventListener('mouseover', async (e) => {
  let Element = e.target as HTMLElement
  let anchorElement = (Element as HTMLAnchorElement).href
    ? (Element as HTMLAnchorElement)
    : (Element.closest('a') as HTMLAnchorElement)
  let url = ''
  if (anchorElement && anchorElement.href) {
    // anchorElement.focus()
    url = anchorElement.href
  }
  if (url) {
    if (!chrome?.runtime) return
    if (document.hasFocus()) {
      chrome.runtime.sendMessage({ focus: true, url }, (res) => {
        return true
      })
    } else {
      chrome.runtime.sendMessage({ focus: false }, (res) => {
        return true
      })
    }
  }
})
