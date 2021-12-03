
// ====== Connections ======
//Connect
document.querySelector('#connect').addEventListener('click', event => {
    //new
    // esp32.request()
    //     .then(() => {
    //         //Add loading elements
    //         document.querySelector('#loader').style.display = 'block';
    //         document.querySelector('#connect').innerHTML = 'Connecting';
    //         // Connect
    //         esp32.connect()
    //     }).then(() => {
    //         //Remove loading elements 
    //         document.querySelector('#loader').style.display = 'none';
    //         document.querySelector('#connect').innerHTML = 'Connect';
    //     })


    // old
    esp32.connect()
        .then(() => {
            console.log(esp32.device);
            // document.querySelector('#state').classList.add('connected');
            // changePage('#disconnected-page', '#home-page');
        })
        .catch(error => {
            console.error('Argh!', error);
        });
});

//Disconnect
document.querySelector('#disconnect').addEventListener('click', event => {
    esp32.disconnect();
    // changePage('home-page', 'disconnected-page')
    // document.querySelector('#state').classList.remove('connected');
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
// ------ set tune start and end ------
// tuneStart

// tuneEnd

// ====== set tracking ======
const trackingButtons = document.querySelectorAll("#tracking-controls > input");
for (const button of trackingButtons) {
    button.addEventListener('click', event => {
        console.log("detected tracking change to " + button.value)
        esp32.setTracking(button.value);
    })
};

// ====== Reset =======
document.querySelector('#reset').addEventListener('click', event => {
    console.log("detected reset");
    esp32.reset();
});

// ------ Center ------
//TODO

// ====== Navigation buttons ======
document.querySelector('#advanced').addEventListener('click', event => {
    changePage('#home-page', '#advanced-page');
});
document.querySelector('#advanced-back').addEventListener('click', event => {
    changePage('#advanced-page', '#home-page');
});
document.querySelector('#tuning').addEventListener('click', event => {
    changePage('#advanced-page', '#tuning-page');
});
document.querySelector('#tuning-back').addEventListener('click', event => {
    changePage('#tuning-page', '#advanced-page');
});
document.querySelector('#tuning-info').addEventListener('click', event => {
    changePage('#tuning-page', '#tuning-info-page');
});
document.querySelector('#tuning-info-back').addEventListener('click', event => {
    changePage('#tuning-info-page', '#tuning-page');
});
document.querySelector('#align').addEventListener('click', event => {
    changePage('#advanced-page', '#align-page');
});
document.querySelector('#align-back').addEventListener('click', event => {
    changePage('#align-page', '#advanced-page');
});
document.querySelector('#align-info').addEventListener('click', event => {
    changePage('#align-page', '#align-info-page');
});
document.querySelector('#align-info-back').addEventListener('click', event => {
    changePage('#align-info-page', '#align-page');
});


//LED
document.querySelector('#led').addEventListener('click', event => {
    esp32.changeLed()
});

//Light/Dark Mode

let themeButtons = document.querySelectorAll('.theme');
themeButtons.forEach(button => {
    button.addEventListener('click', event => {
        document.body.classList.toggle('light-theme');
        console.log('registered theme click')
        theme = document.querySelector('#theme').innerHTML;
        if (theme == "Dark Mode") {
            document.querySelector('#theme').innerHTML = "Light Mode";
            document.querySelector('#theme--brief').innerHTML = "Light";
        }
        else {
            document.querySelector('#theme').innerHTML = "Dark Mode";
            document.querySelector('#theme--brief').innerHTML = "Dark";
        }
    })
})


function changePage(from, to) {
    document.querySelector(from).style.display = 'none';
    document.querySelector(to).style.display = 'inherit';
}

