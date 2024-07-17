document.querySelectorAll('button').forEach((btn) => {
  btn.onclick = () => {
    const urlPt = btn.getAttribute("click-url")
    if(urlPt) {
      window.open((location.host.match("192.168") || location.host.match("localhost"))? `${urlPt}.html`: urlPt, "_blank")
    }
  }
})

async function Checked() {
  let listSquare = {
    checkwindowai: "failed",
    cancreatesession: "failed",
    createthesession: "failed"
  }
  function ApplyStatusChecked() {
    document.querySelectorAll('[type-content]').forEach((list) => {
      const selected = listSquare[list.getAttribute('type-content')]
      if(selected) {
        list.setAttribute("type-status", selected)
      }
    })
  }
  if(!window.ai) return ApplyStatusChecked()
  listSquare.checkwindowai = "success"
  if((await window.ai.canCreateTextSession()) == "no") return ApplyStatusChecked()
  listSquare.cancreatesession = "success"
  try {
    await window.ai.createTextSession()
    listSquare.createthesession = "success"
    document.querySelector('[click-url]').style.display = "inline-block"
    return ApplyStatusChecked()
  } catch(err) {
    return ApplyStatusChecked()
  }
}
if(document.body.getAttribute("target-script") == "checked") { Checked() }