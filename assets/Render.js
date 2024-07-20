const domNode = document.getElementById("app-page")

const root = ReactDOM.createRoot(domNode)

const urlClicked = {
  home: {
    path: "./",
    comps: <HomePage />
  },
  chat: {
    path: "./chat",
    comps: <ChatBox />
  },
  statuscheck: {
    path: "./statuscheck",
    comps: <CheckSupport />
  },
}
function FirstPayload() {
  for(let pageData of Object.keys(urlClicked).map(a => ({ propkey: a, dataPath: urlClicked[a].path.slice(1) }))) {
    const namedPath = location.pathname.split(".html")[0]
    const goingURL = namedPath.slice(namedPath.length - pageData.dataPath.length)
    if(pageData.dataPath == goingURL) {
      root.render(urlClicked[pageData.propkey].comps)
    }
  }
}
function ApplyAlert(message, type) {
  const boxalert = document.createElement("div")
  boxalert.className = "alert-content"
  boxalert.innerText = String(message)
  if(type == "error") {
    boxalert.style.color = "white"
    boxalert.style.background = "red"
  }
  setTimeout(() => {
    boxalert.style.opacity = 0
    boxalert.style.scale = 0.6
    boxalert.style.marginTop = "-40px"
    setTimeout(() => { boxalert.remove() }, 300)
  }, 3000)
  document.querySelector('.alert-manage').append(boxalert)
}
FirstPayload()
async function __AppInit() {
  await new Promise((a) => setTimeout(a, 10))
  document.querySelectorAll('[click-url]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const urlPt = btn.getAttribute("click-url")
      if(!urlPt) return console.log('No attribute id!')
      if(!urlClicked[urlPt]) return console.log('No register!')
      const urlPush = urlClicked[urlPt].path
      const renderComps = urlClicked[urlPt].comps
      const buildURL = urlPush.split("").pop() == "/"? urlPush : (location.host.match("192.168") || location.host.match("localhost"))? `${urlPush}.html`: urlPush
      try {
        const fetcing = await (await fetch(buildURL)).text()
        const parserInt = new DOMParser()
        const htmlDocs = parserInt.parseFromString(fetcing, "text/html")
        const set_titlepage = htmlDocs.querySelector('head title').innerText || "window.ai"
        const set_descpage = htmlDocs.querySelector('head meta[name="description"]')?.getAttribute("content") || ""
        document.querySelector('head title').innerText = set_titlepage
        document.querySelector('head meta[name="description"]').setAttribute("content", set_descpage)
        root.render(renderComps)
        history.pushState("", "", buildURL)
      } catch(err) {
        console.error(err)
        root.render(<div className="errorview">
          <div className="errorbox">
            <h3>Opss Error!</h3>
            <p>This client has error on main script</p>
            <pre>{`Error view Message: ${err.stack}`}</pre>
          </div>
        </div>)
      }
    })
  })
  window.GistEmbed.init()
}

async function __CheckSupport() {
  await new Promise((a) => setTimeout(a, 400))
  const getDocs = document.querySelectorAll('.testprogress .testresult')
  const getDocsStatus = document.querySelectorAll('.testprogress .testresult .text p')
  // await new Promise((a) => setTimeout(a, 300))
  if(!window.ai) {
    getDocs[0].setAttribute("status", "error")
    getDocsStatus[0].innerHTML = `Your browser not support, maybe not enable it the feature, <a href="https://huggingface.co/blog/Xenova/run-gemini-nano-in-your-browser" target="_blank">please open this tips</a>`
    console.error("Not support window.ai")
  } else {
    getDocs[0].setAttribute("status", "finis")
    getDocsStatus[0].innerHTML = `Your browser is support!`
  }
  // await new Promise((a) => setTimeout(a, 300))
  try {
    const t = await window.ai.canCreateTextSession()
    if(t == "no") {
      getDocs[1].setAttribute("status", "error")
      getDocsStatus[1].innerHTML = `that status only return no, because no model to load, status: "${t}"`
      console.error("No model ready")
    } else {
      getDocs[1].setAttribute("status", "finis")
      getDocsStatus[1].innerHTML = `Status: ${t}`
    }
  } catch(err) {
    getDocs[1].setAttribute("status", "error")
    getDocsStatus[1].innerHTML = `Browser is not supported!`
    console.error("Browser is not supported!")
  }
  // await new Promise((a) => setTimeout(a, 300))
  try {
    const session = await window.ai.createTextSession()
    getDocs[2].setAttribute("status", "finis")
    const result = await session.prompt("test generate")
    getDocsStatus[2].innerHTML = `Generate result: ${result}`
    document.getElementById('support-all').style.display = "inline"
  } catch(err) {
    getDocs[2].setAttribute("status", "error")
    getDocsStatus[2].innerHTML = `Error: ${err.message}`
    document.getElementById('did-not-support').style.display = "inline"
  }
  ApplyAlert("Success process task!")
}

function HomePage() {
  __AppInit()
  return <div className="homesection">
    <div className="homescreen">
      <h3><mark>window.ai</mark></h3>
      <h3>AI Generate local on your browser</h3>
      <p>Generate text by Gemini Nano, this is not from the server but from your own browser and can run offline without the problem of lost connections.</p>
      <div style={{height: "294px"}}>
        <code data-gist-id="36cae9106b816525d9759aa9c60c13e5"></code>
      </div>
      <div className="listbtn">
        <md-filled-tonal-button click-url="statuscheck">Check Support</md-filled-tonal-button>
        <md-filled-tonal-button click-url="chat">Start Chat</md-filled-tonal-button>
      </div>
    </div>
  </div>
}
function CheckSupport() {
  __AppInit()
  __CheckSupport()
  return <div className="checkup">
    <div className="testprogress">
      <div className="testresult">
        <div className="icon">
          <div className="circle">
            <b>1</b>
            <span className="material-symbols-outlined">check</span>
          </div>
        </div>
        <div className="text">
          <h3>Founding AI in your local browser </h3>
          <p>Waiting status...</p>
        </div>
      </div>
      <div className="testresult">
        <div className="icon">
          <div className="circle">
            <b>2</b>
            <span className="material-symbols-outlined">check</span>
          </div>
        </div>
        <div className="text">
          <h3>Test for create the session prompt</h3>
          <p>Waiting status...</p>
        </div>
      </div>
      <div className="testresult lasttest">
        <div className="icon">
          <div className="circle">
            <b>3</b>
            <span className="material-symbols-outlined">check</span>
          </div>
        </div>
        <div className="text">
          <h3>Test generate prompt in your browser</h3>
          <p>Waiting status...</p>
        </div>
      </div>
      <div id="did-not-support" style={{display:"none"}}>
        <p>Your browser cannot run this local AI, it may not support or use the global (stable) version</p>
        <md-filled-tonal-button click-url="home">Back To Home</md-filled-tonal-button>
      </div>
      <div id="support-all" style={{display:"none"}}>
        <p>All tasks were completed without any problems, which means your device supports it!</p>
        <md-filled-tonal-button click-url="chat">Start Chat</md-filled-tonal-button>
      </div>
    </div>
  </div>
}
function ChatBox() {
  __AppInit()
  let sessionInit = undefined
  async function ApplyingPrompt() {
    const getInput = document.getElementById("promptinput")
    const valuePrompt = getInput.value
    if(!valuePrompt.trim()) {
      return ApplyAlert("Adding your prompt!", "error")
    }
    if(getInput.disabled) {
      return ApplyAlert("You cannot send if the message is processing", "error")
    }
    getInput.disabled = true
    try {
      const chatuser = document.createElement("div")
      const containeruser = document.createElement("div")
      const nicknameuser = document.createElement("p")
      const messageuser = document.createElement("div")
      const appedChannel = document.querySelector('.chatlist')
      // Styles
      chatuser.className = "message-user"
      containeruser.className = "message-container"
      messageuser.className = "message-text"
      // Info
      nicknameuser.innerText = "user"
      messageuser.innerText = valuePrompt
      // Applying
      containeruser.appendChild(nicknameuser)
      containeruser.appendChild(messageuser)
      chatuser.appendChild(containeruser)
      appedChannel.appendChild(chatuser)
      // ## ---------
      await new Promise((a) => setTimeout(a, 600))
      const chatsystem = document.createElement("div")
      const containersystem = document.createElement("div")
      const nicknamesystem = document.createElement("p")
      const messagesystem = document.createElement("div")
      // Styles
      chatsystem.className = "message-system"
      containersystem.className = "message-container"
      messagesystem.className = "message-text"
      // Info
      nicknamesystem.innerText = "system"
      messagesystem.innerText = ".."
      // Applying
      containersystem.appendChild(nicknamesystem)
      containersystem.appendChild(messagesystem)
      chatsystem.appendChild(containersystem)
      appedChannel.appendChild(chatsystem)
      const timeComparation = new Date().getTime()
      // Generate AI
      if(!sessionInit) {
        sessionInit = await window.ai.createTextSession()
      }
      if(!sessionInit.prompt) {
        sessionInit = await window.ai.createTextSession()
      }
      const result = await sessionInit.prompt(valuePrompt.trim())
      const timeFinisResult = `${(new Date().getTime() - timeComparation)/1000}s`
      nicknamesystem.innerText = `system - ${timeFinisResult}`
      for(let i in result.split("")) {
        await new Promise(a => setTimeout(a, 10))
        const textView = result.slice(0, Number(i))
        messagesystem.innerText = textView
        window.scrollTo(0, document.body.scrollHeight)
        if(Number(i) > result.length - 2) {
          setTimeout(() => {
            getInput.value = ""
            getInput.disabled = false
          }, 1000)
        }
      }
      return;
    } catch(err) {
      ApplyAlert(err.message, "error")
    }
    getInput.disabled = false
  }
  return <div className="chatrespon">
    <header>
      <md-text-button click-url="home" style={{display:"flex",alignItems: "center"}}>
        <span style={{marginTop: 4}} className="material-symbols-outlined">arrow_back</span>
      </md-text-button>
      <div className="text">
        <h3>Chat - Local Browser API</h3>
      </div>
    </header>
    <main className="chatlist"></main>
    <div className="inputtext">
      <div className="responses-text">
        <md-outlined-text-field label="Prompt AI" id="promptinput" maxlength="8200" type="textarea"></md-outlined-text-field>
        <md-text-button onClick={ApplyingPrompt}>
          <span style={{marginTop: 4}} className="material-symbols-outlined">send</span>
        </md-text-button>
      </div>
    </div>
  </div>
}