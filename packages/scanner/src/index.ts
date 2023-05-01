import parseArgs from 'minimist';
import { Colors } from './utils/console';
import { Scanner } from './scanner';
import { Database } from './scanner/db';

async function scan(path: string, dbPath: string) {
  try {
    let startTime = Date.now();
    const totalStartTime = Date.now();

    const scanner = new Scanner();
    await scanner.scan(path);

    const tracks = scanner.tracks;
    const albums = scanner.albums;
    const covers = scanner.covers;
    const genres = scanner.genres;
    const artists = scanner.artists;

    let endTime = Date.now();

    console.log(`Parsing finished in ${Colors.FgYellow}${(endTime - startTime) / 1000}s${Colors.Reset}`)
    console.log(`Total tracks found: ${Colors.FgYellow}${tracks.length}${Colors.Reset}`);
    console.log(`Total albums found: ${Colors.FgYellow}${albums.length}${Colors.Reset}`);
    console.log(`Total artists found: ${Colors.FgYellow}${artists.length}${Colors.Reset}`);
    console.log(`Total genres found: ${Colors.FgYellow}${genres.length}${Colors.Reset}`);
    console.log(`Total covers found: ${Colors.FgYellow}${covers.length}${Colors.Reset}`);

    console.log(`Writing database ${Colors.FgYellow}${dbPath}${Colors.Reset}`);

    startTime = Date.now();

    const db = new Database(dbPath);

    await db.create();
    await db.clear();

    console.log(`Processing ${Colors.FgYellow}artists${Colors.Reset}`);
    await db.processArtists(artists);

    console.log(`Processing ${Colors.FgYellow}genres${Colors.Reset}`);
    await db.processGenres(genres);

    console.log(`Processing ${Colors.FgYellow}covers${Colors.Reset}`);
    await db.processCovers(covers);

    console.log(`Processing ${Colors.FgYellow}albums${Colors.Reset}`);
    await db.processAlbums(albums);

    console.log(`Processing ${Colors.FgYellow}tracks${Colors.Reset}`);
    await db.processTracks(tracks);

    console.log(`Processing ${Colors.FgYellow}albums metadata${Colors.Reset}`);
    await db.processAlbumsMetaData();

    console.log(`Creating indexes${Colors.Reset}`);
    await db.createIndexes();

    db.close();

    endTime = Date.now();

    console.log(`All data written to database in ${(endTime - startTime) / 1000}s`);
    console.log(`Total scan time: ${(endTime - totalStartTime) / 1000}s`);
  } catch (error) {
    console.log(`${Colors.FgRed}${error}${Colors.Reset}`);
  }
}

const args = parseArgs(process.argv.slice(2));

if (args['library'] && args['db']) {
  scan(args['library'], args['db']);
} else {
  console.error(
    'Use npm run scan -- --library <path-to-music-library> --db <path-to-db>'
  );
  process.exit(1);
}
