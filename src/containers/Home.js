import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {useHistory } from 'react-router-dom';

const apiKey = process.env.REACT_APP_FOOTBALL_API_KEY;

function Home() {
    const history = useHistory();
    const [covidData, setCovidData] = useState([]);
    const [footballData, setFootballData] = useState([]);
    const [day, setDay] = useState('25');
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

    /* KEEP TRACK OF USEFUL FOOTBALL DATA */
    const { 
        date,
        home, 
        away,
        score,
    } = useMemo(() => {
        let date = '';
        let home = [];
        let away = [];
        let score = [];

        if(footballData[0]) {
            // console.log(footballData[0]);
            date = footballData[0].utcDate.substr(0, 10);
            for (var game in footballData) {
                home.push(footballData[game].homeTeam.name);
                away.push(footballData[game].awayTeam.name);
                score.push(`${footballData[game].score.fullTime.homeTeam}-${footballData[game].score.fullTime.awayTeam}` )
            }
        }
        return {
            date,
            home, 
            away,
            score,
        };
    }, [footballData]);

    /* THE ACTUAL WEB PAGE */
    return (
        <>
            {/* Header */}
            <header className="Header">
                <div>
                    <h1>Data about Premier League and Covid in UK</h1>
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
                        <div>
                            {/* JS below */}
                            {home.map((item, i) => {
                                return <div key={i}>{home[i]} {score[i]} {away[i]}</div>
                            })}
                        </div>
                    </div>
                    <div className="CovidInfo">
                        <h3>Covid Cases</h3>
                        <div>
                            {covidArray.map((item, i) => {
                                return item.date == date &&
                                <div key={i}>{item.cases} cases</div>
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home;