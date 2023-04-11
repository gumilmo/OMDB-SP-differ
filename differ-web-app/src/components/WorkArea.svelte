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
        <div class="omdb-buttons-area"></div>

        <div class="omdb-main-area">
            <div class="omdb-statistics">
    
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
        display: block;
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

    .omdb-buttons-area {
        width: 100%;
        height: 180px;
        background-color: black;
    }

    .omdb-main-area {
        height: 700px;
        width: 100%;
        background-color: rgb(255, 54, 148);
        display: flex;
    }

    .omdb-statistics {
        min-height: 100%;
        background-color: cadetblue;
        width: 25%;
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
</style>