const ServerInfo = Object.freeze({
    URL: 'http://localhost:3000/seven_days'
});

class Fetcher {
    constructor(data) {
        this.data = data;
        this.currentIndex = 0;
    }

    static async retrieveAllData() {
        const res = await fetch(ServerInfo.URL);
        const data = await res.json();
        return new Fetcher(data);
    }

    hasNext() {
        return this.currentIndex < this.data.length;
    }

    getNext() {
        const entry = this.data[this.currentIndex++];

        return {
            interval: entry['Interval'],
            stateOfCharge: entry['DESM-Master-PLC-bd/AvgValue'].avg,
            power: entry['DESM-MasterController-Bergsöe1-bb/AvgValue'].avg
        };
    }
}