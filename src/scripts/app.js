import OpenAI from "openai"

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

  return messages
}

function getInputValue() {
  const inputValue = input.value

  if (!inputValue) {
    alert("Please type something...")
  }
  return inputValue
}

main.addEventListener("click", async (e) => {
  const target = e.target

  if (!target.classList.contains("fa-arrow-up")) return
  fetchData()
})
