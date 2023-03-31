<script lang="ts">
    import { onMount } from "svelte";
    import CodeBlock from "../../../lib/components/codeBlock.svelte";
    import InputBlock from "../../../lib/components/InputBlock.svelte";
    import Input from "../../../lib/components/Input.svelte";
    import flash from "../../../lib/utils/flash";

    let day: number = 5;

    // elements
    let answersEl: HTMLElement;
    let overlayEl: HTMLElement;
    let modalEl: HTMLElement;
    let canvasEl: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    // default
    let solving: boolean = false;
    let loaded: boolean = false;
    let input: string;
    let part1: string = '';
    let part2: string = '';
    let stacks: any = [];

    // animation variables
    let stop: boolean = true;
    let yClearance: number = 0;
    let moveInstructions: string[] = [];
    let currentMove: {from: number, to:number}[] = [];
    let inMotion: any[] = [];
    let fps:number = 75;
    
    // options
    let moveDistance: number = 0.5;
    let fallMultiplier: number = 1;
    let scaleVertical: boolean = true;
    let showTransport: boolean = true;

    

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

    // when solve button is clicked
    function solve(){
        answersEl.scrollIntoView({behavior: 'smooth'})
        flash(answersEl)
        solving = true;
        main()
        solving = false;
    }

    // when animate button is clicked
    function animation(){

        modalEl.classList.remove('hidden')
        overlayEl.classList.remove('hidden')

        yClearance = 0;
        moveInstructions = [];
        currentMove = [];
        inMotion = [];
        stop = false;

        ctx = canvasEl.getContext('2d');
        //set aspect ration
        ctx.canvas.width = 200;
        ctx.canvas.height = 500;


        const [blueprint, instructions] = input.split(/\r?\n\r?\n/)
        initialiseStacksNodes(blueprint)
        moveInstructions = instructions.split(/\r?\n/).reverse();

        canvasEl.classList.add('active')
        setTimeout(() => {requestAnimationFrame(animate);}, 1000 / fps);
    }

    function animate() {

        if (stop) return

       // as long as we have stuff in motion, move nodes
        if (inMotion.length > 0){
            motionTick()
            draw()
        }

        //  if there are still boxes to be moved, begin moving them
        if (currentMove.length > 0){
            const node = stacks[currentMove[0].from].pop()
            node.target = currentMove[0].to
            inMotion.push(node)
            currentMove.shift()
        } 

        // wait for all nodes to be in place before moving on
        if (inMotion.length > 0 || currentMove.length > 0){
            setTimeout(() => {requestAnimationFrame(animate);}, 1000 / fps);
            return
        }
        
        // once all nodes are in place, move on to next instruction
        if (moveInstructions.length > 0){
            const line = moveInstructions.pop()
            const [quantity, moveFrom, moveTo ] = line.match(/[0-9]+/g).map(n => Number(n))
            yClearance = Math.max(
                stacks[moveTo - 1].length + quantity + 1, 
                stacks.slice(Math.min(moveFrom, moveTo) - 1, Math.max(moveFrom, moveTo)).reduce((acc, cur) => Math.max(acc, cur.length), 0) + 1
            )
            for (let i=0; i<quantity; i++){
                currentMove.push({from: moveFrom - 1, to: moveTo - 1})
            }
        } 

        if (inMotion.length <= 0 && currentMove.length <= 0 && moveInstructions.length <= 0){
            stop = true;
        } else {
            setTimeout(() => {requestAnimationFrame(animate);}, 1000 / fps);
        }

        
    }

    // tick for the nodes in motion
    function motionTick(){       
        
        // skip motion animation
        if (!showTransport){
            inMotion.forEach((node, i) => {
                node.x = node.target
                node.y = stacks[node.target].length
                stacks[node.target].push(node)
                inMotion.splice(i, 1)
            })
            return
        }

        // move nodes
        inMotion.forEach((node, i) => {
            // if node above target
            if (node.x == node.target){
                node.rotation = 0;
                
                // if node is in place
                if (node.y <= stacks[node.target].length){
                    node.y = stacks[node.target].length
                    stacks[node.target].push(node)
                    inMotion.splice(i, 1)
                } else { // move down
                    node.y -= moveDistance * fallMultiplier
                }
            } else if (node.y >= yClearance) {  // node is at right height
                node.y = yClearance;
                if (node.x < node.target){ // move right
                    node.rotation = -Math.PI;
                    node.x += (moveDistance + yClearance - node.y)
                    if (node.x >= node.target) {
                        node.x = node.target
                    }
                } else { // move left
                    node.rotation = Math.PI;
                    node.x -= (moveDistance + yClearance - node.y)
                    node.x <= node.target && (node.x = node.target)
                }
            } else {
                node.rotation = 0;
                node.y += moveDistance
            }
        })
        
    }

    // draw on canvas
    async function draw(){

        // clear canvas
        const cx = ctx.canvas.width 
        const cy = ctx.canvas.height
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // get correct box and text size to fit everything
        let box = cx / stacks.length;
        if (scaleVertical){
            box = Math.min(
                box, 
                cy / yClearance - 1,
                cy / stacks.reduce((acc, cur) => Math.max(acc, cur.length), 0) - 2
            )
        }


        ctx.font = `${Math.floor(box * 0.7)}px Arial`;
        
        // draw stationary boxes
        stacks.forEach((stack, i) => {  // x position
            stack.forEach((node, j) => { // y position
                //box
                ctx.strokeStyle = '#000'
                ctx.fillStyle = '#C4A484'
                ctx.lineJoin = 'bevel'
                ctx.lineWidth = 1
                ctx.strokeRect(i * box, cy - (j * box), box, -box)
                ctx.fillRect(i * box, cy - (j * box), box, -box)
                // text 
                ctx.fillStyle = 'black'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(node.char, i * box + box / 2, cy - (j * box) - box / 2)
            })
        })
        
        //draw moving boxes
        inMotion.forEach((node, i) => {
            ctx.save()
            ctx.translate(node.x * box + box / 2, cy - (node.y * box) - box / 2)
            ctx.rotate(node.rotation * - Math.PI / 90)
            // box          
            ctx.strokeStyle = 'black' 
            ctx.lineJoin = 'bevel'
            ctx.lineWidth = 1 
            ctx.fillStyle = 'lightgreen'
            ctx.strokeRect(-box / 2, -box / 2, box, box)
            ctx.fillRect(-box / 2, -box / 2, box, box)
            // text 
            ctx.fillStyle = 'black'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(node.char, 0, 0)
            ctx.restore()
        })
    }


    // main function
    async function main(){
                
        // split on empty line and initialise stacks
        const [blueprint, instructions] = input.split(/\r?\n\r?\n/)
        
        // part1 
        initialiseStacks(blueprint) 
        instructions.split(/\r?\n/).forEach(line => {
            const [quantity, moveFrom, moveTo ] = line.match(/[0-9]+/g).map(n => Number(n))

            for (let i = 0; i < quantity; i++){
                stacks[moveTo - 1].push(stacks[moveFrom - 1].pop())
            }
        }) 
        part1 = stacks.reduce((acc, cur) => acc + cur.pop(), '')

        // part 2
        initialiseStacks(blueprint) 
        
        instructions.split(/\r?\n/).forEach(line => {
            const [quantity, moveFrom, moveTo ] = line.match(/[0-9]+/g).map(n => Number(n))
            
            const temp = stacks[moveFrom - 1].splice(-quantity)
            stacks[moveTo - 1].push(...temp)
        })
        part2 = stacks.reduce((acc, cur) => acc + cur.pop(), '')
    
    }

    // turn blueprint into useable array of stacks
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

    // turn blueprint into useable array of stacks but with more information for animation
    function initialiseStacksNodes(blueprint: string){
        // empty stacks
        stacks = [];
        for (let i = 0; i < 9; i++){
            stacks.push([])
        }
        // fill stacks
        let lines = blueprint.split(/\r?\n/)
        lines.pop() // remove last line which doesn't contain stack info
        lines.reverse() // reverse order so we can build from the bottom up

        lines.forEach( (line, j) => {
            for (let i = 0; i < 9; i++){
                const char = line[i*4 + 1]
                if (char.match(/[A-Z]/)) {
                    stacks[i].push({ x: i, y: j, char: char, target: null })
                } 
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
`} width={'170'}/>
        <div>
        
        <p>This is a the first animated puzzle, the elves have a stacks of crates marked with letters that need to be rearranged according to a schematic</p>
        <p>The initial setup is draw out and instructions are provided to move the crates around</p>
        <p>We will be picking up items from one stack and moving it to another stack</p>
        <p>For part 1 we will be moving crates one at a time and for part 2 we will pick up multiple crates at once which will change the order they are placed</p>
        <p>The answers for the respective parts are the letters found on the top crate per stack.</p>

        {#if loaded}
            <div class="interactions"> 
                <button on:click={solve} on:keypress>
                    Solve
                </button>
                <button on:click={animation} on:keypress>
                    Animate
                </button>
                <Input day={1} inputData={input} on:resetInputData={resetInputData} on:saveInputData={saveInputData}/>
            </div>
        {/if}


    </div>
</div>

<p>The first thing we need to do is split the input data into two parts, one to initialise the data and the other to execute the instructions</p>

<CodeBlock language="javascript"  code={`
const [blueprint, instructions] = input.split(/\\r?\\n\\r?\\n/)
`}/>

<p>We can start by cleaning the blueprint data a bit and looping through the remaining lines. We can check if there is a character where we are expecting the crate information and add it to the right stack </p>

<CodeBlock language="javascript"  code={`
stacks = [];
let lines = blueprint.split(/\\r?\\n/)
lines.pop() // remove last line which doesn't contain stack info
lines.reverse() // reverse order so we can more easily build from the bottom up

lines.forEach(line => {
    for (let i = 0; i < 9; i++){
        const char = line[i*4 + 1]
        char.match(/[A-Z]/) && stacks[i].push(char)
    }
})
`}/>


<p>We then need to grab the information from the instructions for which i've chosen to use regex. We know there are going to be three numbers in each line and what they mean. 
Then all that's left is to take the last element from the moveFrom stack and add it on the end of the moveTo stack, for however many times it requires.

For the answer, we can reduce the array to form a string of characters from their last elements.

Note* The inputs are generated so that it will never ask you to move a crate which isn't there, so we don't need to do any checks for that.</p>

<CodeBlock language="javascript"  code={`
instructions.split(/\\r?\\n/).forEach(line => {
    const [quantity, moveFrom, moveTo ] = line.match(/[0-9]+/g).map(n => Number(n))

    for (let i = 0; i < quantity; i++){
        stacks[moveTo - 1].push(stacks[moveFrom - 1].pop())
    }
}) 
part1 = stacks.reduce((acc, cur) => acc + cur.pop(), '')
`}/>

<p>Part 2 is almost identical to part 1, we still grab the instructions and final output in the same way, but this time we can use the splice function to grab chunks from the end of arrays before adding them to the target stack. 
This method can also be used for part 1 with a .reverse() added after the splice.</p>

<CodeBlock language="javascript"  code={`   
const temp = stacks[moveFrom - 1].splice(-quantity)
stacks[moveTo - 1].push(...temp)
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
        <button on:click={()=>{modalEl.classList.add('hidden'); overlayEl.classList.add('hidden'); stop=true;}}>X</button>
        
        <p>This is part 1 visualised, with some options to play around with</p>

        <label>Box transport speed</label>
        <input type="range" bind:value={moveDistance} min="0.1" max="1" step="0.1">

        <label>Box fall multiplier</label>
        <input type="range" bind:value={fallMultiplier} min="0.5" max="6" step="0.1" >
        
        <label>Scale to fit verticaly</label>
        <input type="checkbox" bind:checked={scaleVertical} title="will scale to fit all boxes on screen">

        <label>Show boxes in transport</label>
        <input type="checkbox" bind:checked={showTransport} title="disable to remove travel time">
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
    
    canvas {

    }

    .inputs{
        width: 100%;
        margin-left: 1rem;
        display: flex;
        flex-direction: column;

        button{
            width: 60px;
            margin-left: auto;
            margin-bottom: 20px;
        }
        
        label{
            display: block;
            align-items: center;
            text-align: center;
        }

        input {
            margin-bottom: 1.5rem;
        }
    }
    
</style>