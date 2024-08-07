﻿let Skills = ["beginner", "HS JV", "HS varsity", "D3 college", "D1 college"];
// max/min running skills are for 25-year old elite male and 60-year old beginner female, as tabulated at https://runninglevel.com/running-times
let distances = [["5K", 18, 45], ["10K", 37, 95], ["10mi", 61, 134]];
let numberRunningSkills = 15;
let runningSkills = [];
for (let i = 0; i <= numberRunningSkills; i++) {
    let skills = distances.map(([distance, minTime, maxTime]) => {
        let time = maxTime + Math.round(i * (minTime - maxTime) / numberRunningSkills);
        return `${distance}/${time}min`;
    });
    runningSkills.push(skills.join(", "));
}

module.exports = {
    sports: [
        {
            Name: "Baseball",
            boolTypes: {positions: ["infield", "outfield", "pitcher", "catcher"]},
            Skills,
        },
        {
            Name: "Badminton",
            boolTypes: {["team sizes"]: ["singles", "doubles"]},
            Skills,
        },
        {
            Name: "Basketball",
            boolTypes: {
                ["team sizes"]: ["3 on 3", "5 on 5"],
                positions: ["center", "forward", "guard"],
            },
            Skills,
        },
        {
            Name: "Biking",
            boolTypes: {distances: ["20 miles", "30 miles", "40 miles", "60 miles", "100 miles"]},
            Skills: [8,10,12,14,16,18,20,22].map(x => String(x) + "MPH"),
            nGenders: 3
        },
        {
            Name: "Bowling",
            boolTypes: {types: ["Ten pin", "Duck pin", "Candle pin", "Nine pin", "Five pin"]},
        },
        {
            Name: "Cross-country skiing",
            boolTypes: {distances: ["5K", "7K", "10K", "15K"]},
            nGenders: 3,
        },
        {
            Name: "Flag football",
            boolTypes: {
                ["team sizes"]: ["4s", "7s", "8s"],
                positions: ["QB", "receiver", "defense", "line", "running back"],
            },
            Skills,
        },
        {
            Name: "Hockey (ice)",
            boolTypes: {positions: ["center", "winger", "defense", "goalie"]},
            Skills,
        },
        {
            Name: "Hockey (field)",
            boolTypes: {
                positions: ["forward", "midfield", "defense", "goalie"],
                ["team sizes"]: ["11 on 11", "5 on 5"],
            },
            Skills,
        },
        {
            Name: "Lacrosse (men's)",
            boolTypes: { positions: ["goalie", "defense", "midfield", "attack"] },
            nGenders: 0,
            Skills,
        },
        {
            Name: "Lacrosse (women's)",
            boolTypes: { positions: ["goalie", "defense", "midfield", "attack"] },
            nGenders: 0,
            Skills,
        },
        {
            Name: "Paddle tennis",
            boolTypes: {["sizes and positions"]: ["singles", "doubles - deuce side", "doubles - ad side"]},
            Skills: ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0"],
        },
        {
            Name: "Ping-pong",
            boolTypes: {["team sizes"]: ["singles", "doubles"]},
        },
        {
            Name: "Rugby",
            boolTypes: {positions: ["front row forward", "second row forward", "back row forward", "half back", "three quarters", "full back"]},
            Skills,
        },
        {
            Name: "Running",
            boolTypes: {distances: ["5K", "7K", "10K", "15K"]},
            Skills: runningSkills,
            nGenders: 3
        },
        {
            Name: "Sailboat racing",
            boolTypes: {types: ["laser", "420", "470", "cat", "snipe", "opti","comet"].sort()},
        },
        {
            Name: "Soccer",
            boolTypes: {positions: ["goalie", "defense", "midfield", "forward", "wing"]},
            Skills,
        },
        {
            Name: "Softball",
            boolTypes: {
                positions: ["infield", "outfield", "pitcher", "catcher"],
                types: ["12-inch", "16-inch"],
            },
            Skills,
        },
        {
            Name: "Squash",
            boolTypes: {["ball"]: ["blue dot", "red dot", "yellow dot", "double yellow dot", "orange dot"]},
            Skills,
        },
        {
            Name: "Tennis",
            boolTypes: {["sizes and positions"]: ["singles", "doubles - deuce side", "doubles - ad side", "Canadian doubles"]},
            Skills: ["1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0"],
        },
        {
            Name: "Ultimate",
            boolTypes: {positions: ["cutter", "handler"]},
        },
        {
            Name: "Volleyball",
            boolTypes: {
                positions: ['setter', 'middle', 'right side', 'outside', 'libero'],
                ["team size"]: ['2s', '4s', '6s'],
            },
            Skills,
        },
    ],
};
