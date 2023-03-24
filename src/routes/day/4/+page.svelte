<script lang="ts">
    import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputBlock from "../../../lib/components/InputBlock.svelte";
    import Input from "../../../lib/components/Input.svelte";
    import flash from "../../../lib/utils/flash";

    let day: number = 4;

    let answersEl: HTMLElement;
    let part1: number = 0;
    let part2: number = 0;
    let solving: boolean = false;
    let input: string;
    let loaded: boolean = false;

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

    function animate(){

    }

    async function main(){
        part1 = 0;
        part2 = 0;

    }
    

</script>


<section>
    <a href="https://adventofcode.com/2022/day/{day}">
        <h3>--- Day {day}: ##### ---</h3>
    </a>
 
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

</section>


<style lang="scss">
    
</style>