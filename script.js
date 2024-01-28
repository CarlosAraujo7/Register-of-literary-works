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

        updateMangaList();
        resetForm();
        saveToLocalStorage();

        alert("Mangá/Manhwa cadastrado com sucesso!");
    
    } else {
        alert("Insira um nome e um capítulo válido.");
    }
    
}

function updateMangaList() {
    const mangaCounterElement = document.getElementById("mangaCounter");
    const mangaListElement = document.getElementById("mangaList");

    mangaCounterElement.innerHTML = `Total de Leituras: ${mangaList.length}`;

    mangaListElement.innerHTML = "";

    mangaList.forEach((manga, index) => {
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
                <button class="mangaButton editButton" onclick="editSiteToRead(${index})">Editar Link da Obra</button>
                <button class="mangaButton readButton" onclick="redirectToSite(${index})">Ler</button>
            </div>
            <button class="mangaButton deleteButton" onclick="deleteManga(${index})">Apagar</button>
        `;

        mangaItem.appendChild(mangaImage);
        mangaItem.appendChild(mangaText);
        mangaListElement.appendChild(mangaItem);
    });
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

function resetForm() {
    document.getElementById("mangaForm").reset();
}

function saveToLocalStorage() {
    localStorage.setItem('mangaList', JSON.stringify(mangaList));
}

// Carregar dados do Local Storage ao carregar a página
window.onload = function () {
    updateMangaList();
};
