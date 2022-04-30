let active = false
let focused = false

function textClipBoard(text: string, failed?: string) {
  function popToast(msg: string, failedMsg?: string) {
    let existElement = document.querySelector('#copy_address_1843_cw')
    if (existElement) existElement.remove()
    let toastElement = document.createElement('div')
    toastElement.innerText = `Copied!, "${
      msg.length > 50 ? msg.slice(0, 50) + '...' : msg
    }"`
    if (failedMsg) toastElement.innerText = failedMsg
    toastElement.style.position = 'fixed'
    toastElement.style.zIndex = '99999'
    toastElement.style.top = '30px'
    toastElement.style.right = '30px'
    toastElement.style.background = '#ffffffcc'
    toastElement.style.borderRadius = '12px'
    toastElement.style.fontSize = '14px'
    toastElement.style.padding = '5px 12px'
    toastElement.style.color = '#32383a'
    toastElement.id = 'copy_address_1843_cw'
    document.body.appendChild(toastElement)
    toastElement.addEventListener('click', () => {
      toastElement.remove()
    })
    setTimeout(() => {
      toastElement.remove()
    }, 3000)
  }
  if (failed) {
    popToast('', failed)
    return
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      function () {
        popToast(text)
      },
      function (err) {
        popToast('Copy Failed')
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
  const copied = document.execCommand('copy')
  if (copied) {
    popToast(text)
  } else {
    popToast('Copy Failed')
  }
  selection.removeAllRanges()

  document.body.removeChild(textarea)
}
chrome.runtime.onInstalled.addListener(() => {
  console.log('installed')
})
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.options) {
    chrome.storage.sync.set({ options: request.options }, () => {})
  }
  if (typeof request.focus === 'boolean') {
    focused = request.focus
    if (active) {
      if (request.focus) {
        chrome.action.setIcon({ path: 'logo_green_48.png' })
        chrome.storage.local.set({ url: request.url }, () => {})
      } else {
        chrome.action.setIcon({ path: 'logo_alert_48.png' })
        chrome.storage.local.set({ url: '' }, () => {})
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

interface FormValues {
  before: string
  after: string
}
chrome.commands.onCommand.addListener((command) => {
  chrome.storage.local.get(['url'], (items) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabId = tabs[0].id ? tabs[0].id : 0
      if (tabId) {
        var updateProperties = { active: true }
        chrome.tabs.update(tabId, updateProperties, (tab) => {})
        if (items.url && active && focused) {
          let copyText = items.url
          chrome.storage.sync.get(['options'], (items) => {
            if (!items.options) return
            let values = items.options as FormValues

            if (values.before) {
              copyText = values.before + copyText
            }
            if (values.after) {
              copyText = copyText + values.after
            }
            chrome.scripting
              .executeScript({
                target: { tabId },
                func: textClipBoard,
                args: [copyText],
              })
              .then((res) => {})
          })
        } else if (active && !focused) {
          chrome.scripting
            .executeScript({
              target: { tabId },
              func: textClipBoard,
              args: [items.url, 'Document is not focused!'],
            })
            .then((res) => {})
        }
      }
    })
  })
})
