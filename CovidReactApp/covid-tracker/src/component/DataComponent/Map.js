import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { readRemoteFile } from 'react-papaparse'

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const colorScale = scaleQuantize()
  .domain([1, 10])
  .range([
    "#ffedea",
    "#ffcec5",
    "#ffad9f",
    "#ff8a75",
    "#ff5533",
    "#e2492d",
    "#be3d26",
    "#9a311f",
    "#782618"
  ]);

const MapChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // https://www.bls.gov/lau/
    readRemoteFile("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv", {
    download: true,
    complete: (results) => 
        {
        console.log(results)
        setData(results)
        }
    })
    }, []);
  
    return(<></>);
    /*return (
      <>
        <ComposableMap projection="geoAlbersUsa" width={1500} height={500}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const cur = data.find(s => s.id === geo.id);
                return (
                  <Geography key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(cur ? cur.cases : "#EEE")}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </>
  );*/
};

export default MapChart;