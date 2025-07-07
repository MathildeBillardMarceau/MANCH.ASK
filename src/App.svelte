<script>

</script>


<body class="homepage">
    
    <div class="homepage__container" >
        
        <header class="homepage__container__header">
            <div class="homepage__container_header--logo">
                <img src="/elements/logo.png" alt="inscription MANCHASK suivi du chat Manchas" class="logo">
            </div>
            <p class="homepage__container__header--questions">Tu te pose des questions ? <br> Manchas te réponds.</p>
        </header> 
        
        <main class="zonedesaisie">
            <div class="homepage__container__zonedesaisie__inputcontainer" >
                <input type="text" class="homepage__container__zonedesaisie__inputcontainer--input" placeholder=" Pose ta question à Manchas...">
                <button type="submit" aria-label="Envoyer" class="homepage__container__zonedesaisie__inputcontainer__icone--button">  
                    <img src="/elements/icons8-search-50.png" alt="Envoyer" style="width: 32px; height: 32px;">
                </button>
            </div>
        
        </main>
        
        <section class="historique">
            
        </section>
    </div>
    
</body>

<style>

.homepage__container {
    display: flex;
    flex-direction: column;

}

.homepage__container__zonedesaisie__inputcontainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin: auto;
    border: 1px solid grey;
    border-radius: 25px;
    width: 90%;
    height: 55vh;
    background-color: whitesmoke;
    position: relative; 

}

.homepage__container__zonedesaisie__inputcontainer--input {
    height: 2.5rem;
    border: 1px solid black;
    border-radius: 35px;
    width: 90%;
    display: grid;
    box-shadow: 4px 5px rgba(0, 0, 0, 0.25);
    margin-bottom: 10px;

}

.homepage__container__zonedesaisie__inputcontainer__icone--button {
    position:sticky;
    right: 10px;
    align-items: end;
    border: none;
    background: none;
    cursor: pointer;
    
}

.homepage__container__header--questions {
    text-align: end;
    margin: 20px 10px;
}

</style>
