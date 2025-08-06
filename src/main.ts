import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `


  <h1 id="top">SPOOFY</h1>
  <hr>


<body>
    <section class = "main">
    </section>
    
    <div id="currentlyPlaying"></div>

</body>

</html>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)


document.addEventListener("DOMContentLoaded",(event)=>{
    console.log("loaded");
});