<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputBlock from "../../../lib/components/InputBlock.svelte";
    import Input from "../../../lib/components/Input.svelte";
    import flash from "../../../lib/utils/flash";

    let day: number = 6;

    // html elements
    let answersEl: HTMLElement;
    let overlayEl: HTMLElement;
    let modalEl: HTMLElement;
    let canvasEl: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    // default
    let part1: number = 0;
    let part2: number = 0;
    let solving: boolean = false;
    let input: string;
    let loaded: boolean = false;

    // animation variables
    let stop: boolean = true;
    let markerL: string = '';
    let markerM: string = '';
    let markerR: string = '';
    let count: number = 0;
    const letterColors = {
        a: "#FF5733",
        b: "#C70039",
        c: "#900C3F",
        d: "#581845",
        e: "#2ECC71",
        f: "#27AE60",
        g: "#1ABC9C",
        h: "#16A085",
        i: "#3498DB",
        j: "#2980B9",
        k: "#8E44AD",
        l: "#9B59B6",
        m: "#D35400",
        n: "#F39C12",
        o: "#FFC300",
        p: "#FF5733",
        q: "#C70039",
        r: "#900C3F",
        s: "#581845",
        t: "#2ECC71",
        u: "#27AE60",
        v: "#1ABC9C",
        w: "#16A085",
        x: "#3498DB",
        y: "#2980B9",
        z: "#8E44AD",
    }


    // animation options
    let markerLen: number = 14;
    let speed: number = 5;
    let autoplay: boolean = true;


    onMount( async() => {
        input = await fetch(`/inputs/day${day}.txt`).then(r => r.text())
        loaded = true;
        stop = true;
    })

    onDestroy(() => {
        stop = true;
    })

    async function resetInputData(e: CustomEvent<string>){
        input = await fetch(`/inputs/day${day}.txt`).then(r => r.text())
    }

    function saveInputData(e: CustomEvent<string>){
        input = e.detail
    }

    function solve(){
        answersEl.scrollIntoView({behavior: 'smooth'})
        flash(answersEl)
        solving = true;
        main()
        solving = false;
    }

    function animation(){
        modalEl.classList.remove('hidden')
        overlayEl.classList.remove('hidden')
        count = 0;
        stop = false;
        animate();
    }

    function animate(){
        
        if (stop || count >= input.length) {
            stop = true;
            return;
        }

        if (count < markerLen){
            markerL = ''
        } else {
            const previous = input.slice(0, count - markerLen)
            markerL = previous.slice(-5)
        }
       

        markerR = input.slice(count, count + 5);
        
        const marker: string = input.substring(count - markerLen, count);
        const duplicates = new Set(marker.split('').filter(char => marker.split(char).length > 2))
        
        let markerChars = marker.split('')
        
        markerChars.map(char => {
            if (duplicates.has(char)){
                markerChars[markerChars.indexOf(char)] = `<span style="color: ${letterColors[char]}">${char}</span>`
                }
            })
                
        markerM = markerChars.join('')

        if ((count>markerLen && duplicates.size === 0)){
            return
        }
        
        count++;
        if (autoplay){
            setTimeout(() => {
                animate();
            }, 1000 / speed);
        }
    }

    async function main(){
        part1 = 0;
        part2 = 0;

        markerLen = 4;
        for(let i = markerLen; i < input.length; i++){
            const marker = input.substring(i-markerLen, i);
            if ( new Set(marker).size === markerLen){
                part1 = i;
                break;
            }
        }
        markerLen = 14;
        for(let i = markerLen; i < input.length; i++){
            const marker = input.substring(i-markerLen, i);
            if ( new Set(marker).size === markerLen){
                part2 = i;
                break;
            }
        }
    }
    

</script>


<section>
    <div class="title">
        <a href="https://adventofcode.com/2022/day/{day}">
            <h3>--- Day {day}: Rock Paper Scissors ---</h3>
        </a>

        <a href="https://github.com/sbb12/aoc2022/blob/master/src/routes/day/{day}/%2Bpage.svelte" target="_blank" rel="noreferrer" title="open this page source on github">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
        </a>
    </div>
 
    <div class="example">
        
        <InputBlock code={`
mjqjpqmgbljsphdztnvjfqwrcgsmlb
        `} />
        <div>
        
        <p>The elves are now receiving messages on a communication device but it seems to be gibberish, we need to decipher it to locate the 'start-of-packet marker' in the message which is indicated by a sequence of 4 unique characters.
We will also need to locate the 'start-of-message marker' which is indicated by a sequence of 14 unique characters.
        </p>
        <p>In this example, the first marker appears at position 7 where the 4 previous characters are all unique 'jpqm', and second marker appears at position 19 where the 14 previous characters are all unique 'qmgbljsphdztnv'.
        </p>

        {#if loaded}
            <div class="interactions"> 
                <button on:click={solve} on:keypress>
                    Solve
                </button>
                <button on:click={animation}>
                    Animate
                </button>
                <Input day={1} inputData={input} on:resetInputData={resetInputData} on:saveInputData={saveInputData}/>
            </div>
        {/if}


    </div>
</div>

<p>Both parts of this puzzle can be reached with the same code by just changing the value of the length, this means we can also do it for any marker length. 
To compare the marker positions, we just need to loop through the input string and check the substring of the marker length.
The easiest way to check if a string contains only unique characters is to convert it to a set, which will remove any duplicates.
By checking the size of the set against the length of the marker, we can determine if it contains only unique characters.
</p>


<CodeBlock language="javascript"  code={`
let markerLen = 4;

for (let i = markerLen; i < input.length; i++){
    const marker = input.substring(i - markerLen, i);
    if ( new Set(marker).size === markerLen){
        const answer = i;
        break;
    }
}
`}/>


<p bind:this={answersEl}>
    This gives us the following answers:
    
    part1: {solving? '..solving..' : part1}
    part2: {solving? '..solving..' : part2}

    {#if (!part1 || !part2)}
    <br><br>
    <button on:click={solve} on:keypress>
        Solve
    </button>
    {/if}
</p>

<div class="next-day">
    <a href="/day/{day+1}">
        Day {day+1} 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
        </svg>
    </a>
</div>

<overlay bind:this={overlayEl} class="hidden" on:click={()=>{modalEl.classList.add('hidden'); overlayEl.classList.add('hidden'); stop=true;}} on:keypress></overlay>
<div class="animation-modal hidden" bind:this={modalEl}>
    <button class="close-button" on:click={()=>{modalEl.classList.add('hidden'); overlayEl.classList.add('hidden'); stop=true;}} on:keypress>X</button>

    <div class="display">
        <div class="count">
            position: {count}
        </div>
        <div class="marker-section">
            <span class="prev">{markerL}</span> <span class="marker">{@html markerM}</span> <span class="upcoming">{markerR}...</span>
        </div>
    </div>

    <div class="inputs">
        
        <p>This is a visualisation of the input being processed. The middle group of letters is the current marker being analyzed and any duplicate characters will be highlighted.</p>

        <label>Length of marker for unique characters: {markerLen}</label>
        <input type="range" min="3" max="15" step="1" bind:value={markerLen}>

        <label>Speed: {speed}</label>
        <input type="range" min="1" max="100" step="1" bind:value={speed}>

        <label for="">Autoplay</label>
        <input type="checkbox" bind:checked={autoplay} on:change={() => {if (autoplay) {animate()}}}>
        {#if !autoplay}
            <button on:click={animate} on:keypress>Next</button>
        {/if}

    </div>
</div>

</section>


<style lang="scss">

    overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 99;
        backdrop-filter: blur(5px);
        
        &.hidden {
            display: none;
        }
    }
    .animation-modal{
        width: 500px;
        max-width: 100vw;
        height: fit-content;
        position: fixed;
        background: black;

        top: 50vh;
        left: 50vw;
        -webkit-transform: translateY(-50%) translateX(-50%); 
        transform: translateY(-50%) translateX(-50%);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        
        z-index: 100;

        &.hidden {
            display: none;
        }
    }

    .close-button{
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
    }

    
    .display{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .marker-section{
        padding: 0.5rem;
        width: fit-content;
        border: solid 1px white;
        border-radius: 0.2rem;
    }

    .prev, .upcoming{
        color: #888;
    }

    .inputs{
        display: flex;
        flex-direction: column;
        align-items: center;

        text-align: center;

        input{
            margin-bottom: 1rem;
        }
    }
</style>