/**
 * A class that is responsible for fetching data from the server.
 */
class Fetcher {
    constructor() {
        // The start time for the dataset that we received from Vattenfall.
        this.time = moment('2021-01-19 21:00');
    }

    async getNext() {
        // Request data that was collected at a specific time by entering the time in the query string.
        const url = `http://localhost:3000/seven_days?interval=${this.time.format('YYYY-MM-DD%20HH:mm')}`;
        const response = await fetch(url);
        const data = await response.json();

        // Add 15 minutes to the time so when this function gets called the next time we don't receive the same data.
        this.time.add(15, 'm');

        return {
            received: data !== null,    // A boolean that indicates whether we have received data or not.
            data: {
                interval: data['Interval'],
                stateOfCharge: data['DESM-Master-PLC-bd/AvgValue'].avg,
                power: data['DESM-MasterController-Bergsöe1-bb/AvgValue'].avg
            }
        };
    }
}