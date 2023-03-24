<script lang="ts">
	import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputBlock from "../../../lib/components/InputBlock.svelte";
    import Input from "../../../lib/components/Input.svelte";
    import flash from "../../../lib/utils/flash";

    let part1: number = 0;
    let part2: number = 0;
    let answersEl: HTMLElement;
    let solving: boolean = false;
    let input: string;
    let loaded: boolean = false;

    onMount( async() => {
        input = await fetch('/inputs/day1.txt').then(r => r.text())
        loaded = true;
    })

    async function resetInputData(e: CustomEvent<string>){
        input = await fetch('/inputs/day1.txt').then(r => r.text())
    }

    async function saveInputData(e: CustomEvent<string>){
        if (!e.detail) {
            input = await fetch('/inputs/day1.txt').then(r => r.text())
        } else {
            input = e.detail
        }
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

        let elves: number[] = []
        const groups = input.split(/\r?\n\r?\n/)

        groups.forEach(elf => {
            const totalCalories = elf.split(/\r?\n/).reduce((acc, curr) => acc + parseInt(curr), 0);
            elves.push(totalCalories);
        })

        part1 = Math.max(...elves);
        part2 = elves.sort((a, b) => b - a).slice(0, 3).reduce((acc, curr) => acc + curr, 0);
    }

</script>


<section>
    <a href="https://adventofcode.com/2022/day/1">
        <h3>--- Day 1: Calorie Counting ---</h3>
    </a>
 
    <div class="example">
            <InputBlock code={`1000
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
    <div>
        <p>We are given a list representing the 'calories worth of snacks' carried by the evles. The amount carried by each elf is the sum of the numbers between empty newlines</p>
        <p>In the example, the first elf carries (1000 + 2000 + 3000) calories, second elf carries 4000, third carries (5000 + 6000) etc with the elf carries most calories being the fourth elf at 24000</p>
        <p>Part 1 will ask us to find the elf holding the most snacks and part 2 will require us to calculate the sum of the 3 highest snack holders</p>

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



<p>The first thing we do is grab our input data which i've saved locally. You can view it or use your own with the 'input data' button! </p>
<CodeBlock language="javascript"  code={`
    const input = await fetch('/inputs/day1.txt').then(r => r.text());  
`}/>

<p>We are then going to split the input a couple times and sum the appropriate 'snacks' to calculate the calorie count per elf.</p>

<CodeBlock language="javascript"  code={`
    const groups = input.split(/\\r?\\n\\r?\\n/)

    let elves: number[] = []
    groups.forEach(elf => {
        const totalCalories = elf.split(/\\r?\\n/).reduce((acc, curr) => acc + parseInt(curr), 0);
        elves.push(totalCalories);
    })
`} />

<p>For part 1, we just need to grab the elf with the most calories which is a simple max function.
Part 2 is a little more complicated, we can sort the elves by calories and sum a sliced array.
These will be our answers for part 1 and 2 respectively.
</p>

<CodeBlock language="javascript"  code={`
    const max: number = Math.max(...elves);
    const sumTop3: number = elves.sort((a, b) => b - a).slice(0, 3).reduce((acc, curr) => acc + curr, 0);
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