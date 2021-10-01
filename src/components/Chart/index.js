import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
    ResponsiveContainer,
    Label,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

// Generate Sales Data
function createData(time, amount) {
    return { time, amount };
}

// Generate Sales Data
function createDataProfit(time, profit) {
    return { time, profit };
}

const data = [
    createData('00:00', 0),
    createData('03:00', 300),
    createData('06:00', 600),
    createData('09:00', 800),
    createData('12:00', 1500),
    createData('15:00', 2000),
    createData('18:00', 2400),
    createData('21:00', 2400),
    createData('24:00', 0),
];

export function Chart(props) {
    const theme = useTheme();
    const rows = countFreq(props.rows);

    function countFreq(arr) {
        let a = [], b = [], prev;
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].orderedDate.includes(prev)) {
                a.push(arr[i].orderedDate.slice(0, 10));
                b.push(1);
            } else {
                b[b.length - 1]++;
            }
            prev = arr[i].orderedDate.slice(0, 10);
        }
        // console.log([a, b])
        let result = [];
        for (let i = 0; i < a.length; i++) {
            result.push(createData(a[i], b[i]))
        }
        // console.log(result)
        return result;
    }

    return (
        <React.Fragment>
            <center><h2>Total orders per day</h2></center>
            <ResponsiveContainer>
                <LineChart
                    data={rows}
                    margin={{
                        top: 16,
                        right: 16,
                        left: 24,
                        bottom: 0
                    }}
                >
                    <CartesianGrid strokeDasharray="10 10" />
                    <XAxis dataKey="time" />
                    <YAxis >
                        <Label
                            angle={270}
                            position="left"
                            style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                        >
                            Orders
                        </Label>
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" dot={true} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}

export function ChartProfit(props) {
    const theme = useTheme();
    const rowsProfit = countProfit(props.rows);

    function countProfit(arr) {
        let a = [], b = [], prev;
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].orderedDate.includes(prev)) {
                a.push(arr[i].orderedDate.slice(0, 10));
                if (arr[i].status === 1)
                    b.push(Math.round(arr[i].totalPrice * 100) / 100);
                else
                    b.push(0);
            } else {
                if (arr[i].status === 1) {
                    b[b.length - 1] = Math.round((b[b.length - 1] + arr[i].totalPrice) * 100) / 100;
                }
            }
            prev = arr[i].orderedDate.slice(0, 10);
        }
        // console.log([a, b])
        let result = [];
        for (let i = 0; i < a.length; i++) {
            result.push(createDataProfit(a[i], b[i]))
        }
        // console.log(result)
        return result;
    }

    return (
        <React.Fragment>
            <center><h2>Total profit($) per day</h2></center>
            <ResponsiveContainer>
                <BarChart
                    data={rowsProfit}
                    margin={{
                        top: 16,
                        right: 16,
                        left: 24,
                        bottom: 0
                    }}
                >
                    <CartesianGrid strokeDasharray="10 10" />
                    <XAxis dataKey="time" />
                    <YAxis >
                        <Label
                            angle={270}
                            position="left"
                            style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                        >
                            $
                        </Label>
                    </YAxis>
                    <Tooltip />
                    <Bar dataKey="profit" fill="#FEAC72" />
                </BarChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}