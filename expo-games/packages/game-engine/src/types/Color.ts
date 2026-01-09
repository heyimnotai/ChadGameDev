export class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number = 1
  ) {}

  toString(): string {
    return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
  }

  toSkiaColor(): string {
    const hex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex(this.a)}`;
  }

  withOpacity(opacity: number): Color {
    return new Color(this.r, this.g, this.b, opacity);
  }

  static lerp(a: Color, b: Color, t: number): Color {
    return new Color(
      a.r + (b.r - a.r) * t,
      a.g + (b.g - a.g) * t,
      a.b + (b.b - a.b) * t,
      a.a + (b.a - a.a) * t
    );
  }

  // iOS System Colors
  static get white() { return new Color(1, 1, 1); }
  static get black() { return new Color(0, 0, 0); }
  static get clear() { return new Color(0, 0, 0, 0); }
  static get red() { return new Color(1, 0.231, 0.188); }
  static get orange() { return new Color(1, 0.584, 0); }
  static get yellow() { return new Color(1, 0.8, 0); }
  static get green() { return new Color(0.204, 0.78, 0.349); }
  static get mint() { return new Color(0, 0.78, 0.745); }
  static get teal() { return new Color(0.188, 0.69, 0.78); }
  static get cyan() { return new Color(0.196, 0.678, 0.902); }
  static get blue() { return new Color(0, 0.478, 1); }
  static get indigo() { return new Color(0.345, 0.337, 0.839); }
  static get purple() { return new Color(0.686, 0.322, 0.871); }
  static get pink() { return new Color(1, 0.176, 0.333); }
  static get gray() { return new Color(0.557, 0.557, 0.576); }

  static fromHex(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return new Color(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      );
    }
    return Color.white;
  }
}
