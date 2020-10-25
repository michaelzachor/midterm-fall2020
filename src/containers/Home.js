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
            // console.log('football response: ', response);
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
            // console.log('covid response: ', response);
        })
        .catch(function(error) {
            console.warn(error);
        })
    }, []);

    let footballArray = [];
    let footballArray2 = [];
    let covidArray = [];
    let dateArray = [];

    {covidData.map((day, i) => {
        if (i%11 == 0) {
            covidArray.push({date: day.Date.substr(0, 10), cases: day.Cases});
        }
    })}

    {footballData.map((match, i) => {
        footballArray.push({date: match.utcDate.substr(0, 10), home: match.homeTeam.name, away: match.awayTeam.name, score: match.score.fullTime.homeTeam + "-" + match.score.fullTime.awayTeam});
        if (i === 0 || footballArray[i].date !== footballArray[i-1].date) {
            footballArray2.push([footballArray[i]]);
            var j = 0;
            while (covidArray[j].date != footballArray[i].date) { j++; }
            dateArray.push({date: footballArray[i].date, football: footballArray2[footballArray2.length-1], covid: covidArray[j]});
        }
        else {
            footballArray2[footballArray2.length-1].push(footballArray[i]);
        }
    })}

    return (
        <main className="Home">
            <h1>Data about Premier League and Covid in UK</h1>
            <div>
                <div>
                    {dateArray.map((day, i) => {
                        console.log(day)
                        return <div key={i}>
                            <h2>Matchday {i+1}: {day.date}</h2>
                            <div className="Data">
                                <div className="FootballData">
                                    {day.football.map((match, i) => {
                                        return <p>{match.home} {match.score} {match.away}</p>;
                                    })}
                                </div>
                                <div className="CovidData">
                                    <p>Total Covid Cases: {day.covid.cases}</p>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </main>
    )
}

export default Home;