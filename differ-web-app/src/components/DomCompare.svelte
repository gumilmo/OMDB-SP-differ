<script>
    import { fade } from 'svelte/transition';
    import UploadFiles from './UploadFiles.svelte';

    let sourceFile = null;
    let destFile = null;

    export let result = null;

    function makeMobile() {
        document.getElementById("main-view").style.width = "580px";
    }
    function makeDesktop() {
        document.getElementById("main-view").style.width = "100%";
    }
</script>

<div class="omdb-main-view-wrapper">
    <div class="omdb-mobile-or-desktop">
        <button on:click={makeMobile}>mobile</button>
        <button on:click={makeDesktop}>desctop</button>
    </div>
    <div class="omdb-main-view" id="main-view">

    </div>
</div>

<style>
    .omdb-main-view-wrapper {
        width: 100%;
        min-height: 100%;
        background-color: coral;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-flow: column;
    }

    .omdb-mobile-or-desktop {
        width: 100%;
        height: 40px;
        background-color: aqua;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .omdb-mobile-or-desktop button {
        margin-left: 20px;
    }

    .omdb-main-view {
        width: 100%;
        min-height: 96%;
        background-color: tomato;
        transition: 0.3s ease-in-out;
    }
</style>