<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();


    export let day: number = 0;
    export let inputData: string;
    
    const link = `https://adventofcode.com/2022/day/${day}/input`
    let editing: boolean = false;

    function enableEdit() {
        editing = true;
    }

    function saveInputData() {
        inputData = inputData.trim();
        dispatch('saveInputData', inputData)
        editing = false;
    }

    function clearInputData() {
        inputData = '';
    }

    function resetInputData() {
        inputData = '';
        dispatch('resetInputData')
        editing = false;
    }

    function pasteInput(){
        navigator.clipboard.readText().then(text => {
            inputData = text;
        })
    }

    
</script>
<button on:click={enableEdit}>
    Input data
</button>

{#if editing}
    <overlay on:click={resetInputData}></overlay>

    <modal>
        <p>You can get and paste <a href="{link}" target="_blank" rel="noreferrer">your input data</a> from Advent of code here, Please paste it exactly it is on the site otherwise the code will not work.</p>
        <p>Unfortunately, CORS prevents the fetching of input data from AOC directly.</p>
    

        <div class="input-area">

            <textarea bind:value={inputData} rows="10" cols="50"></textarea>
            
            <div class="buttons">
                <button on:click={pasteInput} title="paste from clipboard, will require permission">Paste</button>
                <button on:click={clearInputData}>Clear</button>
                <button on:click={saveInputData}>Save</button>
                <button on:click={resetInputData} title="reset to default">Reset</button>
            </div>
        </div>
    </modal>
{/if}

<style lang="scss">
    overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);  
        backdrop-filter: blur(2px);      
        z-index: 10;
    }
    modal {
        margin: auto;
        position: fixed;
        width: 700px;
        z-index: 20;
        top: 20%;
        left: calc(50% - 350px - 1rem);
        background-color: #102028;
        padding: 2rem;

        textarea{
            width: 100%;
        }
        .buttons{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            margin-top: 1rem;

            button{
                margin-left: 1rem;
                margin-right: 0rem;
            }
        }
    }
</style>