document.getElementById("fileInput").addEventListener("change", handleFiles);

function handleFiles(event) {
  const files = event.target.files;
  const output = document.getElementById("fileOutput");
  output.innerHTML = "";

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = function () {
      const content = reader.result;
      const numbers = extractNumbersFromVCF(content);

      const fileContainer = document.createElement("div");
      fileContainer.classList.add("file-container");

      const fileName = document.createElement("h3");
      fileName.textContent = `Nama File Asal: ${file.name}`;
      fileContainer.appendChild(fileName);

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.placeholder = "Masukkan nama file TXT baru (opsional)";
      fileContainer.appendChild(nameInput);

      const textArea = document.createElement("textarea");
      textArea.value = numbers.join("\n"); // Setiap nomor disusun kebawah (per baris)
      fileContainer.appendChild(textArea);

      const downloadButton = document.createElement("button");
      downloadButton.textContent = "Unduh TXT";
      downloadButton.addEventListener("click", () => {
        const fileNameTxt = nameInput.value.trim() || file.name.replace(/\.vcf$/, ".txt");
        downloadFile(fileNameTxt, textArea.value);
      });
      fileContainer.appendChild(downloadButton);

      output.appendChild(fileContainer);
    };
    reader.readAsText(file);
  });
}

function extractNumbersFromVCF(content) {
  const lines = content.split("\n");
  const numbers = [];

  lines.forEach((line) => {
    const match = line.match(/TEL[:;](.+)/); // Cari baris dengan nomor telepon
    if (match) {
      const number = match[1].trim(); // Pastikan nomor tetap utuh (dengan tanda + jika ada)
      numbers.push(number);
    }
  });

  return numbers; // Kembalikan semua nomor telepon dalam array
}

function downloadFile(fileName, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
