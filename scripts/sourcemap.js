import fs from "node:fs";
import path from "node:path";

import { SourceMapConsumer } from "source-map";

const distFolder = path.join(process.cwd(), "dist");

async function main() {
  const hasBackupMapFile = fs.existsSync(
    path.join(distFolder, "bundle.original.js.map")
  );
  
  if (!hasBackupMapFile) {
    // Backup the original map file for debugging
    fs.renameSync(
      path.join(distFolder, "bundle.js.map"),
      path.join(distFolder, "bundle.original.js.map")
    );
  }

  const originalMap = JSON.parse(
    fs.readFileSync(path.join(distFolder, "bundle.original.js.map"), "utf-8")
  );

  const bundleConsumer = await new SourceMapConsumer(originalMap);

  const mappings = [];
  bundleConsumer.eachMapping((mapping) => {
    mappings.push(mapping);
  });

  const sections = bundleConsumer.sources.map((source) =>
    mappings.find((mapping) => mapping.source === source)
  );

  const indexMap = {
    version: originalMap.version,
    file: originalMap.file,
    sections: sections.map((section) => {
      const generatedLine = section.generatedLine - 1;
      const originalLine = section.originalLine - 1;

      return {
        offset: {
          line: generatedLine - originalLine,
          column: section.generatedColumn,
        },

        // Load the original map file for each source in the bundle
        map: JSON.parse(
          fs.readFileSync(
            path.join(distFolder, section.source + ".map"),
            "utf-8"
          )
        ),
      };
    }),
  };

  // Save the decoded map for debugging
  fs.writeFileSync(
    path.join(distFolder, "bundle.decoded.js.map"),
    JSON.stringify({ ...originalMap, mappings }, null, 2),
    "utf-8"
  );

  fs.writeFileSync(
    path.join(distFolder, "bundle.js.map"),
    JSON.stringify(indexMap, null, 2),
    "utf-8"
  );
}

main().then(() => {
  console.log("Done");
});
