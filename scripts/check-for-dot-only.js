const glob = require('glob');
const fs = require('fs');

var getDirectories = (src, callback) => {
  glob(src + '/**/*.test.ts', callback);
};

getDirectories('test', (err, res) => {
  if (err) {
    throw err;
  }

  res.forEach(f => {
    fs.readFile(f, (err, data) => {
      if (err) throw err;
      if (data.includes('.only')){
        throw new Error(`Remove the ".only" from ${f}`);
      }
    });
  });
});
