<script lang="ts">
	import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputData from "../../../lib/components/InputData.svelte";
    import flash from "../../../lib/utils/flash";

    let max: number = 0;
    let sumTop3: number = 0;
    let answersEl: HTMLElement;


    function scrollToAnswer(){
        answersEl.scrollIntoView({behavior: 'smooth'})
        flash(answersEl)
    }

    async function main(){
        const input = await fetch('/inputs/day1.txt').then(r => r.text());

        let elves: number[] = []
        const groups = input.split(/\r?\n\r?\n/)

        groups.forEach(elf => {
            const totalCalories = elf.split(/\r?\n/).reduce((acc, curr) => acc + parseInt(curr), 0);
            elves.push(totalCalories);
        })

        max = Math.max(...elves);
        sumTop3 = elves.sort((a, b) => b - a).slice(0, 3).reduce((acc, curr) => acc + curr, 0);

        console.log(max, sumTop3)
    }
    
    onMount( async() => {
        main()
    })

</script>


<section>
    <a href="https://adventofcode.com/2022/day/1">
        <h3>--- Day 1: Calorie Counting ---</h3>
    </a>
 
    <div class="example">
        <div class="input-data">
            <InputData code={`1000
2000
3000 

4000

5000
6000

7000
8000
9000

10000
`} />
    </div>
    <div>
        <p>We are given a list representing the 'calories worth of snacks' carried by the evles. The amount carried by each elf is the sum of the numbers between empty newlines</p>
        <p>In the example, the first elf carries (1000 + 2000 + 3000) calories, second elf carries 4000, third carries (5000 + 6000) etc with the elf carries most calories being the fourth elf at 24000</p>
        <p>Part 1 will ask us to find the elf holding the most snacks and part 2 will require us to calculate the sum of the 3 highest snack holders</p>


        <div>
            <p><a href="/inputs/day1.txt" target="_blank">Input data</a><p>
            <p on:click={scrollToAnswer} on:keypress>Scroll to answer</p>
        </div>


    </div>
</div>



<p>The first thing we do is fetch our input data, this can be from the Advent of code servers but i've saved it locally.</p>
<div class="code-block">
    <CodeBlock language="javascript"  code={`
const input = await fetch('/inputs/day1.txt').then(r => r.text());
`}/> </div>

<p>We are then going to split the input a couple times and sum the appropriate 'snacks' to calculate the calorie count per elf.</p>
<div class="code-block">
    <CodeBlock language="javascript"  code={`
const groups = input.split(/\\r?\\n\\r?\\n/)

let elves: number[] = []
groups.forEach(elf => {
    const totalCalories = elf.split(/\\r?\\n/).reduce((acc, curr) => acc + parseInt(curr), 0);
    elves.push(totalCalories);
})
`} /></div>

<p>For part 1, we just need to grab the elf with the most calories which is a simple max function.
    Part 2 is a little more complicated, we can sort the elves by calories and sum a sliced array.
    These will be our answers for part 1 and 2 respectively.
</p>
<div class="code-block">
    <CodeBlock language="javascript"  code={`
const max: number = Math.max(...elves);
const sumTop3: number = elves.sort((a, b) => b - a).slice(0, 3).reduce((acc, curr) => acc + curr, 0);
`} /> </div>

<p bind:this={answersEl}>
    This gives us the following answers:
    
    part1: {max}
    part2: {sumTop3}
</p>

</section>

<style lang="scss">

    .example {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;}

        p{
            padding: 0 2rem;
        }

    .input-data {
        height: 100%;
        background-color: #1e1e1e;
    }
    .code-block {
        width: 100%;
        height: 100%;
        background-color: #1e1e1e;
    }
</style>