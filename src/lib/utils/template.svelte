<script lang="ts">
    import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputBlock from "../../../lib/components/InputBlock.svelte";
    import Input from "../../../lib/components/Input.svelte";
    import flash from "../../../lib/utils/flash";

    let day: number;

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

    // animation options

    onMount( async() => {
        input = await fetch(`/inputs/day${day}.txt`).then(r => r.text())
        loaded = true;
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

    function animate(){}

    async function main(){
        part1 = 0;
        part2 = 0;

        input.split(/\r?\n/).forEach(line => {

        })

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

        `} />
        <div>
        
        <p></p>

        {#if loaded}
            <div class="interactions"> 
                <button on:click={solve} on:keypress>
                    Solve
                </button>
                <!-- <button>
                    Animate
                </button> -->
                <Input day={1} inputData={input} on:resetInputData={resetInputData} on:saveInputData={saveInputData}/>
            </div>
        {/if}


    </div>
</div>

<p></p>

<CodeBlock language="javascript"  code={`

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
    <canvas bind:this={canvasEl}></canvas>
    <div class="inputs">
        <button on:click={()=>{modalEl.classList.add('hidden'); overlayEl.classList.add('hidden'); stop=true;}} on:keypress>X</button>
        
        <p></p>

        <label></label>
        <input>
    </div>
</div>

</section>


<style lang="scss">
    overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        z-index: 99;
        backdrop-filter: blur(5px);
        
        &.hidden {
            display: none;
        }
    }
    .animation-modal{
        width: 500px;
        height: 700px;
        position: fixed;
        background: black;
        
        top: 50vh;
        left: 50vw;
        -webkit-transform: translateY(-50%) translateX(-50%); 
        transform: translateY(-50%) translateX(-50%);

        display: flex;
        flex-direction: row;
        padding: 1rem;
        
        z-index: 100;

        &.hidden {
            display: none;
        }
    }
</style>