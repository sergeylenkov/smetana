import { Scanner } from '../src/scanner';

const scanner = new Scanner();

describe('Scanner', () => {
  beforeAll(async () => {
    await scanner.scan("D:\\Temp\\Music\\");
  })

  test('tracks', () => {
    expect(scanner.tracks.length).toBe(203);
  });

  test('albums', () => {
    expect(scanner.albums.length).toBe(18);
  });

  test('artists', () => {
    expect(scanner.artists.length).toBe(11);
  });

  test('genres', () => {
    expect(scanner.genres.length).toBe(6);
  });

  test('covers', () => {
    expect(scanner.covers.length).toBe(31);
  });
});
