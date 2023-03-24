<script lang="ts">
    import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputBlock from "../../../lib/components/InputBlock.svelte";
    import Input from "../../../lib/components/Input.svelte";
    import flash from "../../../lib/utils/flash";

    let day: number = 3;

    let answersEl: HTMLElement;
    let part1: number = 0;;
    let part2: number = 0;;
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
        if (!input){
            input = await fetch('/inputs/day3.txt').then(r => r.text());
        }
        const lines = input.split(/\r?\n/)
        
        //part 1
        lines.forEach(line => {
            const firstHalf = line.slice(0, line.length / 2)
            const secondHalf = line.slice(line.length / 2)

            const char = getIntersection(firstHalf, secondHalf)
            part1 += charPriority( char )
        })

        // part 2
        for (let i = 0; i < lines.length; i += 3) {
            const char = getIntersection(lines[i], lines[i + 1], lines[i + 2])
            part2 += charPriority( char )
        }
    }  

    /**
    * Calculates the priority value for a given character.
    * @param {string} char - The character to calculate the priority value for.
    * @returns {number} The priority value for the given character.
    */
    function charPriority(char:string): number {
        const charCode = char.charCodeAt(0)
        if(charCode > 96){
            return charCode - 96
        } 
        return charCode - 38        
    }

    /**
     * Returns the intersection of two or more strings.
     * @param {string} str1 - The first string to compare.
     * @param {string} str2 - The second string to compare.
     * @param {string[]} rest - Additional strings to compare (optional).
     * @returns {string} The characters that are common to all input strings.
     */
    function getIntersection(str1: string, str2: string, ...rest: string[]): string {
        const re = new RegExp('[' + str1 + ']', 'g')
        const intersection = str2.match(re).join('')
        
        if (rest.length > 0){
            return getIntersection(intersection, rest[0], ...rest.slice(1))
        }
        return intersection
    }

</script>


<section>
    <a href="https://adventofcode.com/2022/day/2">
        <h3>--- Day 2: Rock Paper Scissors ---</h3>
    </a>
 
    <div class="example">
        
        <InputBlock code={`
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
    `} />
        <div>
        
        <p>We are asked to locate duplicate items (characters) that are carried by the elves. Each line represents the items carried by individual elf.</p>
        <p>Part 1 asks us to split the elf's items into two compartments down the middle and find the character that appears in both halves. (there is always only one)</p>
        <p>Part 2 asks us to look at groups of 3 elves and find the character that appears in all 3. (also always only one)</p>
        <p>For both parts we need to calculate the 'priority' value of the character and sum the values.
    Lowercase item types 'a' through 'z' have priorities 1 through 26.
    Uppercase item types 'A' through 'Z' have priorities 27 through 52.</p>
    
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

<p>There are going to be two main functions we need for this, one is to compare strings to return any common characters. There are many ways to do this but i've chosen to use regex and recursion as i found it more interesting. </p>

    <CodeBlock language="javascript"  code={`
/**
* Returns the intersection of two or more strings.
* @param {string} str1 - The first string to compare.
* @param {string} str2 - The second string to compare.
* @param {string[]} rest - Additional strings to compare (optional).
* @returns {string} The characters that are common to all input strings.
*/
function getIntersection(str1: string, str2: string, ...rest: string[]): string {
    const re = new RegExp('[' + str1 + ']', 'g')
    const intersection = str2.match(re).join('')
    
    if (rest.length > 0){
        return getIntersection(intersection, rest[0], ...rest.slice(1))
    }
    return intersection
}
`}/> 

<p>The second main function is a simple convert from character to a priority value with the parameters given by the challenge.</p>

    <CodeBlock language="javascript"  code={`
/**
* Calculates the priority value for a given character.
* @param {string} char - The character to calculate the priority value for.
* @returns {number} The priority value for the given character.
*/
function charPriority(char:string): number {
    const charCode = char.charCodeAt(0)
    if(charCode > 96){
        return charCode - 96
    } 
    return charCode - 38        
}

`}/> 

<p>We can then loop through the input lines and sum up the values for our answers.</p>
    <CodeBlock language="javascript"  code={`
//part 1
lines.forEach(line => {
    const firstHalf = line.slice(0, line.length / 2)
    const secondHalf = line.slice(line.length / 2)

    const char = getIntersection(firstHalf, secondHalf)
    part1 += charPriority( char )
})

// part 2
for (let i = 0; i < lines.length; i += 3) {
    const char = getIntersection(lines[i], lines[i + 1], lines[i + 2])
    part2 += charPriority( char )
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
    .example {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;}

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