

<script>
import {onMount} from 'svelte';
import Markdown from 'svelte-exmarkdown';

let token = $state ("");
//let mistralToken = $state(localStorage.getItem("mistraltoken"))
let title = $state("");
let conversations = $state([]);
let newConversations = $state ({
    title : "",
    id: ""
});
let currentConversationId = $state(null);

let messageContent = $state ("");

let messages = $state ([]);

async function addConversation (event) {
    event.preventDefault();

    if(conversations) {
    try {
        const newConversations = {
            title : title,
        };

        const created = await pb.collection('conversations').create(newConversations);
        conversations.push({
                id: created.id,
                title: created.title
            });
        
        currentConversationId = created.id;

        await loadMessagesForConversation(created.id);
        title = "";

        
        
    } catch (error) {
        console.error('send message error:', error);
    }
}


    else {
      alert('Veuillez entrer un titre valide.');
    }    
}

function selectConversation(conversation) {
  currentConversationId = conversation.id;
  loadMessagesForConversation(conversation.id);
}

async function removeConversation(id) {
  try {
    // Supprime d'abord les messages liés à cette conversation
    const relatedMessages = await pb.collection('messages').getFullList({
      filter: `conversations = "${id}"`
    });

    for (const msg of relatedMessages) {
      await pb.collection('messages').delete(msg.id);
    }

    // Ensuite supprime la conversation elle-même
    await pb.collection('conversations').delete(id);

    // Mets à jour localement les conversations
    conversations = conversations.filter(c => c.id !== id);

    // Si c'était la conversation active, on la désélectionne
    if (currentConversationId === id) {
      currentConversationId = null;
      messages = [];
    }

    console.log("Conversation supprimée :", id);
  } catch (error) {
    console.error("Erreur suppression conversation :", error);
  }
}

function handleConversationClick(event, conversationId) {
  event.preventDefault();
  selectConversation(conversationId);
}


async function loadMessagesForConversation(conversationId) {
    try {
        const result = await pb.collection('messages').getFullList({
            filter: `conversations = "${conversationId}"`,
            sort: 'created'
        });
        
        messages = result.map(record => ({
            role: record.role,
            content: record.content,
            created: new Date(record.created),
        }));

        
    console.log('Messages de la conversation :', messages);
  } catch (error) {
    console.error("Erreur chargement messages:", error);
  }
}

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
                conversations: currentConversationId
            };

        messages.push(newMessage);
        
        const createdMsg = await pb.collection('messages').create(newMessage);
        console.log("Message créé :", createdMsg);
        messageContent = "";

        const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

        const response = await fetch ("http://localhost:11434/api/chat",  {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",

                    },
            body: JSON.stringify(
                {
                    model: "Mistral:latest",
                    messages: formattedMessages,
                    stream: true,
                }
            ),
            }
        );

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim() !== "");
    for (const line of lines) {
        const data = JSON.parse(line);
        result += data.message.content; // Ajoute chaque morceau de réponse
        console.log(data.message.content); // Affiche en temps réel
    }
        }

        } catch (error) {
            console.error('send message error:', error);
        }
        } else {
            alert('Veuillez entrer un message valide.');
        }
    }

onMount(async () => {
  try {            
      const conversationsResult = await pb.collection('conversations').getFullList();
      conversations = conversationsResult;

        
        if (currentConversationId) {
            await loadMessagesForConversation(currentConversationId);
                }

        conversations = conversationsResult.map(record => ({
            id: record.id,
            title: record.title,
        }));
        
        console.log('Conversations chargées depuis PocketBase :', conversations);

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
// console.log("Conversations :", {conversations});

</script>

<div class="homepage__container">
    <header class="homepage__container__header">
        <div class="homepage__container_header--logo">
            <img
                src="/elements/logo.png"
                alt="inscription MANCHASK suivi du chat Manchas"
                class="logo"
            />
        </div>
        <p class="homepage__container__header--questions">
            Tu te poses des questions ? <br /> Manchas te réponds.
        </p>

        <form onsubmit={addConversation} class="add__conversation">
            <input
                bind:value={title}
                class="add__conversation--input"
                type="text"
                placeholder="ajoute une conversation"
            />
            <button type="submit" class="buttonAdd"> + </button>
        </form>
    </header>

    <main class="zonedesaisie">
        <div class="homepage__container__zonedesaisie__inputcontainer">
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
                            >{new Date(message.created).toLocaleTimeString(
                                "fr-FR",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                },
                            )}
                        </time>
                    </div>
                {/each}
            </section>

            <form
                onsubmit={handleMessageSubmit}
                class="homepage__container__zonedesaisie__inputcontainer__form"
            >
                <input
                    bind:value={messageContent}
                    type="text"
                    class="homepage__container__zonedesaisie__inputcontainer__form--input"
                    placeholder=" Pose ta question à Manchas..."
                    id="submit"
                />
                <button
                    type="submit"
                    aria-label="Envoyer"
                    class="homepage__container__zonedesaisie__inputcontainer__icone--button"
                >
                    <img
                        src="/elements/icons8-search-50.png"
                        alt="Envoyer"
                        style="width: 42px; height: 42px;"
                    />
                </button>
            </form>
        </div>
    </main>

    <footer class="historique">
        <button class="homepage__historique__dropdown--button">
            <img
                src="/elements/historique.png"
                alt=""
                class="homepage__container__footer"
            />
        </button>

        {#each conversations as conversation}
            <div class="homepage__historique__dropdown">
                <div class="homepage__historique__dropdown--child">
                    <a
                        href="#"
                        onclick={(e) =>
                            handleConversationClick(e, conversation)}
                        >{conversation.title}
                    </a>
                    <button
                        onclick={() => removeConversation(conversation.id)}
                        aria-label="supprimer"
                        type="button"
                        class="buttonSup"
                    >
                        X
                    </button>
                </div>
            </div>
        {/each}
    </footer>
</div>

<style>
    .add__conversation {
        display: flex;
        justify-content: center;
        margin: 10px 0;
        border-radius: 8px;
    }

    .add__conversation--input {
        height: 1.2rem;
        border-radius: 10px;
        border: 0.5px solid grey;
    }

    .form__token {
        justify-content: center;
        display: flex;
        margin: auto;
        padding-top: 20%;
        height: 2rem;
        width: 25rem;
    }

    .form__token--button,
    .form__token--input {
        border: none;
        border-radius: 30px;
        margin: 0 5px;
        outline-style: solid;
        outline-color: #cec2b2;
    }

    .form__token--input {
        display: inherit;
    }

    .homepage__container__zonedesaisie__inputcontainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        border: 1px solid grey;
        border-radius: 25px;
        height: 55vh;
        background-color: whitesmoke;
        overflow-y: scroll;
    }

    .homepage__container__zonedesaisie {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        border: 1px solid grey;
        border-radius: 25px;
        height: 55vh;
        background-color: whitesmoke;
        overflow-y: scroll;
    }

    .homepage__container__zonedesaisie__inputcontainer__form {
        height: 2.5rem;
        margin: 15px;
        display: flex;
    }

    .homepage__container__zonedesaisie__inputcontainer__form--input {
        width: 100%;
        height: 2.5rem;
        border: 1px solid black;
        /* background-color: aqua; */
        border-radius: 35px;
        box-sizing: border-box;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    #submit {
        outline: none;
        size: 10em;
    }

    .homepage__container__zonedesaisie__inputcontainer__icone--button {
        border: none;
        background: none;
        cursor: pointer;
    }

    .homepage__container__header--questions {
        text-align: end;
        margin: 3% 5%;
    }

    .historique {
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        outline: none;
    }

    .buttonAdd {
        background: none;
        border: 1px solid #cec2b2;
        outline: none;
        cursor: pointer;
        border-radius: 8px;
    }

    .buttonSup {
        background: none;
        border: 1px solid #cec2b2;
        justify-content: space-between;
        cursor: pointer;
        right: 25%;
        align-self: center;
    }

    .homepage__historique__dropdown {
        display: flex;
        justify-content: center;
    }

    .homepage__historique__dropdown--button {
        border: none;
        background: none;
        cursor: pointer;
    }

    .homepage__historique__dropdown--child {
        display: flex;
        background: white;
        width: 70%;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
        border-radius: 8px;
        margin-top: 10px;
        justify-content: space-between;
    }

    .homepage__historique__dropdown--child a {
        color: black;
        padding: 10px;
        text-decoration: none;
        display: inline-block;
    }

    .homepage__historique__dropdown--child a:hover {
        background-color: #e3e0de;
    }

    .historique:hover .homepage__historique__dropdown--child {
        display: flex;
    }

    .message--user {
        border: 1px solid #e3e0de;
        border-radius: 20px;
        margin: 5px 10px;
        padding: 5px 10px;
        background-color: #cec2b2;
        text-align: end;
    }

    .message--assistant {
        border: 1px solid #cec2b2;
        border-radius: 20px;
        margin: 5px 10px;
        padding: 5px 10px;
        background-color: #e3e0de;
        text-align: start;
    }
</style>
