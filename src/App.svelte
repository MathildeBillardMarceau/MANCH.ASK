<script>
// @ts-nocheck

import {onMount} from 'svelte';
import Markdown from 'svelte-exmarkdown';
import PocketBase from 'pocketbase';
// import "./md.css";
const pb = new PocketBase('http://127.0.0.1:8090');
let token = $state ("");
let mistralToken = $state(localStorage.getItem("mistraltoken"))

function saveToken(event) {
    event.preventDefault();
    
    token = token.trim();
    
    if (token) {
    localStorage.setItem('mistralToken', token);
    mistralToken = token;
    } 
    else {
      alert('Veuillez entrer une clé Mistral valide.');
    }
}

let error = $state(null);
let messageContent = $state ("");

let messages = $state ([]);

async function handleMessageSubmit (event) {
    event.preventDefault();
    console.log(messageContent);

    messageContent = messageContent.trim();

    if(messageContent) {
        try {
            const newMessage = {
                role: "user",
                content: messageContent,
          
                created: new Date(), 
            };

        messages.push(newMessage);
        
        await pb.collection('messages').create(newMessage);
        messageContent = "";

        const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

        // const formattedMessages = [];
        //     for (const message of messages) {
        //     formattedMessages.push({
        //     role: "assistant",
        //     content: data.content,

        //     created: new Date(), 
        //   });
        // }

        const response = await fetch ("https://api.mistral.ai/v1/chat/completions",  {
            method: "POST",
            headers: {
                "content-type" : "application/json",
                Accept : "application/json",
                Authorization: `Bearer ${mistralToken}`,
                    },
            body: JSON.stringify(
                {
                    model: "mistral-small-latest",
                    messages: formattedMessages,
                }
            ),
            }
        );

        const result = await response.json();
        console.log(result);

        // const data = result.choices[0]
        // console.log("Premier choix retourné :", data);

        const assistantMessage = {
        role: "assistant",
        content: result.choices[0].message.content,
        created: new Date(),
        }
        
        messages.push(assistantMessage);
        await pb.collection('messages').create(assistantMessage);
        console.log("Messages après ajout :", messages);
       
        
        } catch (error) {
            console.error('send message error:', error);
        }
    }


    else {
      alert('Veuillez entrer un message valide.');
    }    
}

onMount(async () => {
  try {
    const result = await pb.collection('messages').getFullList({
      sort: 'created', 
    });

    messages = result.map(record => ({
      role: record.role,
      content: record.content,
      created: new Date(record.created)
    }));

    console.log('Messages chargés depuis PocketBase :', messages);
  } catch (err) {
    console.error('Erreur lors du chargement des messages :', err);
  }
});

</script>

<div class="homepage__container" >

    {#if !mistralToken}
    <form class="form__token" onsubmit={saveToken}>
      <input class="form__token--input" type="text" name="token" placeholder="  Entrez votre clé Mistral" bind:value={token} />
      <button class="form__token--button" type="submit">Enregistrer</button>
    </form>

    {:else}
    
    <header class="homepage__container__header">
        <div class="homepage__container_header--logo">
            <img src="/elements/logo.png" alt="inscription MANCHASK suivi du chat Manchas" class="logo">
        </div>
        <p class="homepage__container__header--questions">Tu te poses des questions ? <br> Manchas te réponds.</p>
    </header> 
    
    <main class="zonedesaisie">
        
        <div class="homepage__container__zonedesaisie__inputcontainer" >
            
            <!-- {#if messageContent !== "" }
                <p class="messagesUser">{messageContent}</p>
                <p class="messagesIa"><Markdown md={formattedMessages}/></p>
            {/if} -->
            
                  <section class="messages">
        {#each messages as message}
          <div class={`message message--${message.role}`}>
            <div class="markdown-body">
              <Markdown md={message.content} />
            </div>
            <!-- 
              on met en forme l'heure comme l'affichage le prévoir 
              on récupère la date du message et on la transforme en ne conservant que l'heure au format français (ex : 18:30) 
            -->
            <time datetime={message.created}
              >{new Date(message.created).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
        </div>
        {/each}
      </section>

            <form onsubmit={handleMessageSubmit} class="homepage__container__zonedesaisie__inputcontainer__form"> 
                
                <input bind:value={messageContent} type="text" class="homepage__container__zonedesaisie__inputcontainer__form--input" placeholder=" Pose ta question à Manchas..." id="submit">
                <button type="submit" aria-label="Envoyer" class="homepage__container__zonedesaisie__inputcontainer__icone--button">  
                    <img src="/elements/icons8-search-50.png" alt="Envoyer" style="width: 42px; height: 42px;">
                </button>
                
            </form>
                        
        </div>
        </main>
        
        <footer class="historique">
            <div class="homepage__historique__dropdown">
                <button class="homepage__historique__dropdown--button">
                    <img src="/elements/historique.png" alt="" class="homepage__container__footer">
                </button>
                <div class="homepage__historique__dropdown--child">
                    <a href="http://localhost:5173/" target="_blank"> Pourquoi le ciel est bleu ?
                    <button type="button" class="buttonSup"> X </button>
                    </a>
                    <a href="http://localhost:5173/" target="_blank"> Combien de croquettes ?
                    <button type="button" class="buttonSup"> X </button>
                    </a>
                </div>
            </div>
        </footer>
        {/if}
</div>

<style>


.form__token {
    justify-content: center;
    display: flex;
    align-items: center;
    width: 25rem;
}

.form__token--button, .form__token--input{
    border: none;
    border-radius: 30px;
    margin: 0 5px;
}

.homepage__container__zonedesaisie__inputcontainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin: auto;
    border: 1px solid grey;
    border-radius: 25px;
    width: 90%;
    height: 55vh;
    background-color: whitesmoke;
    position: relative; 
    overflow-y: scroll;
}

.homepage__container__zonedesaisie__inputcontainer__form {
    height: 2.5rem;
    border: 1px solid black;
    
    border-radius: 35px;
    width:initial;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    margin: 15px;

}

.homepage__container__zonedesaisie__inputcontainer__form--input {
    height: 2.3rem;
    border-radius: 35px;
    border: none;
    justify-content: center;
}

#submit {
    outline: none;
}

.homepage__container__zonedesaisie__inputcontainer__icone--button{
    border: none;
    background: none;
    cursor: pointer;
    position: absolute;
    right: 5%;
    bottom: 3%;
}

.homepage__container__header--questions {
    text-align: end;
    margin: 3% 5%;
}

.historique {
    display: flex;
    justify-content: center;
    position: relative;

}

.buttonSup{
    background: none;
    border: 1px solid #CEC2B2;
    position: absolute;
    right: 25%;
}

.homepage__historique__dropdown--button{
    border: none;
    background: none;
    cursor: pointer;
} 


.homepage__historique__dropdown--child {
    display: none;
    justify-content: center;
    background: white;
    min-width: 200px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 8px;
    margin-top: 10px;
}


.homepage__historique__dropdown--child a {
    color: black;
    padding: 10px;
    text-decoration: none;
    display: block;
}

.homepage__historique__dropdown--child a:hover {
    background-color: #E3E0DE;
}

.historique:hover .homepage__historique__dropdown--child {
    display: block;
}

.message--user {
    border: 1px solid #E3E0DE;
    border-radius: 20px;
    margin: 5px 10px;
    padding: 5px 10px;
    background-color: #CEC2B2;
    text-align: end;
}

.message--assistant {
    border: 1px solid #CEC2B2;
    border-radius: 20px;
    margin: 5px 10px;
    padding: 5px 10px;
    background-color: #E3E0DE;
    text-align: start;
}
</style>
