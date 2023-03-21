<script lang="ts">
    import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputData from "../../../lib/components/InputData.svelte";
    import flash from "../../../lib/utils/flash";

    let answersEl: HTMLElement;
    let part1: number = 0;
    let part2: number = 0;

    function scrollToAnswer(){
        answersEl.scrollIntoView({behavior: 'smooth'})
        flash(answersEl)
    }

    async function main(){
        const input = await fetch('/inputs/day2.txt').then(r => r.text());


        const throws = {
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
            const [p1, p2] = throws[line];
            part1 += p1;
            part2 += p2;
        })
    }

    onMount( async() => {
        main()
    })

</script>


<section>
    <a href="https://adventofcode.com/2022/day/2">
        <h3>--- Day 2: Rock Paper Scissors ---</h3>
    </a>
 
    <div class="example">
        <div class="input-data">
            <InputData code={`A Y
B X
C Z
`} /></div>
    
        <div>
            <p>In this game of rock paper scissors, we are awarded points a bit strangely,  we are given points based on what we pick (1 for rock, 2 for paper, 3 for scissors) and for the game outcome (0 for loss, 3 for draw, 6 if win)</p>
            <p>We are given a strategy guide for our upcoming games and are asked to work out our final score if we follow the guide </p>
            <p>for part 1, we assume the first character is our opponents choice and the second character is our choice</p>
            <p>for part 2, we assume the second character is if we lose, win or draw</p>


            <div>
                <p><a href="/inputs/day2.txt" target="_blank">Input data</a><p>
                <p on:click={scrollToAnswer} on:keypress>Scroll to answer</p>
            </div>
        </div>
    </div>

<p>While this can be done with a bunch of if/switch statements to play the game, an easier way is to just define the throw scores, that way we only need to match the lines rather than play the game</p>

<div class="code-block">
    <CodeBlock language="javascript"  code={`
const throws = {
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
`} /></div>

<p>Simply loop through the input, accumulating the scores for each part</p>

<div class="code-block">
    <CodeBlock language="javascript"  code={`
input.split(/\\r?\\n/).forEach(line=> {
    const [p1, p2] = throws[line];
    part1 += p1;
    part2 += p2;
})
`} /></div>



<p bind:this={answersEl}>
    This gives us the following answers:
    
    part1: {part1}
    part2: {part2}
</p>

</section>


<style lang="scss">
    .example {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;}

        p{
            padding: 0 1rem;
        }

    .input-data {
        height: 100%;
        background-color: #1e1e1e;
    }
    .code-block {
        // width: fit-content;
        max-width: 1000px;
        height: 100%;
        background-color: #1e1e1e;
    }
</style>