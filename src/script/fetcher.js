const ServerInfo = Object.freeze({
    URL: 'http://localhost:3000/seven_days'
});

class Fetcher {
    constructor() {
        this.time = moment('2021-01-19 21:00');
    }

    async getNext() {
        const response = await fetch(`${ServerInfo.URL}?interval=${this.time.format('YYYY-MM-DD%20HH:mm')}`);
        const data = await response.json();

        this.time.add(15, 'm');

        return {
            received: data !== null,
            data: {
                interval: data['Interval'],
                stateOfCharge: data['DESM-Master-PLC-bd/AvgValue'].avg,
                power: data['DESM-MasterController-Bergsöe1-bb/AvgValue'].avg
            }
        };
    }
}