document.querySelector('#connect').addEventListener('click', event => {
    esp32.connect()
        .then(() => {
            console.log(Esp32.device);
        })
        .catch(error => {
            console.error('Argh!', error);
        });
});

document.querySelector('#led').addEventListener('click', event => {
    esp32.changeLED()
});
