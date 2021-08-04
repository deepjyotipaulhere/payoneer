import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

export default function WeatherCard({ onSelect, temperature, date, unit, selected }) {
    return (
        <Card onClick={onSelect} style={selected ? { backgroundColor: 'skyblue', color: 'white' } : { cursor: 'pointer' }}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {date}
                </Typography>
                <Typography variant="h5" component="h2">
                    {temperature} &deg;{unit}
                </Typography>
                <Typography color="textSecondary">
                    Average Temperature
                </Typography>
            </CardContent>
        </Card >
    )
}
