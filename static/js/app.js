// DEFINE FUNCTIONS //

// Define function which populates Demographic Info box
function buildInfoBox(id, data) {
    // Select metadata for the selected ID

    var filteredMetadata = data.filter(sample => sample.name == id);

    // Get a reference to the demographic info element
    var demographicInfo = d3.select("#sample-metadata");

    // Clear content if exists
    demographicInfo.html("");

    console.log(filteredMetadata);

    keys = Object.keys(filteredMetadata[0]);
    values = Object.values(filteredMetadata[0])

    demographicInfo.append("p").attr("class", "bold").text(`name:`).append("tspan").attr("class", "normal").text(` ${values[11]}`);
    demographicInfo.append("p").attr("class", "bold").text(`rank:`).append("tspan").attr("class", "normal").text(` ${values[13]}`);
    demographicInfo.append("p").attr("class", "bold").text(`age:`).append("tspan").attr("class", "normal").text(` ${values[0]}`);
    demographicInfo.append("p").attr("class", "bold").text(`net worth:`).append("tspan").attr("class", "normal").text(` ${values[12]} b$`);
    demographicInfo.append("p").attr("class", "bold").text(`self made:`).append("tspan").attr("class", "normal").text(` ${values[15]}`);
    demographicInfo.append("p").attr("class", "bold").text(`source:`).append("tspan").attr("class", "normal").text(` ${values[16]}`);
    demographicInfo.append("p").attr("class", "bold").text(`citizenship:`).append("tspan").attr("class", "normal").text(` ${values[2]}`);
    demographicInfo.append("p").attr("class", "bold").text(`residence:`).append("tspan").attr("class", "normal").text(` ${values[14]}`);
    demographicInfo.append("p").attr("class", "bold").text(`education:`).append("tspan").attr("class", "normal").text(` ${values[5]}`);
    demographicInfo.append("p").attr("class", "bold").text(`status:`).append("tspan").attr("class", "normal").text(` ${values[17]}`);
    demographicInfo.append("p").attr("class", "bold").text(`children:`).append("tspan").attr("class", "normal").text(` ${values[1]}`);

};

// 0 "age": 57, 
// 1 "children": 4, 
// 2 "citizenship": "United States", 
// 3 "country": "United States", 
// 4 "degree": "Bachelor of Arts/Science", 
// 5 "education": "Bachelor of Arts/Science, Princeton University", 
// 6 "fullname": "jeff-bezos", 
// 7 "groupednetworth": "Over $70 b", 
// 8 "id": 0, 
// 9 "latitude": "47.6038321", 
// 10 "longitude": "-122.3300624", 
// 11 "name": "Jeff Bezos", 
// 12 "networth": "177.0", 
// 13 "rank": 1, 
// 14 "residence": "Seattle, Washington", 
// 15 "self_made": "true", 
// 16 "source": "Amazon", 
// 17 "status": "In Relationship", 
// 18 "university": " Princeton University"


// Define function which creates Horizontal Bar Chart
function buildBarChart(country, data) {

  var plotData = [];

  if (country === "All") {

    plotData = data;

  } else {

    // Fitler data for the selected ID
    plotData = data.filter(sample => sample.country == country);

  }

  // Initialize an empty array to store info for charts
  var chartData = [];

  // Add samples data to the array  
  for (var j = 0; j < plotData.length; j++) {
    chartData.push({
      name: plotData[j].name,
      networth: plotData[j].networth,
      rank: plotData[j].rank
    });
  };

  // Sort the array by sample values in descending order
  var sortedBarChartData= chartData.sort(function compareFunction(a, b) {
    return a.rank - b.rank;
  });
  
  // Slice the first 10 objects for plotting
  var slicedBarChartData = sortedBarChartData.slice(0, 10);

  // Define trace parameters
  var trace = {
      x: slicedBarChartData.map(object => object.name),
      y: slicedBarChartData.map(object => object.networth),
      text: slicedBarChartData.map(object => `Rank: ${object.rank}`),
      type: "bar",
      marker: {color:'#91b6c6'}
  };

  // Assign data for plot
  var plotData = [trace];

  // Define layout parameters
  var layout = {
      yaxis: { title: `<b>Net Worth b$</b>`},
      width: 750,
      height: 550,
      margin: {
        l: 50,
        r: 100,
        b: 150,
        t: 0,
        pad: 5
      }
  };

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", plotData, layout);

};


function buildStatusPieChart(country, data) {

  var plotData = [];
  var total = 0;

  if (country === "All") {

    plotData = data;
    total = Object.keys(data).length;

  } else {

    // Fitler data for the selected ID
    plotData = data.filter(sample => sample.country == country);
    total = Object.keys(plotData).length;

  }

  // Create set of unique values from dataset for each filter
  var unique = new Set(plotData.map(x => x["status"]));

  // Get unique set values
  var setValues= unique.values();

  // Create empty object to store unique values
  var uniqueValuestest = {};

  // Save each unique value in an array
  for (var i = 0; i < unique.size; i++) {
      // uniqueValues.push(setValues.next().value);
      uniqueValuestest[setValues.next().value] = 0;
  };

  // console.log(uniqueValuestest);

  plotData.forEach((event) => {

    if (Object.values(event)[17] === null) {
                
      uniqueValuestest["null"] += 1;

    } else {

      Object.entries(uniqueValuestest).forEach(([key, value]) => {

        if (Object.values(event)[17] === key) {
              
          uniqueValuestest[key] += 1;

        };
      }); 

    };

  }); 

  delete Object.assign(uniqueValuestest, {["Unknown"]: uniqueValuestest[null]})[null];

  console.log(uniqueValuestest);

  var married = uniqueValuestest.Married/total * 100;

  var selectMarried= d3.select("#married");
  selectMarried.text(`${married.toFixed(1)}% of billionaires are married`);


  var colors = {
    "Married": '#b55c52', 
    "Unknown": '#eff0eb',
    "Divorced": '#95c281',
    "Widowed": '#4f8b67',
    "Single": '#fb4949',
    "In Relationship": '#bfb6b1',
    "Separated": '#676664',
    "Widowed, Remarried": '#91b6c6',
    "Engaged": '#fc8186'
  };

  var currentColors = {};

  Object.keys(uniqueValuestest).forEach((test) => {

    Object.entries(colors).forEach(([key, value]) => {

        if (key === test) {
          
          currentColors[test] = value;

        };

    });
  });

  var trace1 = {
    labels: Object.keys(uniqueValuestest),
    values: Object.values(uniqueValuestest),
    type: 'pie',
    // marker: {colors:['#a3b7a9', '#b55c52']}
    marker: {colors:Object.values(currentColors)},
    domain: {x: [0, 3.2]}
  };

  var data = [trace1];

  var layout = {
    // title: "Status",
    autosize: false,
    width: 500,
    height: 350,
    margin: {
      l: 50,
      r: 50,
      b: 0,
      t: 0,
      pad: 1
    },
    legend: {
      x: 1,
      y: 0.5
    }
  };

  Plotly.newPlot("status", data, layout);
  
}; 


function buildPieChart(country, data) {

  var plotData = [];
  var total = 0;

  if (country === "All") {

    plotData = data;
    total = Object.keys(data).length;

  } else {

    // Fitler data for the selected ID
    plotData = data.filter(sample => sample.country == country);
    total = Object.keys(plotData).length;

  }

  var results = { 
    Yes: 0,
    No: 0
  };

  // Add keys and values from the metadata for selected ID into the Info Box
  plotData.forEach((event) => {

        if (Object.values(event)[15] == "true") {
          results.Yes += 1;
        } else {
          results.No += 1;
        };

  });

  var selfMade = results.Yes/total * 100;

  // console.log(selfMade);

  var selectselfMade = d3.select("#self_made_info");
  selectselfMade.text(`${selfMade.toFixed(1)}% of billionaires are self made`);


  var colors = {
    "Yes": '#739076',
    "No": '#eff0eb'
  };

  var currentColors = {};

  Object.keys(results).forEach((test) => {

    Object.entries(colors).forEach(([key, value]) => {

        if (key === test) {
          
          currentColors[test] = value;

        };

    });
  });

  var trace1 = {
    labels: Object.keys(results),
    values: Object.values(results),
    type: 'pie',
    marker: {colors:Object.values(currentColors)},
    domain: {x: [0, 0.75]}
  };

  var data = [trace1];

  var layout = {
    // title: "Self Made",
    autosize: false,
    width: 500,
    height: 350,
    margin: {
      l: 50,
      r: 50,
      b: 0,
      t: 0,
      pad: 1
    },
    legend: {
      x: 1,
      y: 0.5
    }
  };

  Plotly.newPlot("self_made", data, layout);

}; 


// Define function which handles Test Subject ID chagnes
function optionChanged(id) {

  d3.json("/test").then((data) => {

    // Create Demographic Info box for selected ID
    buildInfoBox(id, data);

  });
};


// Define function which handles Test Subject ID chagnes
function countryChanged(country) {

  console.log(country);

  d3.json("/test").then((data) => {

    // Create Bar Chart for selected ID
    buildPieChart(country, data);

    // Create Gauge Chart for selected ID
    buildStatusPieChart(country, data);

    // Create Bar Chart for selected ID
    buildBarChart(country, data);

    var number = [];
    var total = 0;

    var allNumber = Object.keys(data).length;

    var allTotal = data.reduce(function (a, currentValue) {
      return a + parseFloat(currentValue.networth);
    }, 0);

    if (country === "All") {

      number = allNumber;
  
      total = allTotal;

    } else {
  
      // Fitler data for the selected ID
      plotData = data.filter(sample => sample.country == country);

      number = Object.keys(plotData).length;

      total = plotData.reduce(function (a, currentValue) {
        return a + parseFloat(currentValue.networth);
      }, 0);

    }

    var pctTotal = total / allTotal * 100;
    var pctNumber = number / allNumber * 100;

    var selectnumber = d3.select("#number");
    selectnumber.html(`${number} &nbsp;&nbsp;  (${pctNumber.toFixed(2)}%)`);

    var selecttotal = d3.select("#total");
    selecttotal.html(`b$ ${total.toFixed(1)} &nbsp;&nbsp;  (${pctTotal.toFixed(2)}%)`);

  });

};


// POPULATE THE PAGE UPON FIRST LOAD //

d3.json("/test").then(function(data, err) {
  if (err) throw err;

  var names = [];

  // console.log(data);

  data.forEach(element => {
        names.push(element.name);
  });

  names.sort(function(a, b){
    if(a < b) { return -1; }
    if(a > b) { return 1; }
    return 0;
  })

  // Get a reference to the select element
  var selectMenu = d3.select("#selDataset");

  // Populate list of the avaialable options for the Test Subject ID numbers
  names.forEach(element => {
      selectMenu.append("option").text(element);
  });     
    
  // Get ID number of the first record in the dataset
  var id = names[0];

  // Create Demographic Info box for the first record in the dataset
  buildInfoBox(id, data);

  country = "All";

  // Get a reference to the select element
  var selectCountryMenu = d3.select("#selCountry");

  // Create set of unique values from dataset for each filter
  var uniqueCountry = new Set(data.map(x => x["country"]));

  // Get unique set values
  var setCountryValues = uniqueCountry.values();

  // Create empty array to store unique values
  var uniqueCountryValues = [];

  // Save each unique value in an array
  for (var i = 0; i < uniqueCountry.size; i++) {
    uniqueCountryValues.push(setCountryValues.next().value);
  };

  uniqueCountryValues.sort(function(a, b){
    if(a < b) { return -1; }
    if(a > b) { return 1; }
    return 0;
  })

  // console.log(uniqueCountryValues);

  selectCountryMenu.append("option").text("All");

  // Populate list of the avaialable options for the Test Subject ID numbers
  uniqueCountryValues.forEach(element => {
    selectCountryMenu.append("option").text(element);
  }); 

  // Create Gauge Chart for the first record in the dataset
  buildPieChart(country, data);

  // Create Gauge Chart for the first record in the dataset
  buildStatusPieChart(country, data);

  // Create Bar Chart for selected ID
  buildBarChart(country, data);

  // buildScatterPlot(data);


});
