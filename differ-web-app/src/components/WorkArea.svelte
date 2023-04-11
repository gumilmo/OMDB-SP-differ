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
</workarea>

<style>
    workarea {
        background-color: bisque;
        height: 900px;
        width: 100%;
        display: block;
    }
</style>