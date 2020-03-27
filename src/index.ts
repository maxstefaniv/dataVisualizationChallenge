import * as d3 from "d3";
import * as topojson from "topojson-client";
const austjson = require("./aust.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { stats, stats20200326, StatsEntry } from "./stats";

//Create the work space
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

//creating the map of Australian states
const aProjection = d3.geoMercator()
  // Let's make the map bigger to fit in our resolution
  .scale(900)
  // Let's center the map
  .translate([-1600, -50]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(austjson, austjson.objects.collection);

const maxAffected = stats20200326.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);

const affectedRadiusScale = d3
  .scaleLinear()
  .domain([0, maxAffected])
  .range([3, 40]); 
const funtionThatReturnsMyStringColor = (d) => {
  
  var communityName = d.properties.STATE
  var peopleWithTheVirus = stats20200326.find(potato => potato.name === communityName)
  console.log(peopleWithTheVirus)
  console.log(maxAffected)
  var kk = peopleWithTheVirus ? (peopleWithTheVirus.value) / (maxAffected) * 100 : 0;
  kk = 100 - kk
  //this gives kk=0 if people withTheVirus is undefined or does not exist
  console.log(kk)
  console.log(`hsla(360, 100%, ${kk}%, 1)`)
  return `hsla(360, 100%, ${kk}%, 1)`;
}

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path") 
  .attr("class", "country")
  .attr("fill", d => funtionThatReturnsMyStringColor(d))
  // data loaded from json file
  .attr("d", geoPath as any)  ;

const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
  const entry = stats20200326.find(item => item.name === comunidad);
  return entry ? affectedRadiusScale(entry.value) : 0;
};

svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  //it creates a circle
  .append("circle")
  .attr("class", "affected-marker")
  //calculates the radius of the circle
  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name))
  //puts the center of my circle in position inside of already created map
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1])
  .on("mouseover", function (d, i) {
    div
      .transition()
      .style("opacity", 1);

    const tooltipContent = `
      <span>
      ${stats20200326.find(entry => entry.name === d["name"]).name} : ${stats20200326.find(entry => entry.name === d["name"]).value}
      </span>`;

    div
      .html(tooltipContent)
      .style("left", `${d3.event.pageX}px`)
      .style("top", `${d3.event.pageY - 28}px`);
  })
  .on("mouseout", function (d, i) {
    div
      .transition()
      .style("opacity", 0);
  });

//Buttons
document
  .getElementById("stats")
  .addEventListener("click", function handleOriginalStats() {
    updateCircles(stats);
  });

document
  .getElementById("stats20200326")
  .addEventListener("click", function handleMarStats() {
    updateCircles(stats20200326);
  });
//this part is just because I wanted to print the stats over the circles START
// Tooltip
const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
//this part is just because I wanted to print the stats over the circles STOP
const updateCircles = (data: StatsEntry[]) => {
  const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0
  );
  console.log(maxAffected)// OK
  const affectedRadiusScale = d3
    .scaleLinear()
    .domain([0, maxAffected])
    .range([3, 40]); // 40 pixel max radius, we could calculate it relative to width and height

  console.log("he pasado por aqui")
  const funtionThatReturnsMyStringColor = (d) => {
    var communityName = d.properties.STATE
    var peopleWithTheVirus = data.find(potato => potato.name === communityName)
    var kk = peopleWithTheVirus ? (peopleWithTheVirus.value) / (maxAffected) * 100 : 0;
    //this gives kk=0 if people withTheVirus is undefined or does not exist
    kk = 100 - kk
    return `hsla(360, 100%, ${kk}%, 1)`;
  }
  const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
    const entry = data.find(item => item.name === comunidad);
    return entry ? affectedRadiusScale(entry.value) : 0;
  };
  svg
    .selectAll("circle")
    //this part is just because I wanted to print the stats over the circles START
    .on("mouseover", function (d, i) {
      div
        .transition()
        .style("opacity", 1);

      const tooltipContent = `
        <span>
        ${data.find(entry => entry.name === d["name"]).name} : ${data.find(entry => entry.name === d["name"]).value}
        </span>`;

      div
        .html(tooltipContent)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY - 28}px`);
    })
    .on("mouseout", function (d, i) {
      div
        .transition()
        .style("opacity", 0);
    })
    //this part is just because I wanted to print the stats over the circles STOP
    .transition()
    .duration(600)
    //RECALCULATES the radius of the circle
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d["name"]))
    ;

  svg
    .selectAll("path")
    .transition()
    .duration(600)
    .attr("fill", d => funtionThatReturnsMyStringColor(d));
};
