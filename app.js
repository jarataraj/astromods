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

//------ Mount Move
document.querySelector('#move_backwards').addEventListener('mousedown', event => {
    esp32.moveBackwards();
});
document.querySelector('#move_backwards').addEventListener('mouseup', event => {
    esp32.standStill();
});
document.querySelector('#move_forwards').addEventListener('mousedown', event => {
    esp32.moveForwards();
    window.addEventListener('mouseup', event => {
        esp32.standStill();
    });
});

// moveForwardsButton2 = querySelector('#move_forwards_2')
// moveForwardsButton2.onmousedown event => {
//     esp32.moveForwards();
//     window.onmouseup = esp32.standStill();
// };



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


