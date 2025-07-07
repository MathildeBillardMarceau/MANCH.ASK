<script>

</script>


<body class="homepage">
    
    <div class="homepage__container" >
        
        <header class="homepage__container__header">
            <div class="homepage__container_header--logo">
                <img src="/elements/logo.png" alt="inscription MANCHASK suivi du chat Manchas" class="logo">
            </div>
            <p class="homepage__container__header--questions">Tu te poses des questions ? <br> Manchas te réponds.</p>
        </header> 
        
        <main class="zonedesaisie">

            <div class="homepage__container__zonedesaisie__inputcontainer" >
                <!-- <div class="onlyContainer"> -->

                    <input type="text" class="homepage__container__zonedesaisie__inputcontainer--input" placeholder=" Pose ta question à Manchas...">
                    <button type="submit" aria-label="Envoyer" class="homepage__container__zonedesaisie__inputcontainer__icone--button">  
                        <img src="/elements/icons8-search-50.png" alt="Envoyer" style="width: 42px; height: 42px;">
                    </button>

                <!-- </div> -->
            </div>
        
        </main>
        
        <footer class="historique">
            <img src="/elements/historique.png" alt="" class="homepage__container__footer">
        </footer>
    </div>
    
</body>

<style>

/* .onlyContainer {
    display:inline;
} */

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

.homepage__container__zonedesaisie__inputcontainer--input {
    height: 2.5rem;
    border: 1px solid black;
    border-radius: 35px;
    width:initial;
    /* display: grid; */
    box-shadow: 4px 5px rgba(0, 0, 0, 0.25);
    margin: 15px;
    /* position: absolute; */
}

.homepage__container__zonedesaisie__inputcontainer__icone--button {
    /* position:sticky; */
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

</style>
