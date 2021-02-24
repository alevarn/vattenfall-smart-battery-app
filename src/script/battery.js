const THREE_DAYS_IN_MS = 1000 * 3600 * 24 * 3;
const KILO = 1000;

const BatteryInfo = Object.freeze({
    MAX_POWER: 500000,
    CAPACITY: 3600000000
});

const BatteryStatus = Object.freeze({
    IDLE: 'IDLE',
    CHARGING: 'CHARGING',
    DISCHARGING: 'DISCHARGING'
});

class Battery {
    constructor() {
        this.stateOfCharge = 0;
        this.status = BatteryStatus.IDLE;
        this.power = 0;
        this.socLast3Days = [];
        this.powerLast3Days = [];
    }

    updateStatus(power) {
        if (power > 0)
            this.status = BatteryStatus.CHARGING;
        else if (power < 0)
            this.status = BatteryStatus.DISCHARGING;
        else
            this.status = BatteryStatus.IDLE;
    }

    validateTimeInterval(array, ms) {
        const first = new Date(array[0].x);
        const last = new Date(array[array.length - 1].x);

        if (last - first > ms)
            array.shift();
    }

    update(interval, stateOfCharge, power) {
        if (stateOfCharge < 0 || stateOfCharge > 100)
            throw `State of charge should be between 0 and 100, not equal to ${stateOfCharge}`;
        if (power < -BatteryInfo.MAX_POWER || power > BatteryInfo.MAX_POWER)
            throw `Power should be between ${-BatteryInfo.MAX_POWER} and ${BatteryInfo.MAX_POWER}, not equal to ${power}`;

        this.stateOfCharge = stateOfCharge;
        this.updateStatus(power);
        this.power = power;
        this.socLast3Days.push({ x: interval, y: stateOfCharge });
        this.powerLast3Days.push({ x: interval, y: power / KILO });
        this.validateTimeInterval(this.socLast3Days, THREE_DAYS_IN_MS);
        this.validateTimeInterval(this.powerLast3Days, THREE_DAYS_IN_MS);
    }

    getPowerAsPercentage() {
        switch (this.status) {
            case BatteryStatus.CHARGING:
                return 100 * (this.power / BatteryInfo.MAX_POWER);
            case BatteryStatus.DISCHARGING:
                return 100 * ((-this.power) / BatteryInfo.MAX_POWER);
            case BatteryStatus.IDLE:
                return 0;
        }
    }

    getSecondsUntilFullyCharged() {
        if (this.status != BatteryStatus.CHARGING)
            throw 'The battery is not charging cannot approximate time until fully charged';
        return ((1 - (this.stateOfCharge / 100)) * BatteryInfo.CAPACITY) / this.power;
    }

    getSecondsUntilEmpty() {
        if (this.status != BatteryStatus.DISCHARGING)
            throw 'The battery is not discharging cannot approximate time until empty';
        return ((this.stateOfCharge / 100) * BatteryInfo.CAPACITY) / (-this.power);
    }
}