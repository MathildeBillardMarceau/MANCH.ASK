<script>
// import {onMount} from 'svelte';

let chat = $state ([]);
let currentChats = $state ("");
let chatServers = $state ("");

async function handleSubmit (event) {
    event.preventDefault();
    const response = await fetch ("https://api.mistral.ai/v1/chat/completions",  {
        method: "POST",
        headers: {
        "Authorization": "Bearer BraU6oMJjYOwhzFPu6elA0YdC1qQ78Z8",
        "content-type" : "application/json"
                },
        body: JSON.stringify(
            {
                model: "mistral-small-latest",
                messages: [
                    {
                        role: "user",
                        content: currentChats,
                    }
                ]
            }
        )
        }
    )
chatServers = await response.json();
console.log(chatServers);
chat = chatServers.choices[0].message.content;
console.log(chat);
document.querySelector('.messages').textContent = chat;
}



// onMount(handleSubmit)
</script>

<div class="homepage__container" >
    
    <header class="homepage__container__header">
        <div class="homepage__container_header--logo">
            <img src="/elements/logo.png" alt="inscription MANCHASK suivi du chat Manchas" class="logo">
        </div>
        <p class="homepage__container__header--questions">Tu te poses des questions ? <br> Manchas te réponds.</p>
    </header> 
    
    <main class="zonedesaisie">
        
        <div class="homepage__container__zonedesaisie__inputcontainer" >
            <div class="messages">

        </div>
            <form onsubmit={handleSubmit} class="homepage__container__zonedesaisie__inputcontainer__form"> 
                
                <input bind:value={currentChats} type="text" class="homepage__container__zonedesaisie__inputcontainer__form--input" placeholder=" Pose ta question à Manchas...">
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
    </div>
    


<style>


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
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
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

</style>
