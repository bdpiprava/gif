const d3 = require("d3");
const sharp = require('sharp');
const jsdom = require("jsdom");
const fs = require('fs');

const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`);

var div = dom.window.document.createElement("div");

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

deleteFolderRecursive("out");
fs.mkdirSync("out");

var width = 40,
  height = 16,
  lightColor = "#f77e7f",
  darkColor = "#e74546";

for (var i = 0; i < 42; i += 3) {
  div.innerHTML = "";
  var svg = d3.select(div)
    .append('svg')
    .attr("width", width)
    .attr("height", height)
    .attr("fill", lightColor);

  var g = svg.append("g")
    .attr("transform", "translate(" + i + ",0)");

  g.append("rect")
    .attr("x", -50)
    .attr("y", 0)
    .attr("width", width + 50)
    .attr("height", height);

  for (var j = 0; j <= (width + 40); j += 40) {
    g.append("polygon")
      .attr("points", `${-40 + j},0 ${-20 + j},0 ${-30 + j},30 ${-50 + j},30`)
      .attr("fill", darkColor);
  }

  // g.append("polygon")
  //   .attr("points", "-40,0 -20,0 -30,30 -50,30")
  //   .attr("fill", darkColor);
  //
  // g.append("polygon")
  //   .attr("points", "0,0 20,0 10,30 -10,30")
  //   .attr("fill", darkColor);
  //
  // g.append("polygon")
  //   .attr("points", "40,0 60,0 50,30 30,30")
  //   .attr("fill", darkColor);
  //
  // g.append("polygon")
  //   .attr("points", "80,0 100,0 90,30 70,30")
  //   .attr("fill", darkColor);

  var filename = `out/${i}.png`;
  console.log(filename);

  sharp(Buffer.from(div.innerHTML))
    .png()
    .toFile(filename, (err, info) => {
      console.log(err, info)
    });
}

