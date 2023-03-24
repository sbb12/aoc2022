<script lang="ts">
    export let code:string = '';
</script>

<pre>
    {@html code}
</pre>


<style lang="scss">
    pre {
        display: block;
        margin: 0 2rem 0 0;        
        padding: 1rem;
        height: 100%;
        background-color: #1b1e23;
        color: rgb(182, 182, 182);
        font-family: monospace;
        white-space: pre-wrap;
        background: #1b1e23;
        border: solid 1px rgb(182, 182, 182)
    }
</style>