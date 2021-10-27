(function () {
    'use strict';

    const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const LED_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
    const MOVE_MOUNT = "b5489b57-fd0c-4889-a942-861f39906a45";

    class Esp32 {
        constructor() {
            this.device = null;
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
                    return device.gatt.connect();
                });
        }

        moveBackwards() {
            return this.device.gatt.getPrimaryService(SERVICE_UUID)
                .then(service => service.getCharacteristic(MOVE_MOUNT))
                .then(characteristic => characteristic.writeValue(new Int8Array([-1])))
        }
        moveForwards() {
            return this.device.gatt.getPrimaryService(SERVICE_UUID)
                .then(service => service.getCharacteristic(MOVE_MOUNT))
                .then(characteristic => characteristic.writeValue(new Int8Array([1])))
        }
        standStill() {
            return this.device.gatt.getPrimaryService(SERVICE_UUID)
                .then(service => service.getCharacteristic(MOVE_MOUNT))
                .then(characteristic => characteristic.writeValue(new Int8Array([0])))
        }

        disconnect() {
            return this.device.gatt.disconnect();
        }

        changeLed() {
            return this.device.gatt.getPrimaryService(SERVICE_UUID)
                .then(service => service.getCharacteristic(LED_UUID))
                .then(characteristic => characteristic.writeValue(new Uint8Array([0])))
        }
    }

    window.esp32 = new Esp32();
})();