document.querySelector('#connect').addEventListener('click', event => {
    playbulbCandle.connect()
        .then(() => {
            console.log(playbulbCandle.device);
        })
        .catch(error => {
            console.error('Argh!', error);
        });
});
