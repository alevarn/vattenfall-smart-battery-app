const powerGaugeElement = document.querySelector('.power-gauge');

const opts = {
    angle: -0.1,                    // The span of the gauge arc
    lineWidth: 0.05,                // The line thickness
    radiusScale: 1,                 // Relative radius
    pointer: {
        length: 0.48,               // Relative to gauge radius
        strokeWidth: 0.03,          // The thickness
        color: '#888'               // Fill color
    },
    limitMax: false,                // If false, max value increases automatically if value > maxValue
    limitMin: false,                // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',          // Colors
    colorStop: '#464646',           // just experiment with them
    strokeColor: '#E0E0E0',         // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true            // High resolution support
};

const gauge = new Gauge(powerGaugeElement).setOptions(opts);
gauge.maxValue = 100;               // set max gauge value
gauge.setMinValue(0);               // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 35;          // set animation speed (32 is default value)
gauge.set(0);                       // set actual value