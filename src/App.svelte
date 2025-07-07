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
            <div class="homepage__container__zonedesaisie__inputcontainer">
                <input type="text" class="homepage__container__zonedesaisie__inputcontainer--input">
                <button type="submit" aria-labelledby="send" class="homepage__container__zonedesaisie__inputcontainer__icone--button"> 
                    <img src="/elements/icons8-search-50.png" alt="icone recherche"  class="homepage__container__zonedesaisie__inputcontainer__icone">
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
    flex-direction: row;
    margin: auto;
    border: 1px solid grey;
    border-radius: 25px;
    width: 90%;
    height: 55vh;
    background-color: whitesmoke;
    justify-content: flex-end;
    position: relative;
}

.homepage__container__zonedesaisie__inputcontainer--input {
    height: 2rem;
    display: flex;
    border: 1px solid black;
    border-radius: 35px;
    width: 90%;
    align-items: center;
    position: absolute;
    bottom: 10px;
    left: 5%;
    right: 5%;
    box-shadow: 4px 5px rgba(0, 0, 0, 0.35);
}

.homepage__container__zonedesaisie__inputcontainer__icone--button {
    width: 1rem; 
    height: 1rem;
    margin-left: 10px;
    size: 1rem;
    background-color: #ffcccc; 

}

.homepage__container__header--questions {
    text-align: end;
    margin: 20px 10px;
}

</style>
