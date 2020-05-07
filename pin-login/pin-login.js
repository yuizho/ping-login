class PinLogin {
    constructor({
        el,
        loginEndpoint,
        redirectTo,
        // ! JavaScript's Number fllows IEEE754. so we cant use Infinity.
        maxNumbers = Infinity
    }) {
        this.el = {
            main: el,
            numpad: el.querySelector(".pin-login__numpad"),
            textDisplay: el.querySelector(".pin-login__text")
        };

        this.loginEndpoint = loginEndpoint;
        this.redirectTo = redirectTo;
        this.maxNumbers = maxNumbers;
        // this field store the values that are entered by user
        this.value = "";

        this._generatePad();
    }

    _generatePad() {
        const padLayout = [
            "1", "2", "3",
            "4", "5", "6",
            "7", "8", "9",
            "backspace", "0", "done"
        ];

        padLayout.forEach(key => {
            const insertBreak = key.search(/3|6|9/) !== -1;
            const keyEl = document.createElement("div");

            keyEl.classList.add("pin-login__key");
            keyEl.classList.toggle("material-icons", isNaN(key));
            keyEl.textContent = key;
            keyEl.addEventListener("click", () => {
                this._handleKeyPress(key)
            });
            this.el.numpad.appendChild(keyEl);

            if (insertBreak) {
                this.el.numpad.appendChild(document.createElement("br"));
            }
        });
    }

    _handleKeyPress(key) {
        switch (key) {
            case "backspace":
                this.value = this.value.substring(0, this.value.length - 1);
                break;
            case "done":
                this._attemptLogin();
                break;
            default:
                if (this.value.length < this.maxNumbers && !isNaN(key)) {
                    this.value += key;
                }
                break;
        }

        this._updateValueText();
    }

    _updateValueText() {
        console.log(this.value);
        // prevent to show password value from console.log on a developper tool.
        this.el.textDisplay.value = "_".repeat(this.value.length);
        this.el.textDisplay.classList.remove("pin-login__text--error");
    }

    _attemptLogin() {
        if (this.value.length > 0) {
            fetch(this.loginEndpoint, {
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `pincode=${this.value}`
            }).then(response => {
                console.log(response.status);
                if (response.status === 200) {
                    window.location.href = this.redirectTo;
                } else {
                    this.el.textDisplay.classList.add("pin-login__text--error")
                }
            })
        }
    }
}