<script>
    import UploadFiles from "./UploadFiles.svelte";
    import DomCompare from "./DomCompare.svelte";
    import FileCompare from "./FileCompare.svelte";


    //import { sourceFile } from "./UploadFiles.svelte";

    const views = [UploadFiles, DomCompare, FileCompare];

    let mainView = null;
    let currentView = 0;

    function updateMainView() {
        mainView = views[currentView];
    }

    function goToUpload() {
        currentView = 0
        sourceFile = null;
        destFile = null;
        updateMainView()
    }

    function goToDomDiffer() {
        currentView = 1
        updateMainView()
    }

    function goToFileDiffer() {
        currentView = 2
        updateMainView()
    }

    updateMainView()

    let sourceFile = null;
    let destFile = null;

    let sourceFileText = null;
    let destFileText = null;
    let isStyleContains = false;

    let result;

    async function castHtmlFileToTextPlain(file) {
        const reader = new FileReader()
        const promise = new Promise(resolve => {
        reader.onload = ev => {
            resolve(ev.target.result)
        }
            reader.readAsText(file)
        });

        return await Promise.resolve(promise);
    }

    //отсылает json с текстом из двух файлов и полем если должен содержаться стиль. Если стиль должен быть конкотинируем поля стиля и боди и вставляем как innerhtml
    //иначе только боди как  innerhtml
    async function compareFilesRequest(addres) {
        const res = await fetch(addres, {
            method: 'POST',
            body: JSON.stringify({
                sourceFileText,
                destFileText,
                isStyleContains
            })
        });

        const jsonResult = await res.json();
        result = json;
    }


    //преобразовать файлы в плэинтекст
    function comapreDomWithStyles(isWithStyle) {
        if (sourceFile === null && destFile === null) {
            return;
        }
        else {
            
            sourceFileText = castHtmlFileToTextPlain(sourceFile[0]);
            destFileText = castHtmlFileToTextPlain(destFile[0]);
            isStyleContains = isWithStyle;

            goToDomDiffer()

            compareFilesRequest('http://localhost:80/api/compare');
        }
    }

    function comapreFiles() {
        if (sourceFile === null && destFile === null) {
            return;
        }
        else {
            
            sourceFileText = castHtmlFileToTextPlain(sourceFile[0]);
            destFileText = castHtmlFileToTextPlain(destFile[0]);
            isStyleContains = isWithStyle;

            goToFileDiffer()

            compareFilesRequest('http://localhost:80/api/compare-text');
        }
    }

    function toggleStatistics() {
        const menu = document.getElementById("stat-menu");
        if (menu.style.width >= "24%") {
            menu.style.width = "0%"
        }
        else {
            menu.style.width = "25%"
        }
    }

</script>

<workarea>
    <!-- <div>
        
        <form action="http://localhost:80/api/compare" enctype="multipart/form-data" on:submit|preventDefault={handleSubmit}>
    
            <label for="src">Старый файл</label>
            <input id="src" name="src" type="file" accept=".html" required>
    
            <label for="dest">Новый файл</label>
            <input id="dest" name="dest" type="file" accept=".html" required>
            
            <input type="submit" value="Сравнить" />
        </form>
    
    </div>
    
    {@html resultHtml} -->
    <div class="omdb-work-area-wrapper">
        <div class="omdb-buttons-area-wrapper">
            <div class="omd-button-area">
                <div class="omdb-stat-toggle">
                    <button on:click={toggleStatistics}>Статистика</button>
                    <button on:click={goToUpload}>Сбросить</button>
                </div>
                <div class="omdb-main-inputs">
                    <button on:click={comapreDomWithStyles(true)}>Диффер вёрстки</button>
                    <button on:click={comapreDomWithStyles(false)}>Диффер текста</button>
                    <button on:click={comapreFiles}>Диффер файла</button>
                </div>
            </div>
        </div>
        <div class="omdb-main-area">
            <div class="omdb-statistics-wrapper" id="stat-menu">
                <div class="omdb-statistics">
                    <div class="omdb-stat-block omdb-files-name">
    
                    </div>
                    <div class="omdb-stat-block omdb-modified-stat">

                    </div>
                    <div class="omdb-stat-block omdb-added-stat">

                    </div>
                    <div class="omdb-stat-block omdb-delted-stat">

                    </div>
                    <div class="omdb-stat-block omdb-time-stat">

                    </div>
                </div>

            </div>
            
            <!-- {#if mainView == views[currentView]}
                <svelte:component this={mainView} ></svelte:component>
            {/if} -->
            {#if currentView == 0}
            <UploadFiles bind:sourceFile bind:destFile></UploadFiles>
            {:else if currentView == 1}
            <DomCompare bind:result></DomCompare>
            {:else}
            <FileCompare bind:result></FileCompare>
            {/if}
        </div>
    </div>
</workarea>

<style>
    workarea {
        background-color: bisque;
        min-height: 100%;
        width: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
    }

    .omdb-work-area-wrapper {
        min-height: 98%;
        min-width: 99%;
        background-color: aqua;
    }

    .omdb-buttons-area-wrapper {
        width: 100%;
        height: 110px;
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .omd-button-area {
        height: 90%;
        width: 99%;
        background-color: greenyellow;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .omdb-stat-toggle {
        width: 25%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .omdb-stat-toggle button {
        margin-left: 20px;
    }

    .omdb-main-inputs {
        width: 75%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .omdb-main-inputs button {
        margin-right: 120px;
    }

    .omdb-main-area {
        min-height: 900px;
        width: 100%;
        background-color: rgb(255, 54, 148);
        display: flex;
    }

    .omdb-statistics-wrapper {
        min-height: 100%;
        background-color: cadetblue;
        width: 0%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s ease-out;
    }

    .omdb-statistics {
        width: 95%;
        height: 99%;
        background-color: rgb(221, 221, 221);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-flow: column;
    }

    .omdb-stat-block {
        height: 25%;
        width: 100%;
        background-color: blueviolet;
        margin: 1px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .omdb-files-name {
        height: 15%;
        margin-top: 0px;
    }

    .omdb-time-stat {
        height: 10%;
    }
</style>