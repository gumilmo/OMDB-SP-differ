<script>
let resultHtml;
    let isTextComare = false;

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

    const handleSubmit = async e => {
        let ACTION_URL = e.target.action;
        if (isTextComare) {
            ACTION_URL += "-text"
        }
        const filesData = e.currentTarget;
        const formData = new FormData(filesData);
        
        const data = new URLSearchParams()
		for (let field of formData) {
			const [key, value] = field;
			data.append(key, await castHtmlFileToTextPlain(value));
		};

        const response = await fetch(ACTION_URL, {
				method: 'POST',
				body: data
		});

        resultHtml = await response.text();
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
                <button>Статистика</button>
                <button>Диффер вёрстки</button>
                <button>Диффер текста</button>
                <button>Диффер файла</button>
            </div>
        </div>
        <div class="omdb-main-area">
            <div class="omdb-statistics-wrapper">
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
            <div class="omdb-main-view-wrapper">
                <div class="omdb-main-view">

                </div>
            </div>
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
        width: 99%;
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
        justify-content: space-around;
        align-items: center;
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
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .omdb-main-view-wrapper {
        width: 100%;
        min-height: 100%;
        background-color: coral;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .omdb-main-view {
        width: 100%;
        min-height: 100%;
        background-color: tomato;
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