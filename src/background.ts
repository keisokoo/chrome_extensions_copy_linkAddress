let prefix = ''
let active = false
let focused = false
function textClipBoard(text: string) {
  text = prefix + text
  console.log('Call copy::', text)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('Copying to clipboard was successful!')
      },
      function (err) {
        console.error('Could not copy text: ', err)
      }
    )
    return
  }
  var textarea = document.createElement('textarea')
  textarea.textContent = text
  document.body.appendChild(textarea)

  var selection = document.getSelection()
  var range = document.createRange()
  if (!selection) return
  //  range.selectNodeContents(textarea);
  range.selectNode(textarea)
  selection.removeAllRanges()
  selection.addRange(range)
  console.log('copy success', document.execCommand('copy'))
  selection.removeAllRanges()

  document.body.removeChild(textarea)
}
chrome.runtime.onInstalled.addListener(() => {
  console.log('installed')
})
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.url) {
    chrome.storage.local.set({ url: request.url }, () => {})
  }
  if (typeof request.focus === 'boolean') {
    focused = request.focus
    if (active) {
      if (request.focus) {
        chrome.action.setIcon({ path: 'logo_green_48.png' })
      } else {
        chrome.action.setIcon({ path: 'logo_alert_48.png' })
      }
    }
  }
  return true
})

// background.js
chrome.action.onClicked.addListener((tab) => {
  if (active) {
    chrome.action.setIcon({ path: 'logo48.png' })
  } else {
    chrome.action.setIcon({ path: 'logo_green_48.png' })
  }
  active = !active
})
interface UrlType {
  url: string
}
chrome.commands.onCommand.addListener((command) => {
  chrome.storage.local.get(['url'], (items) => {
    if (items.url) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tabId = tabs[0].id ? tabs[0].id : 0
        if (tabId) {
          var updateProperties = { active: true }
          chrome.tabs.update(tabId, updateProperties, (tab) => {})
          chrome.scripting
            .executeScript({
              target: { tabId },
              func: textClipBoard,
              args: [items.url],
            })
            .then((res) => {})
        }
      })
    }
  })
})
