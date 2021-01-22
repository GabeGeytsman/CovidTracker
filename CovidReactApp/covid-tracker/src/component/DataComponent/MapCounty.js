import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { readRemoteFile } from 'react-papaparse'

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const colorScale = scaleQuantize()
  .domain([1, 75000])
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

class UserComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            counties:[],
            countySelected:"Select a county",
            countySelectedCases:0,
            countySelectedDeaths:0
        }
    }

    handleClick = geo => () => {
        console.log(geo);
        const cur = this.state.counties.find(s => s.county === geo.name);
        this.setState({countySelected:geo.name});
        this.setState({countySelectedCases:(cur ? cur.cases : -1)});
        this.setState({countySelectedDeaths:(cur ? cur.deaths : -1)});  
        this.forceUpdate();
      };


    componentDidMount()
    {
        readRemoteFile("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv", 
        {
            download: true,
            header:true,
            complete: (results) => 
            {
                //console.log(results.data)
                this.setState({counties : results.data})
            }
        })
    }

    render (){
        return (
            <div className="box">
            <>
                <ComposableMap className = "map" projection="geoAlbersUsa" 
                projectionConfig={{
                    scale: 800,
                    rotation: [0, 0, 0],
                    }}
                    style={{ width: "60%", height: "auto" }}>
                    <ZoomableGroup zoom={1}> 
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                        geographies.map(geo => {
                            const cur = this.state.counties.find(s => s.fips === geo.id);
                            return (
                            <Geography key={geo.rsmKey}
                            geography={geo}
                            fill={colorScale(cur ? cur.cases : "#EEE")}
                            onClick={this.handleClick(geo.properties)}
                            />
                        );
                        })
                    }
                    </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </>
            <div className = "data">
                    <p>
                        County Selected: {this.state.countySelected}
                    </p>
                    <p>
                        Number of cases: {this.state.countySelectedCases}
                    </p>
                    <p>
                        Number of deaths: {this.state.countySelectedDeaths}
                    </p>
                </div>
            </div>

        )
    }

}

export default UserComponent