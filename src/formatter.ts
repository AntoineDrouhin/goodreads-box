

export default class Formatter {

  public generateLines(
    books: Book[],
    MAX_LENGTH = 54,
    MAX_LINES = 5): String[] {
    const barWidth = Math.floor(MAX_LENGTH / 4)
    const lines = books.slice(0, MAX_LINES).map(({ title, percent }) => {
      const bar = this.generateBarChart(percent, barWidth)
      const percentage = `${percent}%`.padStart(4, ' ')
      const length = MAX_LENGTH - bar.length - percentage.length - 1
      let text = title
      if (title.length > length) {
        text = title.substring(0, length - 3).concat('...')
      } else {
        text = title.padEnd(length, ' ')
      }
      return `${text} ${bar}${percentage}`
    })
    return lines
  }

  /**
   * Copyright (c) 2019, Matan Kushner <hello@matchai.me>
   * https://github.com/matchai/waka-box/blob/master/index.js
   */
  private generateBarChart(percent: number, size: number): string {
    const syms = '░▏▎▍▌▋▊▉█';

    const frac = Math.floor((size * 8 * percent) / 100);
    const barsFull = Math.floor(frac / 8);
    if (barsFull >= size) {
      return syms.substring(8, 9).repeat(size);
    }
    const semi = frac % 8;

    return [syms.substring(8, 9).repeat(barsFull), syms.substring(semi, semi + 1)]
      .join('')
      .padEnd(size, syms.substring(0, 1));
  }
}
