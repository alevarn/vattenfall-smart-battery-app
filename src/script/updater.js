const UPDATE_FREQUENCY_MS = 1000;

const socValueElement = document.querySelector('.soc-value');
const batteryFigureSocElement = document.querySelector('.battery-figure-soc');
const statusTextElement = document.querySelector('.status-text');
const statusValueElement = document.querySelector('.status-value');
const powerRowElement = document.querySelector('.power-row');
const timeRowElement = document.querySelector('.time-row');
const powerTitleElement = powerRowElement.querySelector('.row-title');
const timeTitleElement = timeRowElement.querySelector('.row-title');
const powerValueElement = document.querySelector('.power-value');
const timeTextElement = document.querySelector('.time-text');
const timeDescriptionElement = document.querySelector('.time-description');

function updateDashboard(battery) {
    socValueElement.textContent = battery.stateOfCharge.toFixed(0);
    
    batteryFigureSocElement.style.height = `${battery.stateOfCharge.toFixed(0)}%`;
    if(battery.stateOfCharge < 20) {
        batteryFigureSocElement.style.backgroundColor = '#c00d0df2';
    } else {
        batteryFigureSocElement.style.backgroundColor = '#0dc00df2';
    }

    statusValueElement.textContent = battery.status;

    switch (battery.status) {
        case BatteryStatus.CHARGING:
            statusValueElement.className = 'status-value green';
            powerRowElement.classList.remove('disable');
            timeRowElement.classList.remove('disable');

            powerTitleElement.innerHTML = '<span class="green">CHARGING</span> POWER';
            timeTitleElement.innerHTML = '<span class="green">CHARGING</span> TIME';

            const secondsUntilFull = battery.getSecondsUntilFullyCharged();
            if (secondsUntilFull <= 3600 * 24 * 3) {
                timeTextElement.innerHTML = `~<span class="time-value">${Math.trunc(secondsUntilFull / 3600)}</span><span class="time-unit">h</span><span class="time-value">${Math.trunc(secondsUntilFull / 60) % 60}</span><span class="time-unit">min</span>`;
            } else {
                timeTextElement.innerHTML = 'several days';
            }
            timeDescriptionElement.innerHTML = 'until fully <span class="green">charged</span>';
            break;
        case BatteryStatus.DISCHARGING:
            statusValueElement.className = 'status-value red';
            powerRowElement.classList.remove('disable');
            timeRowElement.classList.remove('disable');

            powerTitleElement.innerHTML = '<span class="red">DISCHARGING</span> POWER';
            timeTitleElement.innerHTML = '<span class="red">DISCHARGING</span> TIME';

            const secondsUntilEmpty = battery.getSecondsUntilEmpty();
            if (secondsUntilEmpty <= 3600 * 24 * 3) {
                timeTextElement.innerHTML = `~<span class="time-value">${Math.trunc(secondsUntilEmpty / 3600)}</span><span class="time-unit">h</span><span class="time-value">${Math.trunc(secondsUntilEmpty / 60) % 60}</span><span class="time-unit">min</span>`;
            } else {
                timeTextElement.innerHTML = 'several days';
            }
            timeDescriptionElement.innerHTML = 'until fully <span class="red">discharged</span>';
            break;
        case BatteryStatus.IDLE:
            statusValueElement.className = 'status-value yellow';
            powerRowElement.classList.add('disable');
            timeRowElement.classList.add('disable');
            break;
    }

    gauge.set(Number(battery.getPowerAsPercentage().toFixed(0)));
    powerValueElement.textContent = battery.getPowerAsPercentage().toFixed(0);

    socGraph.data.datasets[0].data = battery.socLast3Days;
    powerGraph.data.datasets[0].data = battery.powerLast3Days;
    socGraph.update();
    powerGraph.update();
}

async function simulateRealTimeSystem() {
    const battery = new Battery();
    const fetcher = await Fetcher.retrieveAllData();

    const interval = setInterval(() => {
        if (fetcher.hasNext()) {
            let { interval, stateOfCharge, power } = fetcher.getNext();

            if (stateOfCharge == '') stateOfCharge = battery.stateOfCharge;
            if (power == '') power = battery.power;

            battery.update(interval, Number(stateOfCharge), Number(power));
            updateDashboard(battery);
        } else {
            clearInterval(interval);
        }
    }, UPDATE_FREQUENCY_MS);
}

window.addEventListener('load', () => simulateRealTimeSystem());