document.querySelector('#connect').addEventListener('click', event => {
    ESP32.connect()
        .then(() => {
            console.log(ESP32.device);
        })
        .catch(error => {
            console.error('Argh!', error);
        });
});
