import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form=document.querySelector('form');
const chatContainer=document.querySelector('#chat_container')

let loadInterval;

function loader(element){
  element.textContent='';

  loadInterval=setInterval(()=>{
    element.textContent+='.';
    
    if (element.textContent==='....'){
      element.textContent='';
    }
  },300)
}


function typeText(element,text){
  let index=0;

  let interval=setInterval(() => {
    
    if (index <text.length){
      element.innerHTML +=text.charAt(index);
      index++;
    }

    else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId(){
  const timestamp=Date.now();
  const randomNumber= Math.random();
  const hexadecimalString=randomNumber.toLocaleString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi,value,uniqueId){
  return(
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot :user}"
              alt="${isAi ? 'bot' :'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit=async(e)=>{
  e.preventDefault(); //prevents the reload after submitting the button 
  const data=new FormData(form);

  //user chat stripes

/*looks for the 'prompt' name in the textarea of the html
and loads the prompt in the chatStripe
*/
  chatContainer.innerHTML+=chatStripe(false,data.get('prompt')); 

  form.reset();

  //bot chatStripes
  const uniqueId=generateUniqueId();
  chatContainer.innerHTML+=chatStripe(true," ",uniqueId);

  chatContainer.scrollTop=chatContainer.scrollHeight;

  const messageDiv=document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from the server
//before deploying the server we use localhost:5000
  const response =await fetch('https://codex-chatbot-dq1m.onrender.com',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      prompt:data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML='';

  if(response.ok){
    const data=await response.json();
    const parsedData= data.bot.trim();
    typeText(messageDiv,parsedData);
  }

  else {
    const err= await response.text();
    messageDiv.innerHTML="Something went wrong";
    alert(err);
  }
}

// to submit the form with submit button in the text area
form.addEventListener('submit',handleSubmit); 

//submit the button with the enter button
form.addEventListener('keyup',(e)=>{
  if(e.keyCode===13){
    handleSubmit(e)
  }
})