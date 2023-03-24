<script lang="ts">
    import 'prismjs';
    // import 'prismjs/themes/prism-tomorrow.css';
    import 'prismjs/components/prism-typescript.min.js';
    import '../lib/prism/vscdark.css';
    import '../lib/prism/atom-dark.css';

    import '../app.css'
</script>

<main>
    <slot />
</main>




<style lang="scss">
    main {
        max-width: 1000px;
        margin: 0 auto;
        padding: 1rem;
    }
</style>