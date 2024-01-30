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

        alert("Mangá/Manhwa cadastrado com sucesso!");
    
    } else {
        alert("Insira um nome e um capítulo válido.");
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
    const newChapter = prompt("Insira o novo capítulo:");
    if (newChapter !== null && !isNaN(newChapter)) {
        mangaList[index].chapter = newChapter;
        mangaList[index].lastModified = new Date().toLocaleString();
        updateMangaList();
        saveToLocalStorage();
    }
}

function editSiteToRead(index) {
    const currentSiteToRead = mangaList[index].siteToRead;
    const newSiteToRead = prompt("Insira o novo link para leitura:", currentSiteToRead);

    if (newSiteToRead !== null) {
        mangaList[index].siteToRead = newSiteToRead.trim();
        updateMangaList();
        saveToLocalStorage();
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

function deleteManga(index) {
    const confirmDelete = confirm("Tem certeza que deseja apagar esta obra?");
    if (confirmDelete) {
        mangaList.splice(index, 1);
        updateMangaList();
        saveToLocalStorage();
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
