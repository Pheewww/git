import * as fs from 'fs';

import zlib from 'zlib';

const args = process.argv.slice(2);

const command = args[0];

enum Commands {

    Init = "init",

    Catfile = "cat-file",

    hashObject = "hash-object",

}

switch (command) {

    case Commands.Init:

        fs.mkdirSync(".git", { recursive: true });

        fs.mkdirSync(".git/objects", { recursive: true });

        fs.mkdirSync(".git/refs", { recursive: true });

        fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");

        console.log("Initialized git directory");

        break;

    case Commands.Catfile:

        const blobDir = args[2].substring(0, 2);

        const blobFile = args[2].substring(2);

        const blob = fs.readFileSync(`.git/objects/${blobDir}/${blobFile}`);

        const decompressedBuffer = zlib.unzipSync(blob);

        const nullByteIndex = decompressedBuffer.indexOf(0);

        const blobContent = decompressedBuffer.subarray(nullByteIndex + 1).toString();

        process.stdout.write(blobContent);

    case Commands.hashObject:

        const content = args[2];

        const header = Buffer.from(`blob ${content.length}\0`);

        const blobToHash = Buffer.concat([header, Buffer.from(content)]);

        const hash = zlib.deflateSync(blobToHash).toString("hex");

        const blobDir1 = hash.substring(0, 2);

        const blobFile1 = hash.substring(2);

        fs.mkdirSync(`.git/objects/${blobDir}`, { recursive: true });

        fs.writeFileSync(`.git/objects/${blobDir1}/${blobFile1}`, zlib.deflateSync(blobToHash));

        console.log(hash);

        break;

}