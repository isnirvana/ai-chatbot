import logo from "../assets/icons/logo.png"

const input = document.getElementById("input")
const main = document.querySelector("main")
const body = document.querySelector("body")

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
  try {
    const results = await fetchData()
    const message = results.message

    marked.setOptions({
      highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext"
        return hljs.highlight(code, { language }).value
      },
    })

    const loader = document.querySelector(".loader-container")
    loader.remove()

    const html = marked.parse(message)
    console.log(results)
    createAssistantHTML(html)
    scrollToBottom()
  } catch (error) {
    console.error(error)
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

body.addEventListener("click", async (e) => {
  const target = e.target
  const menu = document.querySelector(".menu")
  const overlay = document.querySelector(".overlay")

  if (target.classList.contains("fa-bars")) {
    menu.style.display = "flex"
    overlay.style.display = "block"
    body.style.overflow = "hidden"
  }

  if (target.classList.contains("fa-xmark")) {
    menu.style.display = "none"
    overlay.style.display = "none"
    body.style.overflow = "auto"
  }

  if (!target.classList.contains("fa-arrow-up")) return
  createUserHTML()
  createLoaderHtml()
  renderOnPage()
  input.value = ""
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

const screenSize = window.matchMedia("(min-width: 900px)")
function changeSate() {
  if (screenSize.matches) {
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "none"
  }
}

changeSate()

screenSize.addEventListener("change", function () {
  changeSate()
})
