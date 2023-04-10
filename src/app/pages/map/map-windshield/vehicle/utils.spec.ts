import {getImage} from "./utils";

describe("MapComponent", () => {
  it("getImage", () => {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    expect(getImage(data, -7, -7, 15)).toBe(0);
    expect(getImage(data, 0, -7, 15)).toBe(7);
    expect(getImage(data, 7, -7, 15)).toBe(14);
  });
});
