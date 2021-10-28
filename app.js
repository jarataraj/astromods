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

// ====== Mount Move ======
// ------ move backwards ------
// touch
document.querySelector('#move_backwards').addEventListener('touchstart', event => {
    event.preventDefault();
    let move = esp32.moveBackwards();
    window.addEventListener('touchend', event => {
        event.preventDefault();
        move.then(() => esp32.standStill());
    }, { once: true });
});
// mouse
document.querySelector('#move_backwards').addEventListener('mousedown', event => {
    let movement = esp32.moveBackwards();
    window.addEventListener('mouseup', event => {
        movement.then(() => esp32.standStill());
    }, { once: true });
});

/* If using global movement variable and the pattern below, double click will lock it into movement 
   and still throws "GATT operation already in progress" errors.
   If desired, could create a "movement queue" instead. Mouseup/touchend listener 
   would be global and would check:  if (movementQueue[last] = moveForwards or moveBackwards) {append standStill}
   */

// let movement = Promise.resolve();
// document.querySelector('#move_backwards').addEventListener('mousedown', event => {
//     movement.then(esp32.moveBackwards());
//     window.addEventListener('mouseup', event => {
//         movement.then(() => { movement = esp32.standStill() });
//     }, { once: true });
// });


// ------ move forwards ------
// touch
document.querySelector('#move_forwards').addEventListener('touchstart', event => {
    event.preventDefault();
    let move = esp32.moveForwards();
    window.addEventListener('touchend', event => {
        event.preventDefault();
        move.then(() => esp32.standStill());
    }, { once: true });
});
// mouse
document.querySelector('#move_forwards').addEventListener('mousedown', event => {
    let move = esp32.moveForwards();
    window.addEventListener('mouseup', event => {
        move.then(() => esp32.standStill());
    }, { once: true });
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


