let center_regul = false;

function getPercents(current, maximum, minumum) {
    let hundred = maximum - minumum;
    let value = current - minumum;
    let final = value / hundred;
    if (!isFinite(final))
        return 0
    return Number(value / hundred).toFixed(3);
}

class AxisFilter {
    constructor() {
        this._current = 0;
        this._center_max = -1;
        this._center_min = 1;
        this._maximum = -1;
        this._minumum = 1;
    }

    set current(value) {
        value = Number(value).toFixed(3)
        this._current = value;

        if (center_regul) {
            this._center_max = Math.max(value, this._center_max);
            this._center_min = Math.min(value, this._center_min);
        }
        
        this._maximum = Math.max(value, this._maximum);
        
        this._minumum = Math.min(value, this._minumum);
    }

    get current() {
        if (this._current >= this._center_min && this._current <= this._center_max) {
            return 0.5;
        }
        return getPercents(this._current, this._maximum, this._minumum);
    }

    get maximum() {
        return this._maximum;
    }

    get minumum() {
        return this._minumum;
    }

    get center() {
        return this._center_min + " - " + this._center_max
    }

    get str() {
        return `(Min: ${this.minumum} | Center: ${this.center} | Max: ${this.maximum})`
    }
}

let filtres = [
    new AxisFilter(), new AxisFilter(), new AxisFilter(), new AxisFilter(), new AxisFilter()
]

window.addEventListener('keydown', (event) => {
    if (event.key === "g") {
        center_regul = !center_regul;
    }
}, false);

window.addEventListener('gamepadconnected', (event) => {
    const update = () => {
        const outputAxes = document.getElementById('axes');
        outputAxes.innerHTML = '';

        const outputVB = document.getElementById('vb');
        outputVB.innerHTML = '';

        for (const gamepad of navigator.getGamepads()) {
            if (!gamepad) continue;
            if (gamepad.buttons.length > 0) {
                let button = gamepad.buttons[0];
                outputVB.insertAdjacentHTML('beforeend',
                    `<label>VBA: <progress value=${button.value}></progress> ${button.value}</label>`
                );
            }

            let axes = gamepad.axes;
            if (axes.length === 6) {
                let vbr = axes[3];
                filtres[4].current = vbr;
                outputVB.insertAdjacentHTML('beforeend',
                    `<label>VBR: <progress value=${filtres[4].current}></progress> ${filtres[4]._current} : ${filtres[4].current} ${filtres[4].str}</label>`
                );
                
                let channels = [
                    axes[0], axes[1], axes[2], axes[4]
                ]
                for (const [index, axis] of channels.entries()) {
                    filtres[index].current = axis;
                    outputAxes.insertAdjacentHTML('beforeend',
                        `<label>Axis ${index + 1} <progress value=${filtres[index].current}></progress> ${filtres[index]._current} : ${filtres[index].current} ${filtres[index].str}</label>`
                    );
                }
            }
        }
        requestAnimationFrame(update);
    };
    update();
});