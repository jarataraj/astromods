(function () {
    'use strict';

    const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const LED_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
    const MOVE_MOUNT = "b5489b57-fd0c-4889-a942-861f39906a45";
    const RESET_UUID = "27e5eb71-4b57-4a18-873c-aa272f770ca7";
    const TRACKING_UUID = "1043dbcc-f3a0-4fa7-b77c-d7598a3868b4";
    const TUNE_START_UUID = "e15d4ed0-d255-465c-a6af-33ce7b7ecd69";
    const TUNE_END_UUID = "e36a814d-017e-4d96-99a1-3fd3d86fa194";

    class Esp32 {
        constructor() {
            this.device = null;
            this.tracking = null;
            this.characteristics = new Map();
        }
        // ------ Connection ------
        request() {
            let options = {
                filters: [
                    { services: [SERVICE_UUID] }
                ]
            };
            return navigator.bluetooth.requestDevice(options)
                .then(device => {
                    this.device = device;
                    //Check for device found
                    if (!this.device) {
                        return Promise.reject('Device not available.');
                    }
                    //Listen for disconnect
                    this.device.addEventListener('gattserverdisconnected', onDisconnected);
                })
        }
        connect() {
            let options = {
                filters: [
                    { services: [SERVICE_UUID] }
                ]
            };
            return navigator.bluetooth.requestDevice(options)
                .then(device => {
                    this.device = device;
                    //Check for device found
                    if (!this.device) {
                        return Promise.reject('Device not available.');
                    }
                    //listen for disconnect
                    this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
                    //add loading elements
                    document.querySelector('#loader').style.display = 'block';
                    document.querySelector('#connect').innerHTML = 'Connecting';
                    //TODO attempt to connect multiple times if failed first attempts
                    return this.device.gatt.connect()
                        .then(server => {
                            this.server = server;
                            //can remove promise.all
                            return Promise.all([
                                server.getPrimaryService(SERVICE_UUID).then(service => {
                                    return Promise.all([
                                        this.cacheCharacteristic(service, LED_UUID),
                                        this.cacheCharacteristic(service, MOVE_MOUNT),
                                        this.cacheCharacteristic(service, RESET_UUID),
                                        this.cacheCharacteristic(service, TRACKING_UUID),
                                        this.cacheCharacteristic(service, TUNE_START_UUID),
                                        this.cacheCharacteristic(service, TUNE_END_UUID)
                                    ])
                                }),
                            ]);
                        }, () => {
                            console.log('Error connecting. Try again')
                        })
                        .then(() => {
                            return this.getTracking();
                        })
                        .then((data) => {
                            this.tracking = data.getUint8(0) - 48;
                            console.log("tracking recorded as " + this.tracking)
                            if (this.tracking == 1) {
                                document.querySelector('#trackingStellar').checked = true;
                            } else if (this.tracking == 2) {
                                document.querySelector('#trackingLunar').checked = true;
                            } else {
                                document.querySelector('#trackingOff').checked = true;
                            }
                        })
                        .then(() => {
                            // document.querySelector('disconnected-page').style.display = 'none';
                            // document.querySelector('home-page').syle.display = 'inherit';
                            changePage('#disconnected-page', '#home-page');
                        })
                        .finally(() => {
                            //remove loading elements 
                            document.querySelector('#loader').style.display = 'none';
                            document.querySelector('#connect').innerHTML = 'Connect';
                        })
                })


            // if (!this.device) {
            //     return Promise.reject('Device not available.');
            // }
            // //TODO attempt to connect multiple times if failed first attempts
            // return this.device.gatt.connect()
            //     .then(server => {
            //         this.server = server;
            //         return Promise.all([
            //             server.getPrimaryService(SERVICE_UUID).then(service => {
            //                 return Promise.all([
            //                     this._cacheCharacteristic(service, LED_UUID),
            //                     this._cacheCharacteristic(service, MOVE_MOUNT),
            //                 ])
            //             }),
            //         ]);
            //     })
        }

        connect2() {
            let options = {
                filters: [
                    { services: [SERVICE_UUID] }
                ]
            };
            //Start loader
            document.querySelector('#loader').style.display = 'block';
            document.querySelector('#connect').innerHTML = 'connecting';
            //TODO attempt to connect multiple times if failed first attempts
            return this.device.gatt.connect()
                .then(server => {
                    this.server = server;
                    return Promise.all([
                        server.getPrimaryService(SERVICE_UUID).then(service => {
                            return Promise.all([
                                this.cacheCharacteristic(service, LED_UUID),
                                this.cacheCharacteristic(service, MOVE_MOUNT),
                                this.cacheCharacteristic(service, RESET_UUID),
                                this.cacheCharacteristic(service, TRACKING_MOUNT),
                                this.cacheCharacteristic(service, TUNE_START_UUID),
                                this.cacheCharacteristic(service, TUNE_END_MOUNT)
                            ])
                        }),
                    ]);
                })
        }

        onDisconnected() {
            console.log('disconnected');
            document.querySelector('#disconnected-label').style.visibility = 'visible';
            // document.querySelector('#state').classList.remove('connected');
            document.querySelector('#disconnected-page').style.display = 'inherit';
            document.querySelector('#home-page').style.display = 'none';
            document.querySelector('#advanced-page').style.display = 'none';
            document.querySelector('#tuning-page').style.display = 'none';
            document.querySelector('#tuning-info-page').style.display = 'none';
            document.querySelector('#align-page').style.display = 'none';
            document.querySelector('#align-info-page').style.display = 'none';
            setTimeout(() => {
                document.querySelector('#disconnected-label').style.visibility = 'hidden';
            }, 2000);
        }

        disconnect() {
            return this.device.gatt.disconnect();
        }

        //------ Controls ------
        moveBackwards() {
            // let characteristic = this.characteristics.get(MOVE_MOUNT);
            // return characteristic.writeValue(new Int8Array([-1]));
            return this.writeCharacteristicValue(MOVE_MOUNT, new Int8Array([-1]))
        }
        moveForwards() {
            return this.writeCharacteristicValue(MOVE_MOUNT, new Int8Array([1]))
        }
        standStill() {
            return this.writeCharacteristicValue(MOVE_MOUNT, new Int8Array([0]))
        }
        changeLed() {
            return this.writeCharacteristicValue(LED_UUID, new Int8Array([0]))
        }
        getTracking() {
            return this.readCharacteristicValue(TRACKING_UUID);
        }
        setTracking(tracking) {
            return this.writeCharacteristicValue(TRACKING_UUID, new Int8Array([tracking]))
        }
        reset() {
            console.log("writing reset");
            return this.writeCharacteristicValue(RESET_UUID, new Int8Array([0]))
        }
        tuneStart() {
            return this.writeCharacteristicValue(TUNE_START_UUID, new Int8Array([0]))
        }
        tuneEnd() {
            return this.writeCharacteristicValue(TUNE_END_UUID, new Int8Array([0]))
        }

        // ------ Utils ------

        cacheCharacteristic(service, characteristicUuid) {
            return service.getCharacteristic(characteristicUuid)
                .then(characteristic => {
                    this.characteristics.set(characteristicUuid, characteristic)
                })
        }
        writeCharacteristicValue(characteristicUuid, value) {
            let characteristic = this.characteristics.get(characteristicUuid);
            return characteristic.writeValue(value);
        }
        readCharacteristicValue(characteristicUuid) {
            let characteristic = this.characteristics.get(characteristicUuid);
            return characteristic.readValue();
        }
    }

    window.esp32 = new Esp32();
})();