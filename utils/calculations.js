export const predictedDistance = (selectedDistance, temperature, pressure) => {
  const predictedDistance = (selectedDistance, temperature) => {
    console.log("Starting predictedDistance calculation...");
    console.log("Selected Distance:", selectedDistance);
    console.log("Temperature (Fahrenheit):", temperature);
  
    // Convert Fahrenheit to Kelvin
    const fahrenheitToKelvin = (fahrenheit) => ((fahrenheit - 32) * 5) / 9 + 273.15;
    temperature = fahrenheitToKelvin(temperature);
    console.log("Temperature (Kelvin):", temperature);
  
    // Constants
    const g = 9.81; // Gravity (m/s^2)
    const mass = 0.04593; // Golf ball mass (kg)
    const radius = 0.02135; // Golf ball radius (m)
    const A = Math.PI * radius ** 2; // Cross-sectional area (m^2)
    const R = 287.05; // Gas constant for air (J/kg*K)
    const v0 = 75.25; // Initial speed (m/s)
    const theta = (10.37 * Math.PI) / 180; // Launch angle in radians
    const omega = 2514.6; // Spin rate in rad/s
    const P = 101325; // Air pressure in Pascals (1 atm)
    const humidity = 50; // % Relative humidity
  
    // Air Density Calculation
    function getAirDensity(temperature, pressure, humidity) {
      const R_dry = 287.05;
      const R_vapor = 461.5;
      const p_vapor =
        (humidity / 100) *
        6.1078 *
        Math.exp((17.27 * (temperature - 273.15)) / (temperature - 35.85)) *
        100;
      const p_dry = pressure - p_vapor;
      return p_dry / (R_dry * temperature) + p_vapor / (R_vapor * temperature);
    }
  
    function getDragCoefficient(v) {
      if (v < 40) return 0.35;
      if (v < 70) return 0.29;
      if (v < 100) return 0.25;
      return 0.22;
    }
  
    function getLiftCoefficient(omega, v) {
      const S = (omega * radius) / v;
      return Math.min(0.12 + 1.9 * S, 1.2); // Prevent extreme values
    }
  
    let vx = v0 * Math.cos(theta);
    let vy = v0 * Math.sin(theta);
    let x = 0;
    let y = 0; // Start at ground level
    let rho = getAirDensity(temperature, P, humidity);
    console.log("Air Density:", rho);
  
    const dt = 0.005; // Smaller time step for accuracy
    let previousY = y;
    let maxIterations = 100000; // Prevent infinite loops
    let iteration = 0;
  
    // Simulation loop
    while (y >= 0 && iteration < maxIterations) {
      const v = Math.sqrt(vx ** 2 + vy ** 2);
      const Cd = getDragCoefficient(v);
      const Cl = getLiftCoefficient(omega, v);
      const Fd = 0.5 * Cd * rho * A * v ** 2;
      const Fl = 0.5 * Cl * rho * A * v ** 2;
  
      const ax = (-Fd * (vx / v) + Fl * (-vy / v)) / mass;
      const ay = (-Fd * (vy / v) + Fl * (vx / v)) / mass - g;
  
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
  
      iteration++;
  
      // Stop when ball crosses ground level (y < 0)
      if (y < 0 && previousY > 0) break;
      previousY = y;
    }
  
    const carryDistance = x * 1.09361; // Convert to yards
    console.log("Final calculated distance:", carryDistance);
    return carryDistance;
  };
  
};
