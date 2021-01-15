import React from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
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
        //this.handleChange = this.handleChange.bind(this);
        this.state = {
            counties:[]
        }
    }

    csvJSON(csv){

        var lines=csv.split("\n");
      
        var result = [];

        var headers=lines[0].split(",");
      
        for(var i=1;i<lines.length;i++){
      
            var obj = {};
            var currentline=lines[i].split(",");
      
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
            }
      
            result.push(JSON.stringify(obj));
      
        }
        return result; 
    }

    componentDidMount()
    {
        /*console.log("hello world");
        fetch("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv").then((response) => {

            //this.setState({counties : this.csvJSON(response.data)})
            console.log(response.json);
        })*/

        /*fetch("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv")
        .then((response) => {
            this.setState({counties : response.data})
        }*/
        readRemoteFile("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv", 
        {
            download: true,
            header:true,
            complete: (results) => 
            {
                console.log(results.data)
                //console.log("HELLO THERE" + results.data[60].county)
                this.setState({counties : results.data})
            }
        })
        /*UserService.getUsers().then((response) => {
            this.setState({users : response.data})
            console.log("done");
        })*/
    }

    render (){
        return (
            <>
                <ComposableMap projection="geoAlbersUsa" width={1500} height={600}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                        geographies.map(geo => {
                            const cur = this.state.counties.find(s => s.fips === geo.id);
                            console.log(cur ? cur.cases + " " + cur.county: "not found");
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
    }

}

export default UserComponent