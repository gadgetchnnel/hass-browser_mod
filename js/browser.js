import { fireEvent } from "card-tools/src/event";

export const BrowserModBrowserMixin = (C) => class extends C {

    constructor() {
        super();
        document.addEventListener("visibilitychange", () => this.sensor_update());
        window.addEventListener("location-changed", () => this.sensor_update());

        window.setInterval(() => this.sensor_update(), 10000);
    }

    sensor_update() {
        window.queueMicrotask( async () => {
            const battery = navigator.getBattery ? await navigator.getBattery() : undefined;
            this.sendUpdate({browser: {
                path: window.location.pathname,
                visibility: document.visibilityState,
                userAgent: navigator.userAgent,
                currentUser: this._hass &&this._hass.user && this._hass.user.name,
                fullyKiosk: this.isFully,
                width: window.innerWidth,
                height: window.innerHeight,
                battery: this.isFully ? window.fully.getBatteryLevel() : battery ? battery.level*100 : undefined,
                charging: this.isFully ? window.fully.isPlugged() : battery ? battery.charging : undefined,
            }});
        });
    }

    do_navigate(path) {
        if (!path) return;
        history.pushState(null, "", path);
        fireEvent("location-changed", {}, document.querySelector("home-assistant"));
    }
}
