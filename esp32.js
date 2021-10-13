(function () {
    'use strict';

    const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";

    class ESP32 {
        constructor() {
            this.device = null
        }
        connect() {
            let options = {
                filters: [
                    { services: [SERVICE_UUID] }
                ]
            };
            return navigator.bluetooth.requestDevice(options)
                .then(function (device) {
                    this.device = device;
                }.bind(this));
        }
    }

    window.esp32 = new ESP32();
})();