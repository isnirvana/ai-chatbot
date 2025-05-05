import logo from "../assets/icons/logo.png"

const input = document.getElementById("input")
const main = document.querySelector("main")
const menu = document.querySelector(".menu")
const body = document.querySelector("body")
const overlay = document.querySelector(".overlay")
const introduction = document.querySelector(".introduction")

let hasStarted = false

const messages = [
  `role: "system",
  content: "You are a helpful assistant."`,
]

async function fetchData() {
  const userInput = getInputValue()

  messages.push(`"role": user, content: ${userInput}`)

  const completion = await puter.ai.chat(messages.join())

  const result = completion.message

  messages.push(`"role": assistant, content: ${result.content}`)
  return { message: result.content, userInput: userInput }
}

function getInputValue() {
  const inputValue = input.value

  return inputValue
}

async function renderOnPage() {
  const loader = document.querySelector(".loader-container")
  hasStarted = true

  if (hasStarted) {
    introduction.style.display = "none"
  }

  try {
    const results = await fetchData()
    const message = results.message

    marked.setOptions({
      highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext"
        return hljs.highlight(code, { language }).value
      },
    })

    loader.remove()

    const html = marked.parse(message)
    console.log(results)
    createAssistantHTML(html)
    scrollToBottom()
  } catch (error) {
    console.error(`The render error${error}`)
    loader.remove()
    createAssistantHTML(`Please sign in first`)
  }
}

function createLoaderHtml() {
  const loader = createElement("div", "loader-container")

  loader.innerHTML = `
    <span class="loader"></span>
        <img src="${logo}" alt="logo" />
  `

  main.appendChild(loader)
}

function createUserHTML() {
  const user = createElement("div", "user")

  user.innerHTML = `
      <div class="user__massage">
          <div class="message-text">
            ${input.value}
          </div>
          <div class="user__profile"></div>
        </div>
    `

  main.appendChild(user)
}

function createAssistantHTML(html) {
  const assistant = createElement("div", "assistant")

  assistant.innerHTML = `
    <div class="assistant__massage">
          <div class="message-text">
            ${html}
          </div>
          <hr />
          <div class="assistant__massage--icons">
            <i class="fa-regular fa-copy"></i>
            <i class="fa-solid fa-arrows-rotate"></i>
          </div>
        </div>
        <div class="assistant__profile">
          <img src="${logo}" alt="t" />
        </div>
  `

  main.appendChild(assistant)
}

function createElement(tag, className) {
  const element = document.createElement(tag)
  element.classList = className

  return element
}

function hideMenu() {
  menu.style.display = "none"
  overlay.style.display = "none"
  body.style.overflow = "auto"
}

function getAuthorized() {
  const getStarted = document.querySelector(".get-started")

  getStarted.innerHTML = `
        <span class="intro-loader"></span>
      `
  puter.ai
    .chat("hello")
    .then((response) => {
      const messageInput = document.querySelector(".message-input")
      introduction.innerHTML = `
        <h2>What can I help with?</h2>
      `
      messageInput.style.display = "flex"
      body.style.overflow = "auto"
    })
    .catch((error) => {
      alert(`Authentication canceled click on get started again`)
      getStarted.innerHTML = "GET STARTED"
      console.log(error.error.message)
    })
}

body.addEventListener("click", async (e) => {
  const target = e.target

  if (target.classList.contains("get-started")) {
    getAuthorized()
  }

  if (target.classList.contains("fa-bars")) {
    menu.style.display = "flex"
    overlay.style.display = "block"
    body.style.overflow = "hidden"
  }

  if (target.classList.contains("fa-xmark")) {
    hideMenu()
  }

  if (!target.classList.contains("fa-arrow-up")) return
  createUserHTML()
  createLoaderHtml()
  renderOnPage()
  input.value = ""
})

menu.addEventListener("click", (e) => {
  const target = e.target
  if (!target.classList.contains("new-conversation")) return

  main.innerHTML = ``

  main.appendChild(introduction)
  introduction.innerHTML = `
    <h2>What can I help with?</h2>
  `
  introduction.style.display = "flex"
  scrollToTop()
  hasStarted = false
  messages.length = 0
  input.value = ""
  messages.push(`role: "system",
  content: "You are a helpful assistant."`)
  hideMenu()
})

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return
  createUserHTML()
  createLoaderHtml()
  renderOnPage()
  input.value = ""
  scrollToBottom()
})

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const screenSize = window.matchMedia("(min-width: 900px)")
function changeSate() {
  if (screenSize.matches) {
    overlay.style.display = "none"
    menu.style.display = "flex"
    body.style.overflow = "auto"
  }
}

changeSate()

screenSize.addEventListener("change", function () {
  changeSate()
})
