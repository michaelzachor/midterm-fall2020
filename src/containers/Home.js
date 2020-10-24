import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = process.env.REACT_APP_FOOTBALL_API_KEY;

function Home() {
    const [covidData, setCovidData] = useState([]);
    const [footballData, setFootballData] = useState([]);

    useEffect(() => {
        axios.get(`http://api.football-data.org/v2/competitions/PL/matches/?season=2019&dateFrom=2020-02-01&dateTo=2020-03-14`, { headers: { 'X-Auth-Token': apiKey}})
        .then(function(response) {
            const footballResponse = response.data.matches;
            setFootballData(footballResponse);
            console.log('football response: ', response);
        })
        .catch(function(error) {
            console.warn(error);
        });
    }, []);

    useEffect(() => {
        axios.get(`https://api.covid19api.com/country/great-britain/status/confirmed?from=2020-02-01T00:00:00Z&to=2020-03-14T00:00:00Z`)
        .then(function(response) {
            const covidResponse = response.data;
            setCovidData(covidResponse);
            console.log('covid response: ', response);
        })
        .catch(function(error) {
            console.warn(error);
        })
    }, []);

    let match_day = "";

    // console.log("key: ", process.env.REACT_APP_API_KEY);
    // console.log("ticketmasterData: ", ticketmasterData);
    console.log("covidData: ", covidData);
    // console.log("check key: " + API_STRING);
    // console.log("check2: " + API_KEY_FOOTBALL);
    console.log("footballData: ", footballData);
    return (
        <main className="Home">
            <h1>Data about Premier League and Covid in UK</h1>
            <div className="Data">
                <div>
                    <h2>Premier League Data</h2>
                    {/* {covidData.map((day, i) => {
                        switch(i%11) {
                            case 0:
                                {footballData.map((match, j) => {
                                    // console.log("covid: " + day.Date);
                                    // console.log("football: " + match.utcDate);
                                    switch(match.utcDate.substr(0, 10) === day.Date.substr(0, 10)) {
                                        case true:
                                            console.log("True");
                                            match_day = match.utcDate.substr(0, 10);
                                            return <div key={j}>
                                                    <h3>{match_day}</h3>
                                                    <h4>PL Matches</h4>
                                                    <p>Match: {match.homeTeam.name} vs. {match.awayTeam.name}</p>
                                                    <p>Score: {match.score.fullTime.homeTeam} - {match.score.fullTime.awayTeam}</p>
                                                   </div>;
                                        default:
                                            return null;
                                    }
                                })}
                                return <div key={i}>
                                        <h4>Covid Cases</h4>
                                        <p>Total Cases: {day.Cases}</p>
                                       </div>;
                            default:
                                return null;
                        }
                        
                    })} */}
                    {footballData.map((match, i) => {
                        switch(match.utcDate.substr(0, 10) === match_day) {
                            case false:
                                match_day = match.utcDate.substr(0, 10);
                                return <div key={i}>
                                        <h3>{match.utcDate.substr(0, 10)}</h3>
                                        <h4>PL Matches</h4>
                                        <p>Match: {match.homeTeam.name} vs. {match.awayTeam.name}</p>
                                        <p>Score: {match.score.fullTime.homeTeam} - {match.score.fullTime.awayTeam}</p>
                                       </div>;
                            default:
                                return <div key={i}>
                                        <p>Match: {match.homeTeam.name} vs. {match.awayTeam.name}</p>
                                        <p>Score: {match.score.fullTime.homeTeam} - {match.score.fullTime.awayTeam}</p>
                                       </div>;
                        }
                    })}
                </div>
                <div>
                    <h2>Covid Data</h2>
                    {covidData.map((day, i) => {
                        switch(i%11) {
                            case 0:
                                return <div key={i}>
                                        <h4>Covid Cases</h4>
                                        <p>Total Cases: {day.Cases}</p>
                                       </div>;
                            default:
                                return null;
                        }
                        
                    })}
                </div>
            </div>
        </main>
    )
}

export default Home;