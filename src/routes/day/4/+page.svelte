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

        input.split(/\r?\n/).forEach(line => {

            const [elf1, elf2] = line.split(',')

            const [a, b] = elf1.split('-').map(n => parseInt(n))
            const [c, d] = elf2.split('-').map(n => parseInt(n))

            if ((a <= c && d <= b) || (c <= a && b <= d)) {
                part1++
            } 
            if ((a <= c && c <= b) || (c <= a && a <= d)) {
                part2++
            }
        })

    }
    

</script>


<section>
    <a href="https://adventofcode.com/2022/day/{day}">
        <h3>--- Day {day}: Camp Cleanup ---</h3>
    </a>

    <a href="https://github.com/sbb12/aoc2022/blob/master/src/routes/day/{day}/%2Bpage.svelte" target="_blank" rel="noreferrer" title="open this page source on github">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
    </a>
 
    <div class="example">
        
<InputBlock code={`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8

(visualised)
.234.....  2-4
.....678.  6-8

.23......  2-3
...45....  4-5

....567..  5-7
......789  7-9

.2345678.  2-8
..34567..  3-7

.....6...  6-6
...456...  4-6

.23456...  2-6
...45678.  4-8
`} width={'115'}/>
        <div>
        
        <p>The Elves need to clear their camp, each elf is assigned a range of sections to clean, the elves pair and compare their assignments.</p>
        <p>In the first example, elf 1 cleans sections 2-3 while elf 2 cleans section 4-5. There is no overlap in their assignments.</p>
        <p>The 3rd example shows the elves overlap at section 7 and example 4 shows one elf fully contains the other's sections.</p>
        <p>For part 1, we need to work out how many elves completely contain their partner</p>
        <p>For part 2, we need to work out how many have any level of overlap at all</p>

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

<p>The trick here is to first split the line into useable data, we need to extract 4 values which are elf1 start (a) elf 1 end (b) elf 2 start (c) and elf 2 end (d) </p>

<CodeBlock language="javascript"  code={`
const [elf1, elf2] = line.split(',')

const [a, b] = elf1.split('-').map(n => parseInt(n))
const [c, d] = elf2.split('-').map(n => parseInt(n))
`}/>

<p>Then it's just a bunch of comparisons to determine overlap </p>

<CodeBlock language="javascript"  code={`
if ((a <= c && d <= b) || (c <= a && b <= d)) {
    part1++ 
} 
if ((a <= c && c <= b) || (c <= a && a <= d)) {
    part2++
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

</section>


<style lang="scss">
    
</style>