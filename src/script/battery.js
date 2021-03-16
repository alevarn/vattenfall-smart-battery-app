// This file contains data and algorithms that are related to the battery that should be visualized in the visualization system.

/**
 * Information about the battery that the visualization system should visualize.
 * The current values are from the battery at Boliden Bergsöe,
 * with a max power of 500kW which is equal to 500000W,
 * and a capacity of 1MWh which is equal to 3600000000J.
 */
const BatteryInfo = Object.freeze({
    MAX_POWER: 500000,      // Unit: W (Watt)
    CAPACITY: 3600000000    // Unit: J (Joule)
});

/**
 * The battery can be in three different states depending on the charging/discharging power of the battery.
 */
const BatteryStatus = Object.freeze({
    IDLE: 'IDLE',                   // The battery is doing nothing.
    CHARGING: 'CHARGING',           // The battery is charging.
    DISCHARGING: 'DISCHARGING'      // The battery is discharging.
});

/**
 * A class that represents the battery and stores data about the battery.
 */
class Battery {
    constructor() {
        this.stateOfCharge = 0;
        this.status = BatteryStatus.IDLE;
        this.power = 0;

        // These two arrays store the data points that are to be included in the graphs.
        this.socLast3Days = [];
        this.powerLast3Days = [];
    }


    /**
     * Update the status of the battery.
     */
    updateStatus(power) {
        if (power > 0)
            this.status = BatteryStatus.CHARGING;
        else if (power < 0)
            this.status = BatteryStatus.DISCHARGING;
        else
            this.status = BatteryStatus.IDLE;
    }

    /**
     * Validate the time interval for the array.
     * Data points that are older than 3 days (72 hours) 
     * will be removed from the array.
     */
    validateTimeInterval(array) {
        const first = new Date(array[0].x);
        const last = new Date(array[array.length - 1].x);

        if (last - first > 1000 * 3600 * 24 * 3)
            array.shift();
    }

    /**
     * Update the battery with new data.
     */
    update(interval, stateOfCharge, power) {
        // Ensure that these values are valid.
        if (stateOfCharge < 0 || stateOfCharge > 100)
            throw `State of charge should be between 0 and 100, not equal to ${stateOfCharge}`;
        if (power < -BatteryInfo.MAX_POWER || power > BatteryInfo.MAX_POWER)
            throw `Power should be between ${-BatteryInfo.MAX_POWER} and ${BatteryInfo.MAX_POWER}, not equal to ${power}`;

        this.stateOfCharge = stateOfCharge;
        this.updateStatus(power);
        this.power = power;
        this.socLast3Days.push({ x: interval, y: stateOfCharge });
        this.powerLast3Days.push({ x: interval, y: power / 1000 });
        this.validateTimeInterval(this.socLast3Days);
        this.validateTimeInterval(this.powerLast3Days);
    }

    /**
     * Returns the current charging/discharging power as a percentage by dividing 
     * the current charging/discharging power with the maximum power of the battery. 
     */
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

    /**
     * Returns the number of seconds until the battery is fully charged.
     */
    getSecondsUntilFullyCharged() {
        if (this.status != BatteryStatus.CHARGING)
            throw 'The battery is not charging cannot approximate time until fully charged';
        return ((1 - (this.stateOfCharge / 100)) * BatteryInfo.CAPACITY) / this.power;
    }

    /**
     * Returns the number of seconds until the battery is fully discharged.
     */
    getSecondsUntilEmpty() {
        if (this.status != BatteryStatus.DISCHARGING)
            throw 'The battery is not discharging cannot approximate time until empty';
        return ((this.stateOfCharge / 100) * BatteryInfo.CAPACITY) / (-this.power);
    }
}