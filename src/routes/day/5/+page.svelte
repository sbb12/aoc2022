<script lang="ts">
    import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputBlock from "../../../lib/components/InputBlock.svelte";
    import Input from "../../../lib/components/Input.svelte";
    import flash from "../../../lib/utils/flash";

    let day: number = 5;

    let answersEl: HTMLElement;
    let canvasEl: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let part1: string = '';
    let part2: string = '';
    let solving: boolean = false;
    let input: string;
    let loaded: boolean = false;

    let stacks: any = [];

    onMount( async() => {
        input = await fetch(`/inputs/day${day}.txt`).then(r => r.text())
        ctx = canvasEl.getContext('2d');
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

    async function main(animate:boolean = false){
        console.clear()
        part1 = '';
        part2 = '';
        
        // split on empty line and initialise stacks
        const [blueprint, instructions] = input.split(/\r?\n\r?\n/)
        initialiseStacks(blueprint) 

        instructions.split(/\r?\n/).forEach(line => {
            const [quantity, moveFrom, moveTo ] = line.match(/[0-9]+/g).map(n => Number(n))
            console.log(line, quantity, moveFrom, moveTo)

            for (let i = 0; i < quantity; i++){
                stacks[moveTo - 1].push(stacks[moveFrom - 1].pop())
            }

        }) 
        
        let top = '';
        stacks.forEach(stack => {
            top += stack.pop()
        })
        console.log(top)
        console.log(stacks)
    
    }

    
    function initialiseStacks(blueprint: string){
        stacks = [];
        for (let i = 0; i < 9; i++){
            stacks.push([])
        }

        let lines = blueprint.split(/\r?\n/)
        lines.pop() // remove last line which doesn't contain stack info
        lines.reverse() // reverse order so we can build from the bottom up

        lines.forEach(line => {
            for (let i = 0; i < 9; i++){
                const char = line[i*4 + 1]
                char.match(/[A-Z]/) && stacks[i].push(char)
            }
        })
    }
    

</script>


<section>
    <div class="title">
        <a href="https://adventofcode.com/2022/day/{day}">
            <h3>--- Day {day}: Supply Stacks ---</h3>
        </a>

        <a href="https://github.com/sbb12/aoc2022/blob/master/src/routes/day/{day}/%2Bpage.svelte" target="_blank" rel="noreferrer" title="open this page source on github">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
        </a>
    </div>
 
    <div class="example">
        
        <InputBlock code={`
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
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


<canvas bind:this={canvasEl}>
</canvas>

</section>


<style lang="scss">
    
</style>