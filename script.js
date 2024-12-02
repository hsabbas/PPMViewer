const uploadInput = document.getElementById("file_upload");
const canvasDiv = document.getElementById("canvas_div");
const canvas = document.getElementById("ppm_canvas");
const context = canvas.getContext("2d");
const width = 255;
const height = 255;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

if(context) {
    const imgData = context.createImageData(width, height);
    const data = imgData.data;
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let index = 4 * (x + y * imgData.width);
            data[index] = x;
            data[index + 1] = y;
            data[index + 2] = 0;
            data[index + 3] = 255;
        }
    }
    context.putImageData(imgData, 0, 0);
}