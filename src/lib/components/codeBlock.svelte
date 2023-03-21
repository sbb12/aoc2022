<script lang="ts">
    import prism from "prismjs";
    export const highlight = prism.highlightElement;
    
    export let language = "javascript";
    export let code = "";
    
    const grammar = prism.languages[language];
    const formattedCode = prism.highlight(code, grammar, language);

</script>



<pre class="language-{language}">
    <code class="language-{language}">
        {@html formattedCode}
    </code>
</pre>


<style>
    pre {
        margin: 0;
        padding: 0 1rem;
        width: fit-content;
    }
</style>
