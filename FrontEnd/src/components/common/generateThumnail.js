// generateThumnail.js

import * as pdfjsLib from 'pdfjs-dist/webpack'; // Webpack 설정을 사용

// PDF.js 워커 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js";

function generateThumbnail(pdfFile) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    return new Promise((resolve, reject) => {
        pdfjsLib.getDocument(URL.createObjectURL(pdfFile)).promise.then((pdf) => {
            pdf.getPage(1).then((page) => {
                const viewport = page.getViewport({ scale: 1 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                page.render({
                    canvasContext: context,
                    viewport: viewport,
                }).promise.then(() => {
                    const thumbnailUrl = canvas.toDataURL();
                    resolve(thumbnailUrl); // 썸네일 URL을 반환
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    });
}

export default generateThumbnail;
