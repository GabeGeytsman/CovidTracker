import React from 'react';
import MapState from './MapState';
import MapCounty from './MapCounty';
import cheerio from 'cheerio';
import axios from 'axios';
import './MapBox.css';

class MapBox extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            map:0,
            //data:[]
            /*totalCases:0,
            newCases:0,
            last7days:0,
            totalDeaths:0,
            newDeaths:0*/
        };
        //this.delta = this.delta.bind(this);
    }

    setMapState = () =>
    {
        this.setState({map : 0})
    }
    setMapCounty = () =>
    {
        this.setState({map : 1})
    }

    /*setMapState(){
        this.setState({map : 0})
    }
    setMapCounty(){
        this.setState({map : 1})
    }*/
    /*componentDidMount(){
        console.log("here we go")
        const html = axios.get('https://covid.cdc.gov/covid-data-tracker/#cases_casesper100klast7days')
        let $ = cheerio.load(html);
        let dataset = []
        //.maincontent.content-container.main-wiget-container.wiget-container-middle.widget_4.number-card-container three-tier
        $('.card-container three-tier').each((i, elem) => {
            dataset.push({
                category: $(elem).find('card-category').text(),
                number: $(elem).find('card-number').text(),
                recent: $(elem).find('card-recent').text(),

            })
        });
        console.log(dataset);
    }*/

    render(){
        let map;
        if(this.state.map===0)
            map = <MapState />;
        else
            map = <MapCounty />;
        return(
        <div>
            {map}
            <form className="buttons">
            <div className="radio">
            <label>
                <input type="radio" name="button" onChange={this.setMapState}/>
                View by State
            </label>
            </div>
            <div className="radio">
            <label>
                <input type="radio" name="button" onChange={this.setMapCounty}/>
                View by County
            </label>
            </div>
        </form>
        
        </div>

        )
    }

}

export default MapBox