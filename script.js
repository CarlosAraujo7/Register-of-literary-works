let mangaList = JSON.parse(localStorage.getItem('mangaList')) || [];
let mangaCounter = mangaList.length;

function addManga() {
    const mangaName = document.getElementById("mangaName").value;
    const currentChapter = document.getElementById("currentChapter").value;
    const coverLink = document.getElementById("coverLink").value;
    const siteToRead = document.getElementById("readLinks").value.trim();

    if (mangaName && currentChapter) {
        mangaCounter++;
        const manga = {
            id: mangaCounter,
            name: mangaName,
            chapter: currentChapter,
            cover: coverLink,
            lastModified: new Date().toLocaleString(),
            siteToRead: siteToRead,
            read: false
        };

        mangaList.push(manga);

        // Adicione a lógica de ordenação aqui
        mangaList.sort((a, b) => a.name.localeCompare(b.name));

        updateMangaList();
        resetForm();
        saveToLocalStorage();

        // Adiciona a exibição da mensagem de confirmação
        const successMessage = document.getElementById("successMessage");
        successMessage.style.display = "block";
        
        setTimeout(function() {
            // Esconde a mensagem após 3 segundos
            successMessage.style.display = "none";
        }, 2000); // Tempo em milissegundos (3 segundos neste exemplo)
    
    } else {
        // Exibe a mensagem de erro
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.style.display = "block";

        setTimeout(function() {
            // Esconde a mensagem após 3 segundos
            errorMessage.style.display = "none";
        }, 2000); // Tempo em milissegundos (3 segundos neste exemplo)
    }
}

function updateMangaList(filteredMangas = mangaList) {
    const mangaCounterElement = document.getElementById("mangaCounter");
    const mangaListElement = document.getElementById("mangaList");

    mangaCounterElement.innerHTML = `Total de Leituras: ${mangaList.length}`;
    
    mangaListElement.innerHTML = "";

    filteredMangas.forEach((manga, index) => {
        const mangaItem = document.createElement("li");
        mangaItem.className = `mangaItem ${manga.read ? "read" : ""}`;

        const mangaImage = document.createElement("img");
        mangaImage.src = manga.cover || "https://via.placeholder.com/300";
        mangaImage.alt = manga.name;
        mangaImage.className = "mangaImage";
        mangaImage.onclick = () => updateReadStatus(index);

        const mangaText = document.createElement("div");
        mangaText.className = "mangaText";
        mangaText.innerHTML = `
            <strong>${manga.name}</strong><br>
            <span>Capítulo Atual: ${manga.chapter}</span><br>
            <span>Data da última modificação: ${manga.lastModified}</span><br>
            <button class="mangaButton updateButton" onclick="updateChapter(${index})">Atualizar Capítulo</button>
            <div class="buttonContainer">
                <button class="mangaButton editButton" onclick="editSiteToRead(${index})">Editar</button>
                <button class="mangaButton readButton" onclick="redirectToSite(${index})">Ler</button>
            </div>
            <button class="mangaButton deleteButton" onclick="deleteManga(${index})">Apagar</button>
        `;

        // Adicionando classes aos botões diretamente
        const editButton = mangaText.querySelector('.editButton');
        const readButton = mangaText.querySelector('.readButton');

        editButton.classList.add('yourCustomEditButtonClass'); // Substitua 'yourCustomEditButtonClass' pela classe desejada
        readButton.classList.add('yourCustomReadButtonClass'); // Substitua 'yourCustomReadButtonClass' pela classe desejada

        mangaItem.appendChild(mangaImage);
        mangaItem.appendChild(mangaText);
        mangaListElement.appendChild(mangaItem);
    });
}


function searchMangas() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredMangas = mangaList.filter(manga => manga.name.toLowerCase().includes(searchInput));

    updateMangaList(filteredMangas);
}

function updateReadStatus(index) {
    mangaList[index].read = !mangaList[index].read;
    updateMangaList();
    saveToLocalStorage();
}

function updateChapter(index) {
    const currentManga = mangaList[index];

    // Criar um formulário de atualização de capítulo
    const updateForm = document.createElement("form");
    updateForm.innerHTML = `
        <label for="updateChapter">Novo Capítulo:</label>
        <input type="number" id="updateChapter" value="${currentManga.chapter}" required>

        <button type="button" onclick="submitUpdateChapter(${index})">Atualizar Capítulo</button>
        <button type="button" class="cancelButton" onclick="cancelUpdateChapter()">Cancelar</button>
    `;

    // Adicionar o formulário à página
    const updateContainer = document.getElementById("updateChapterContainer");
    updateContainer.innerHTML = "";
    updateContainer.appendChild(updateForm);

    // Exibir a tela de atualização de capítulo
    updateContainer.style.display = "flex";
    updateContainer.style.alignItems = "center";
    updateContainer.style.justifyContent = "center";
}

function submitUpdateChapter(index) {
    const newChapter = document.getElementById("updateChapter").value;

    if (!isNaN(newChapter)) {
        mangaList[index].chapter = newChapter;
        mangaList[index].lastModified = new Date().toLocaleString();
        updateMangaList();
        saveToLocalStorage();
        cancelUpdateChapter(); // Esconder o formulário após a atualização
    } else {
        alert("Insira um número válido para o novo capítulo.");
    }
}

function cancelUpdateChapter() {
    // Esconder a tela de atualização de capítulo ao cancelar
    document.getElementById("updateChapterContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}


function editSiteToRead(index) {
    const currentManga = mangaList[index];

    // Criar um formulário de edição
    const editForm = document.createElement("form");
    editForm.innerHTML = `
        <label for="editName">Novo Nome da Obra:</label>
        <input type="text" id="editName" value="${currentManga.name}" required>

        <label for="editSiteToRead">Novo Link para Leitura:</label>
        <input type="text" id="editSiteToRead" value="${currentManga.siteToRead}" required>

        <label for="editCoverLink">Novo Link da Capa:</label>
        <input type="text" id="editCoverLink" value="${currentManga.cover || ''}">

        <button type="button" onclick="submitEditForm(${index})">Salvar Edições</button>
        <button type="button" class="cancelButton" onclick="cancelEdit()">Cancelar</button>
    `;

    // Adicionar o formulário à página
    const editContainer = document.getElementById("editContainer");
    const overlay = document.getElementById("overlay");
    editContainer.innerHTML = "";
    editContainer.appendChild(editForm);

    // Exibir a tela de edição
    editContainer.style.display = "flex";
    editContainer.style.alignItems = "center";
    editContainer.style.justifyContent = "center";
    overlay.style.display = "block";
}

function cancelEdit() {
    // Esconder a tela de edição ao cancelar
    document.getElementById("editContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function submitEditForm(index) {
    const newName = document.getElementById("editName").value.trim();
    const newSiteToRead = document.getElementById("editSiteToRead").value.trim();
    const newCoverLink = document.getElementById("editCoverLink").value.trim();

    if (newName && newSiteToRead) {
        mangaList[index].name = newName;
        mangaList[index].siteToRead = newSiteToRead;
        mangaList[index].cover = newCoverLink;
        mangaList[index].lastModified = new Date().toLocaleString();

        updateMangaList();
        saveToLocalStorage();

        // Esconder a tela de edição após salvar as alterações
        document.getElementById("editContainer").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    } else {
        alert("Nome e Link para Leitura são campos obrigatórios.");
    }
}

function redirectToSite(index) {
    const siteToRead = mangaList[index].siteToRead;
    if (siteToRead) {
        window.open(siteToRead, '_blank');
    } else {
        alert("Nenhum link de leitura cadastrado para esta obra.");
    }
}

// Função para deletar uma obra específica
function deleteManga(index) {
    const confirmDelete = confirm("Tem certeza que deseja apagar esta obra?");
    if (confirmDelete) {
        const mangaToDelete = mangaList[index];

        // Encontrar o índice do manga na lista original (não filtrada)
        const originalIndex = mangaList.findIndex(manga => manga.id === mangaToDelete.id);

        // Remover o manga da lista original
        if (originalIndex !== -1) {
            mangaList.splice(originalIndex, 1);
            updateMangaList();
            saveToLocalStorage();
        }
    }
}

function organizeByAlphabet() {
    mangaList.sort((a, b) => a.name.localeCompare(b.name));
    updateMangaList();
}

function organizeByDate() {
    mangaList.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    updateMangaList();
}

let darkMode = false;

function toggleDarkMode() {
    darkMode = !darkMode;
    applyDarkMode();
}

function applyDarkMode() {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    localStorage.setItem('darkMode', 'true');
}

function applyLightMode() {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    localStorage.setItem('darkMode', 'false');
}

let lampOn = true;

function toggleLamp() {
    lampOn = !lampOn;
    applyLampState();
    if (lampOn) {
        applyDarkMode(); // Chama applyDarkMode apenas quando a lâmpada está acesa
    } else {
        applyLightMode(); // Chama applyLightMode apenas quando a lâmpada está apagada
    }
}

function applyLampState() {
    const lampImage = document.getElementById("lampImage");

    if (lampOn) {
        lampImage.src = "desligada.png";
    } else {
        lampImage.src = "ligada.png";
    }
}

function resetForm() {
    document.getElementById("mangaForm").reset();
}

function saveToLocalStorage() {
    localStorage.setItem('mangaList', JSON.stringify(mangaList));
}

// Carregar dados do Local Storage ao carregar a página
window.onload = function () {
    updateMangaList();
    darkMode = localStorage.getItem('darkMode') === 'true';
    applyDarkMode();
};

// Adicione isto ao seu código para fechar a tela de edição ao clicar fora do formulário
window.addEventListener('click', function(event) {
    const editContainer = document.getElementById("editContainer");
    const editForm = document.querySelector("#editContainer form");

    if (event.target === editContainer && !editForm.contains(event.target)) {
        cancelEdit();
    }

    const updateChapterContainer = document.getElementById("updateChapterContainer");
    const updateChapterForm = document.querySelector("#updateChapterContainer form");

    if (event.target === updateChapterContainer && !updateChapterForm.contains(event.target)) {
        cancelUpdateChapter();
    }
});


