const uploadInput = document.getElementById("file_upload");
const canvasDiv = document.getElementById("canvas_div");
const canvas = document.getElementById("ppm_canvas");
const error = document.getElementById("error");
const context = canvas.getContext("2d");
let width = 255;
let height = 255;

uploadInput.addEventListener("change", () => {
    const file = uploadInput.files[0];
    if (!file) {
        error.innerText = "Failed to read file";
        clearCanvas();
        return;
    }

    if (!file.name.endsWith(".ppm")) {
        error.innerText = "Not a .ppm file";
        clearCanvas();
        return;
    }

    error.innerText = "";
    parseFile(file);
    drawCanvas();
})

function parseFile(file) {
    const reader = new FileReader();
    reader.onload = function () {
        const content = reader.result.trim();
        let current = "";
        let parsedWords = 0;
        for (let i = 0; i < content.length; i++) {
            while (i < content.length &&
                (content[i] !== ' ' && content[i] !== '\n' && content[i] !== '#' && content[i] !== '\r')) {
                current += content[i];
                i++;
            }
            if (i < content.length && content[i] === '#') {
                while (i < content.length && content[i] !== '\n') {
                    i++;
                }
            }

            if (current.length > 0) {
                switch (parsedWords) {
                    case 0:                        
                        if (current != "P3") {
                            error.innerText = "PPM file format is invalid";
                            return;
                        }
                        break;
                    case 1:
                        width = parseInt(current);
                        if (isNaN(width)) {
                            error.innerText = "Failed to parse width";
                            return;
                        }
                        break;
                    case 2:
                        height = parseInt(current);
                        if (isNaN(height)) {
                            error.innerText = "Failed to parse height";
                            return;
                        }
                        break;
                    case 3:
                        if (current != "255") {
                            error.innerText = "Max color value must be 255";
                            return;
                        }
                        break;
                    default:
                    //pixel input

                }
                parsedWords++;
                current = "";
            }
        }
    }
    reader.readAsText(file);
}

function drawCanvas() {
    const width = 255;
    const height = 255;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    if (context) {
        const imgData = context.createImageData(width, height);
        const data = imgData.data;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let index = 4 * (x + y * imgData.width);
                data[index] = x;
                data[index + 1] = y;
                data[index + 2] = 0;
                data[index + 3] = 255;
            }
        }
        context.putImageData(imgData, 0, 0);
    }
}

function clearCanvas() {
    context.putImageData(context.createImageData(width, height), 0, 0);
}