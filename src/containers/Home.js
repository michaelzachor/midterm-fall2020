import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {useHistory } from 'react-router-dom';

const apiKey = process.env.REACT_APP_FOOTBALL_API_KEY;

function Home() {
    const history = useHistory();
    const [covidData, setCovidData] = useState([]);
    const [footballData, setFootballData] = useState([]);
    const [day, setDay] = useState(null);
    let covidArray = [];

    /* GET FOOTBALL DATA */
    useEffect(() => {
        axios
        .get(
            `http://api.football-data.org/v2/competitions/PL/matches/?matchday=${day}&season=2019`, { headers: { 'X-Auth-Token': apiKey}}
            )
        .then(function(response) {
            const footballResponse = response.data.matches;
            setFootballData(footballResponse);
            
        })
        .catch(function(error) {
            console.warn(error);
        });
    }, [day]);
    
    /* GET COVID DATA */
    useEffect(() => {
        axios
        .get(
            `https://api.covid19api.com/country/great-britain/status/confirmed?from=2020-02-01T00:00:00Z&to=2020-03-14T00:00:00Z`
            )
        .then(function(response) {
            const covidResponse = response.data;
            setCovidData(covidResponse);
        })
        .catch(function(error) {
            console.warn(error);
        })
    }, []);

    /* SEARCH PARAMETER */
    useEffect(() => {
        const searchParams = history.location.search;
        const urlParams = new URLSearchParams(searchParams);
        const day = urlParams.get("matchday");
        if (day) {
            setDay(day);
        }
        console.log(day, "matchday");
    }, [history]);

    {covidData.map((day, i) => {
        if (i%11 == 0) {
            covidArray.push({date: day.Date.substr(0, 10), cases: day.Cases});
        }
    })}

    const {
        cases,
    } = useMemo(() => {
        let cases;
        if (covidData) {
            cases = covidArray
        }
        return {
            cases
        }
    })

    /* KEEP TRACK OF USEFUL FOOTBALL DATA */
    const { 
        date,
        home, 
        away,
        homeScore,
        awayScore,
    } = useMemo(() => {
        let date = '';
        let home = [];
        let away = [];
        let homeScore = [];
        let awayScore = [];

        if(footballData[0]) {
            // console.log(footballData[0]);
            date = footballData[0].utcDate.substr(0, 10);
            for (var game in footballData) {
                home.push(footballData[game].homeTeam.name);
                away.push(footballData[game].awayTeam.name);
                // score.push(`${footballData[game].score.fullTime.homeTeam}-${footballData[game].score.fullTime.awayTeam}` )
                homeScore.push(footballData[game].score.fullTime.homeTeam);
                awayScore.push(footballData[game].score.fullTime.awayTeam);
            }
        }
        return {
            date,
            home, 
            away,
            homeScore,
            awayScore,
        };
    }, [footballData]);

    function covidText(numberOfCases) {
        switch(true) {
            case numberOfCases > 400:
                return [80, '#ff0000'];
            case numberOfCases > 100:
                return [70, '#cc0000'];
            case numberOfCases > 50:
                return [60, '#990000'];
            case numberOfCases > 20:
                return [40, '#660000'];
            case numberOfCases > 10:
                return [30, '#330000'];
            default:
                return [20, '#000000'];
        }
    }


    /* THE ACTUAL WEB PAGE */
    return (
        <>
            {/* Header */}
            <header className="Header">
                <div className="Title">
                    <h1>Covid and the English Premier League</h1>
                    <p>On March 13, the EPL postponed the rest of 
                        the 2019-20 season due to Covid. Here's some 
                        data on the last several weeks before the 
                        suspension.</p>
                </div>
                <nav>
                    <span>Matchday: </span>
                    <a href="/?matchday=25">25</a>
                    <a href="/?matchday=26">26</a>
                    <a href="/?matchday=27">27</a>
                    <a href="/?matchday=28">28</a>
                    <a href="/?matchday=29">29</a>
                    {/* <a href="/?matchday=30">30</a>
                    <a href="/?matchday=31">31</a>
                    <a href="/?matchday=32">32</a>
                    <a href="/?matchday=33">33</a>
                    <a href="/?matchday=34">34</a> */}
                </nav>
            </header>
            <main className="Home">
                <h2>Matchday {day}: {date}</h2>
                <div className="Box">
                    <div className="FootballInfo">
                        <h3>Premier League Matches</h3>
                        <ul>
                            {home.map((item, i) => {
                                if (!item) return null;
                                return <li key={i}>{home[i]} <span style={{fontSize: (homeScore[i]+5)*3}}>{homeScore[i]}</span>-<span style={{fontSize: (awayScore[i]+5)*3}}>{awayScore[i]}</span> {away[i]}</li>
                            })}
                        </ul>
                    </div>
                    <div className="CovidInfo">
                        <h3>Covid Cases</h3>
                        <div>
                            {covidArray.map((item, i) => {
                                if (!item) return null;
                                return item.date == date &&
                                <div key={i} style={{fontSize: covidText(item.cases)[0], color: covidText(item.cases)[1]}}>{item.cases} cases</div>
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home;