<script lang="ts">
    import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputData from "../../../lib/components/InputData.svelte";
    import flash from "../../../lib/utils/flash";

    let answersEl: HTMLElement;
    let part1: number;
    let part2: number;

    function scrollToAnswer(){
        answersEl.scrollIntoView({behavior: 'smooth'})
        flash(answersEl)
    }

    async function main(){
    
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
            <InputData code={`

        `} /></div>
        <div>
        
        <p></p>

        <div>
            <p><a href="/inputs/day2.txt" target="_blank">Input data</a><p>
            <p on:click={scrollToAnswer} on:keypress>Scroll to answer</p>
        </div>


    </div>
</div>

<p></p>
<div class="code-block">
    <CodeBlock language="javascript"  code={`

`}/> </div>

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