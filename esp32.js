(function () {
    'use strict';

    const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const LED_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"

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