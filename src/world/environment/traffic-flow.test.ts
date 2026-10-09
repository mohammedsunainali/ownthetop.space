import { describe, expect, it } from "vitest";
import { createTraffic, crossingPerson, stepTraffic, trafficLight, vehicleArchetypes, vehicleHeading } from "./traffic-flow";
describe("controlled ring-road traffic", () => {
  it("coordinates a clear pedestrian interval with vehicle stopping", () => {
    expect(trafficLight(12, 0)).toBe("green");
    expect(trafficLight(14, 0)).toBe("amber");
    expect(trafficLight(17, 0)).toBe("red");
    const cars = createTraffic(1); cars[0].phase = 0.96;
    for (let i = 0; i < 400; i++) stepTraffic(cars, 0.02, 17);
    expect(cars[0].phase).toBeLessThanOrEqual(0.985);
    expect(cars[0].speed).toBeLessThan(0.002);
    for (let i = 0; i < 300; i++) stepTraffic(cars, 0.02, 21);
    expect(cars[0].phase).toBeLessThan(0.1);
  });
  it("preserves same-lane spacing over repeated signal cycles", () => {
    const cars = createTraffic(14);
    for (let tick = 0; tick < 12000; tick++) {
      stepTraffic(cars, 0.02, tick * 0.02);
      for (let i = 0; i < cars.length; i++) for (let j = i + 1; j < cars.length; j++) if (cars[i].direction === cars[j].direction) {
        const gap = Math.abs(cars[i].phase - cars[j].phase);
        expect(Math.min(gap, 1 - gap)).toBeGreaterThan(0.005);
      }
    }
  });
  it("uses actual vehicle forward axis and bounds interrupted frame steps", () => {
    expect(vehicleHeading(27, 22, 0, 1)).toBeCloseTo(0);
    expect(Math.abs(vehicleHeading(27, 22, 0, -1))).toBeCloseTo(Math.PI);
    const cars = createTraffic(7), phase = cars[0].phase;
    stepTraffic(cars, 10, 0);
    expect(cars[0].phase - phase).toBeLessThan(0.001);
  });
  it("keeps pedestrian crossing movement inside the red clearance interval", () => {
    for (let t = 0; t < 80; t += 0.1) for (let i = 0; i < 2; i++) {
      const person = crossingPerson(t, i);
      expect(Math.abs(person.x)).toBeGreaterThanOrEqual(24);
      expect(Math.abs(person.x)).toBeLessThanOrEqual(29.7);
      if (person.walking) expect(trafficLight(t, i)).toBe("red");
    }
    expect(crossingPerson(19.99, 0).x).toBeCloseTo(crossingPerson(20, 0).x);
  });
  it("uses actual vehicle lengths for spacing and bounded distinctive silhouettes", () => {
    const cars = createTraffic(14);
    expect(new Set(vehicleArchetypes.map(v=>v.kind)).size).toBe(6);
    vehicleArchetypes.forEach((spec,index)=>{
      expect(cars[index].length).toBe(spec.length);
      expect(spec.width).toBeLessThan(.45);
      expect(Math.abs(spec.cabinZ)+spec.cabin[2]/2).toBeLessThanOrEqual(spec.length/2);
    });
  });
});
