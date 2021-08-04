import React from 'react'
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis, Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { EventTracker } from '@devexpress/dx-react-chart';

export default function WeatherChart({ currentCard, currentDate }) {
    return (
        <Chart
            data={currentCard}
        >
            <ArgumentAxis />
            <ValueAxis max={7} />

            <BarSeries
                valueField="temp"
                argumentField="date"
            />
            <Title text={`Weather prediction for ${new Date(currentDate).toDateString()}`} />
            <Animation />
            <EventTracker />
            <Tooltip />
        </Chart>
    )
}
