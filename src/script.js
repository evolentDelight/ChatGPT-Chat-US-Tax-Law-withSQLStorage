//Store User Prompts and AI Responses using Transactional SQL Local Storage
let db; //Global variable to store the database

function openDB(){
  const db_request = indexedDB.open("PRDatabase", 1)//Prompts Response Database
  db_request.onerror = () =>{
    console.error("indexedDB failed to initialize")
  }
  db_request.onupgradeneeded = (event) =>{
    db = event.target.result;
    db.createObjectStore('PRDatabaseStore', {keyPath: `prompt`})
    console.log("Database successfully connected[OUN]")
  }
  db_request.onsuccess = (event) =>{
    db = event.target.result;
    console.log("Database successfully connected[OS]")
  }
}

openDB();//Open Database

function savePR(){// PR as in Prompt and Response
  const prompt = document.getElementById("prompt").value;
  var response = document.getElementById("response").textContent;
  if(response === "Chatbot will respond here"){
    response = null;
  }

  if(!prompt || !response){
    alert("There must be an user Prompt and an AI response!");
    return;
  }

  const PR = {
    prompt: `${prompt}`,
    response : `${response}`,
    created: new Date().getTime()
  }

  const transaction = db.transaction("PRDatabaseStore", "readwrite");
  const store = transaction.objectStore("PRDatabaseStore")
  store.add(PR);
}

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
    await fetch("https://chatgpt-chat-us-tax-law-withsqlstorage.onrender.com/", {
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

//Save button: Saves Prompts and Responses
document.getElementById("saveButton").addEventListener("click", savePR);
