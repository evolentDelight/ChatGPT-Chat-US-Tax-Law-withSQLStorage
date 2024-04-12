//Store User Prompts and AI Responses using Transactional SQL Local Storage
let db; //Global variable to store the database

function openDB(){
  const db_request = window.indexedDB.open("PRDatabase")//Prompts Response Database
  db_request.onerror = () =>{
    console.error("indexedDB failed to initialize")
  }
  db_request.onsuccess = (event) =>{
    db = event.target.result;
    console.log("Database successfully connected")
  }
}

openDB();//Open Database

//When ChatGPT AI's response is received, load message onto front-end
function AI_Response(response) {
  const response_element = document.getElementById("response");

  response_element.textContent = response;
}

//Extract Prompt from front-end
function extractPrompt() {
  const prompt = document.getElementById("prompt").value;

  if (prompt) {
    return prompt;
  }

  alert("Please Enter Prompt");
  return null;
}

//AJAX to ChatGPT
//Call webserver to process Prompt
async function inquirePrompt() {
  const prompt = extractPrompt();

  if (prompt) {
    //REST call
    await fetch("https://chatgpt-chat-us-tax-law.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        AI_Response(json.data.response);
      });
  }
}

//Cancel Prompt by erasing prompt
function cancelPrompt() {
  document.getElementById("prompt").value = "";
}

//Event Listeners
//Cancel - Remove prompt
document.getElementById("cancelButton").addEventListener("click", cancelPrompt);

//Inquire/Submit button
document
  .getElementById("submitButton")
  .addEventListener("click", inquirePrompt);
document.getElementById("prompt").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); //Disables newline entered once "Enter" key is keyed
    inquirePrompt();
  }
});
