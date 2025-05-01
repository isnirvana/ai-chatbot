import OpenAI from "openai"
import logo from "../assets/icons/logo.png"

const input = document.getElementById("input")
const main = document.querySelector("main")

const apiKey = process.env.API_KEY
const baseURL = process.env.BASE_URL
const model = process.env.MODEL

const messages = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
]

const openai = new OpenAI({
  baseURL: baseURL,
  apiKey: apiKey,
  dangerouslyAllowBrowser: "true",
})

async function fetchData() {
  const userInput = getInputValue()

  const role = {
    role: "user",
    content: userInput,
  }
  messages.push(role)

  const completion = await openai.chat.completions.create({
    model: model,
    messages: messages,
  })

  const result = completion.choices[0].message

  const assistant = {
    role: "assistant",
    content: result.content,
  }
  messages.push(assistant)

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

    const html = marked.parse(message)
    console.log(results)
    createAssistantHTML(html)
  } catch (error) {
    console.error(error)
  }
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

main.addEventListener("click", async (e) => {
  const target = e.target

  if (!target.classList.contains("fa-arrow-up")) return
  createUserHTML()
  renderOnPage()
})

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return
  console.log(e.key)
  createUserHTML()
  renderOnPage()
  input.value = ""
})
