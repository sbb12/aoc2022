<script lang="ts">
    export let code:string = '';
</script>

<p>
    {@html code}
</p>


<style lang="scss">
    p {
        display: block;
        margin: 0;        
        padding: 1rem;
        height: 100%;
        background-color: #1e1e1e;
        color: lightgray;
        font-family: monospace;
        white-space: pre-wrap;
    }
</style>