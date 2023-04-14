<script>
    import { fade } from 'svelte/transition';
    import { writable } from "svelte/store";

    export let sourceFile = writable([]);
    export let destFile = writable([]);

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="omdb-main-upload-files-wrapper">
    <div class="omdb-main-upload-files" id="main-view">
        <div class="omdb-upload-file-wrapper" >
            <label class="input-file">
                <input type="file" name="file" bind:files={sourceFile} >		
                <!-- svelte-ignore a11y-missing-attribute -->
                <img class="file-icon" src="./static/add-file.svg" height="150px" width="150px" />
                <label for="src">SOURCE FILE</label>
            </label>
        </div>

        <div class="omdb-upload-file-wrapper">
            <label class="input-file">
                <input type="file" name="file" bind:files={destFile}>		
                <!-- svelte-ignore a11y-missing-attribute -->
                <img class="file-icon" src="./static/add-file.svg" height="150px" width="150px" />
                <label for="dest">DESTINATION FILE</label>
            </label>
        </div>
    
    </div>
</div>

<style>
    .omdb-main-upload-files-wrapper {
        width: 100%;
        min-height: 100%;
        /*background-color: rgb(80, 150, 255);*/
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-flow: column;
    }

    .omdb-main-upload-files {
        width: 100%;
        min-height: 100%;
        /*background-color: rgb(71, 255, 163);*/
        border: 1px solid #DBDBDB;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .input-file {
        position: relative;
        display: inline-block;
        padding: 100px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        margin-left: 20px;
        margin-right: 20px;
        color: white;
        background-color: #0F62FE;
        border-radius: 5px;
        box-shadow: 0px 4px 14px -2px rgba(0, 0, 0, 0.67);
    }

    .input-file input[type=file] {
        position: absolute;
        z-index: -1;
        opacity: 0;
        display: block;
        width: 0;
        height: 0;
    }

</style>