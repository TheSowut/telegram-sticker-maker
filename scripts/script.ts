// const inputHandler = (event: any) => {
//     console.log(event);
// }

/**
 * Handles the drop event.
 * @param event
 * @returns
 */
const dropHandler = (event: any) => {
    event.preventDefault();

    const items = [...event.dataTransfer.items];
    if (items) {
        // Use DataTransferItemList to access
        items.map((item: any, i: number) => {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (!isFileImage(file)) return;
                console.log(`... file[${i}] = ${file.name}`);

                const reader = new FileReader();
                const img = new Image();

                reader.onload = (readerEvent: any) => {
                    img.onload = () => resize(img);
                    img.src = readerEvent.target.result;
                };
                reader.readAsDataURL(file);
            }

        });
        return;
    }

    // Use DataTransfer interface to access
    [...event.dataTransfer.files].map((file: any, i: number) => {
        console.log(`... file[${i}].name = ${file.name}`);
    });

};

/**
 * Prevents the default drag over event.
 * @param event
 * @returns
 */
const dragOverHandler = (event: any) => event.preventDefault();

/**
 * Return boolean whether a file is an image.
 * @param file - the file checked
 * @returns boolean
 */
const isFileImage = (file: any) => file.type.match(/image.*/);

/**
 * TODO
 * @param dataURI
 * @returns
 */
const dataURItoBlob = (dataURI: string) => {
    const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
        atob(dataURI.split(',')[1]) :
        unescape(dataURI.split(',')[1]);
    const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
};

/**
 * TODO
 * @param img
 * @returns
 */
const resize = (img: any) => {
    const canvas = document.createElement('canvas');
    const MAX_SIZE = 512;

    let width = img.width;
    let height = img.height;

    console.log({ width });
    console.log({ height });

    if (width > height) {
        if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
        }
    } else {
        if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
        }
    }

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
    let dataUrl = canvas.toDataURL('image/png');
    const image = document.querySelector('#output');
    // @ts-ignore
    image!.src = dataUrl;
    console.log(image);
    console.log(`${canvas.width}:${canvas.height}`);
    return dataURItoBlob(dataUrl);
}

window.addEventListener('load', async () => {
    const el: HTMLElement = document.querySelector('.drop_zone')!;

    el.addEventListener('dragover', () => el.classList.add('on-dragover'));
    el.addEventListener('dragleave', () => el.classList.remove('on-dragover'));
    el.addEventListener('drop', () =>  el.classList.remove('on-dragover'));
});
