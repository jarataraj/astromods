document.querySelector('#connect').addEventListener('click', event => {
    esp32.connect()
        .then(() => {
            console.log(esp32.device);
            document.querySelector('#state').classList.add('connected');

        })
        .catch(error => {
            console.error('Argh!', error);
        });
});

document.querySelector('#disconnect').addEventListener('click', event => {
    esp32.disconnect();
    document.querySelector('#state').classList.remove('connected');
});


document.querySelector('#led').addEventListener('click', event => {
    esp32.changeLed()
});

document.querySelector('#theme').addEventListener('click', event => {
    document.body.classList.toggle('light-theme');
    theme = document.querySelector('#theme').innerHTML;
    if (theme == "Dark Mode") {
        document.querySelector('#theme').innerHTML = "Light Mode";
    }
    else {
        document.querySelector('#theme').innerHTML = "Dark Mode";
    }
})


