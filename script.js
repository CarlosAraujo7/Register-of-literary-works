let mangaList = [];
let mangaCounter = 0;

function addManga() {
    const mangaName = document.getElementById("mangaName").value;
    const currentChapter = document.getElementById("currentChapter").value;
    const coverLink = document.getElementById("coverLink").value;

    if (mangaName && currentChapter) {
        mangaCounter++;
        const manga = {
            id: mangaCounter,
            name: mangaName,
            chapter: currentChapter,
            cover: coverLink,
            lastModified: new Date().toLocaleString() // Adicionando a data da última modificação
        };

        mangaList.push(manga);

        updateMangaList();
        resetForm();
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
        mangaImage.src = manga.cover || "https://via.placeholder.com/300"; // Imagem de capa padrão caso não seja fornecido um link
        mangaImage.alt = manga.name;
        mangaImage.className = "mangaImage";
        mangaImage.onclick = () => updateReadStatus(index);

        const mangaText = document.createElement("div");
        mangaText.className = "mangaText";
        mangaText.innerHTML = `
            <strong>${manga.name}</strong><br>
            <span>Capítulo Atual: ${manga.chapter}</span><br>
            <span>Data da última modificação: ${manga.lastModified}</span><br>
            <button class="updateButton" onclick="updateChapter(${index})">Atualizar Capítulo</button>
            <button class="deleteButton" onclick="deleteManga(${index})">Apagar</button>
        `;

        mangaItem.appendChild(mangaImage);
        mangaItem.appendChild(mangaText);
        mangaListElement.appendChild(mangaItem);
    });
}

function updateReadStatus(index) {
    mangaList[index].read = !mangaList[index].read;
    updateMangaList();
}

function updateChapter(index) {
    const newChapter = prompt("Insira o novo capítulo:");
    if (newChapter !== null && !isNaN(newChapter)) {
        mangaList[index].chapter = newChapter;
        mangaList[index].lastModified = new Date().toLocaleString(); // Atualizando a data da última modificação
        updateMangaList();
    }
}

function deleteManga(index) {
    const confirmDelete = confirm("Tem certeza que deseja apagar esta obra?");
    if (confirmDelete) {
        mangaList.splice(index, 1);
        updateMangaList();
    }
}

function resetForm() {
    document.getElementById("mangaForm").reset();
}
