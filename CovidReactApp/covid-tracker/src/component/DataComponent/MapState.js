import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, Annotation} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { geoCentroid } from "d3-geo";
import { readRemoteFile } from 'react-papaparse'
import "./MapState.css"

import allStates from "./allstates.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const colorScale = scaleQuantize()
  .domain([1, 1000000])
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

  const offsets = {
    VT: [50, -8],
    NH: [34, 2],
    MA: [30, -1],
    RI: [28, 2],
    CT: [35, 10],
    NJ: [34, 1],
    DE: [33, 0],
    MD: [47, 10],
    DC: [49, 21]
  };

class UserComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            states:[],
            stateSelected:"Select a state",
            stateSelectedCases:0,
            stateSelectedDeaths:0
        }
    }

    


    componentDidMount()
    {
        readRemoteFile("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-states.csv", 
        {
            download: true,
            header:true,
            complete: (results) => 
            {
                console.log(results.data)
                this.setState({states : results.data})
            }
        })
    }

    handleClick = geo => () => {
        console.log(geo);
        const cur = this.state.states.find(s => s.state === geo.name);
        this.setState({stateSelected:geo.name});
        this.setState({stateSelectedCases:(cur ? cur.cases : -1)});
        this.setState({stateSelectedDeaths:(cur ? cur.deaths : -1)});
        /*this.state.stateSelected=geo.name;
        this.state.stateSelectedCases=(cur ? cur.cases : -1);*/
        this.forceUpdate();
      };

    render(){
        return (
            <div className="box">
          <ComposableMap className="map" projection="geoAlbersUsa" 
          projectionConfig={{
            scale: 800,
            rotation: [0, 0, 0],
            }}
            style={{ width: "60%", height: "auto" }} >
            <Geographies geography={geoUrl}>
              {({ geographies }) => (
                <>
                  {geographies.map(geo => {
                            const cur = this.state.states.find(s => s.fips === geo.id);
                            //console.log(cur ? cur.cases + " " + cur.state: "not found");
                            return (
                            <Geography key={geo.rsmKey}
                            geography={geo}
                            fill={colorScale(cur ? cur.cases : "#EEE")}
                            onClick={this.handleClick(geo.properties)}
                            />
                        );
                        })
                    }
                  {geographies.map(geo => {
                    const centroid = geoCentroid(geo);
                    const cur = allStates.find(s => s.val === geo.id);
                    return (
                      <g key={geo.rsmKey + "-name"}>
                        {cur &&
                          centroid[0] > -160 &&
                          centroid[0] < -67 &&
                          (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                            <Marker coordinates={centroid}>
                              <text y="2" fontSize={14} textAnchor="middle">
                                {cur.id}
                              </text>
                            </Marker>
                          ) : (
                            <Annotation
                              subject={centroid}
                              dx={offsets[cur.id][0]}
                              dy={offsets[cur.id][1]}
                            >
                              <text x={4} fontSize={14} alignmentBaseline="middle">
                                {cur.id}
                              </text>
                            </Annotation>
                          ))}
                      </g>
                    );
                  })}
                </>
              )}
            </Geographies>
          </ComposableMap>
                <div className = "data">
                    <p>
                        State Selected: {this.state.stateSelected}
                    </p>
                    <p>
                        Number of cases: {this.state.stateSelectedCases}
                    </p>
                    <p>
                        Number of deaths: {this.state.stateSelectedDeaths}
                    </p>
                </div>
            </div>
        );
      };

    /*render (){
        return (
            <>
                <ComposableMap projection="geoAlbersUsa" width={1500} height={600}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                        geographies.map(geo => {
                            const cur = this.state.states.find(s => s.fips === geo.id);
                            console.log(cur ? cur.cases + " " + cur.state: "not found");
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

        )
    }*/

}

export default UserComponent