<script lang="ts">
    import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputBlock from "../../../lib/components/InputBlock.svelte";
    import Input from "../../../lib/components/Input.svelte";
    import flash from "../../../lib/utils/flash";

    const day: number = 2;

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


    async function main(){
        part1 = 0;
        part2 = 0;

        const plays = {
            'A X': [ 4, 3 ],
            'A Y': [ 8, 4 ],
            'A Z': [ 3, 8 ],
            'B X': [ 1, 1 ],
            'B Y': [ 5, 5 ],
            'B Z': [ 9, 9 ],
            'C X': [ 7, 2 ],
            'C Y': [ 2, 6 ],
            'C Z': [ 6, 7 ],
        };

        input.split(/\r?\n/).forEach(line=> {
            const [p1, p2] = plays[line];
            part1 += p1;
            part2 += p2;
        })
    }    

</script>


<section>
    <a href="https://adventofcode.com/2022/day/2">
        <h3>--- Day 2: Rock Paper Scissors ---</h3>
    </a>
 
    <div class="example">
<InputBlock code={`A&nbsp;Y
B&nbsp;X
C&nbsp;Z`} />
    
        <div>
            <p>In this game of rock paper scissors, we are awarded points a bit strangely,  we are given points based on what we pick (1 for rock, 2 for paper, 3 for scissors) and for the game outcome (0 for loss, 3 for draw, 6 if win)</p>
            <p>We are given a strategy guide for our upcoming games and are asked to work out our final score if we follow the guide </p>
            <p>for part 1, we assume the first character is our opponents choice and the second character is our choice</p>
            <p>for part 2, we assume the second character is if we lose, win or draw</p>


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

<p>While this can be done with a bunch of if/switch statements to play the game, an easier way is to just define the throw scores, that way we only need to match the lines rather than play the game</p>


<CodeBlock language="javascript"  code={`
const plays = {
    'A X': [ 4, 3 ],
    'A Y': [ 8, 4 ],
    'A Z': [ 3, 8 ],
    'B X': [ 1, 1 ],
    'B Y': [ 5, 5 ],
    'B Z': [ 9, 9 ],
    'C X': [ 7, 2 ],
    'C Y': [ 2, 6 ],
    'C Z': [ 6, 7 ],
};
`} />

<p>Simply loop through the input, accumulating the scores for each part</p>


<CodeBlock language="javascript"  code={`
input.split(/\\r?\\n/).forEach(line=> {
    const [p1, p2] = plays[line];
    part1 += p1;
    part2 += p2;
})
`} />



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