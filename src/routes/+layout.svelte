<script lang="ts">
    import 'prismjs';
    // import 'prismjs/themes/prism-tomorrow.css';
    import 'prismjs/components/prism-typescript.min.js';
    import '../lib/prism/vscdark.css';
    import '../lib/prism/atom-dark.css';
</script>

<body>
    <slot />
</body>




<style lang="scss">
    body {
        background-color: #09161b;
        color: lightgray;
        font-family: monospace;
        white-space: pre-wrap;
    }
</style>