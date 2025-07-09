<script>
// @ts-nocheck

// import {onMount} from 'svelte';
import Markdown from 'svelte-exmarkdown';
// import "./md.css";

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
let chatsUser = $state ("");
let chatsIA = $state ("");
let chatServers = $state ([]);

async function handleSubmit (event) {
    event.preventDefault();
    const response = await fetch ("https://api.mistral.ai/v1/chat/completions",  {
        method: "POST",
        headers: {
            "content-type" : "application/json",
            Accept : "appliction/json",
            Authorization: `Bearer ${mistralToken}`,
                },
        body: JSON.stringify(
            {
                model: "mistral-small-latest",
                messages: [
                    {
                        role: "user",
                        content: chatsUser,
                    }
                ]
            }
        )
        }
    )
chatServers = await response.json();
console.log(chatServers);
chatsIA = chatServers.choices[0].message.content;

document.querySelector('.messagesUser').textContent = chatsUser;
document.querySelector('.messagesIa').textContent = chatsIA;
}

// onMount(handleSubmit)

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
            
            {#if chatsIA && chatsUser !== "" }
                <p class="messagesUser">{chatsUser}</p>
                <p class="messagesIa"><Markdown md={chatsIA}/></p>
            {/if}
            
            <form onsubmit={handleSubmit} class="homepage__container__zonedesaisie__inputcontainer__form"> 
                
                <input bind:value={chatsUser} type="text" class="homepage__container__zonedesaisie__inputcontainer__form--input" placeholder=" Pose ta question à Manchas...">
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
                    <a href="http://localhost:5173/" target="_blank"> Pourquoi le ciel est bleu ?</a>
                    <a href="http://localhost:5173/" target="_blank"> Combien de croquettes ?</a>
                </div>
            </div>
        </footer>
        {/if}
</div>

<style>
.form__token {
    display: flex;
    justify-content: center;
    height: 5rem;
    margin: 45%;
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


.homepage__container__zonedesaisie__inputcontainer__icone--button {
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

.homepage__historique__dropdown--button {
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

.messagesUser {
    border: 1px solid #E3E0DE;
    border-radius: 20px;
    margin: 5px 10px;
    padding: 5px 10px;
    background-color: #CEC2B2;
    text-align: end;
}

.messagesIa {
    border: 1px solid #CEC2B2;
    border-radius: 20px;
    margin: 5px 10px;
    padding: 5px 10px;
    background-color: #E3E0DE;
    text-align: start;
}
</style>
