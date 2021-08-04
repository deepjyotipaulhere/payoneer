import React, { useEffect, useState } from 'react'
import { Skeleton } from '@material-ui/lab'
import { AppBar, Button, Container, FormControl, Toolbar, Typography, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/WbSunny';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import 'swiper/swiper.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper'
import WeatherCard from './components/WeatherCard';
import _ from 'lodash'
import WeatherChart from './components/WeatherChart';
import { ArrowBackOutlined, ArrowForwardOutlined } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { weatherActions } from './store';

SwiperCore.use([Navigation]);
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

function Header() {
	const classes = useStyles();
	return (
		<AppBar position="static" color='primary'>
			<Toolbar>
				{/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> */}
				<MenuIcon className={classes.menuButton} htmlColor='gold' />
				{/* </IconButton> */}
				<Typography variant="h6" className={classes.title}>
					Payoneer WeatherApp
				</Typography>
			</Toolbar>
		</AppBar>
	)
}


export default function App() {
	const dispatch = useDispatch()

	const { loading, weather, unit } = useSelector(store => store)

	const [currentCard, setCurrentCard] = useState(null)
	const [currDate, setCurrDate] = useState(null)
	const [selectedCard, setSelectedCard] = useState(null)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [end, setEnd] = useState(false)

	useEffect(() => {
		getAndSetWeather()
	}, [])

	const getAndSetWeather = () => {
		axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Kolkata,in&APPID=75f972b80e26f14fe6c920aa6a85ad57&cnt=40").then(response => {
			dispatch(weatherActions.setWeather(_(response.data.list).groupBy(x => x.dt_txt.split(" ")[0]).map((items, dt) => {
				return {
					dt: dt,
					temps: _.map(items)
				}
			}).value()))
			dispatch(weatherActions.completeLoading())
		})
	}

	const handleUnitChange = (e) => {
		dispatch(weatherActions.setUnit(e.target.value))
	}

	const setCurrentWeather = (w, i) => {
		setCurrDate(w.temps[0].dt_txt.split(" ")[0])
		setCurrentCard(w.temps.map(t => {
			return {
				date: t.dt_txt.split(" ")[1],
				temp: convertTemp(t.main.temp)
			}
		}))
		setSelectedCard(i)
	}

	const convertTemp = (temp) => {
		switch (unit) {
			case 'F':
				return temp * 9 / 5 - 459.67
			case 'C':
				return temp - 273.15
			default:
				break;
		}
	}

	return (
		<>
			<Header />
			<Container>
				{loading ? <>

					<h2>Loading...</h2>
					<Skeleton variant='text' /></> :
					<>
						<FormControl component="fieldset">
							<RadioGroup aria-label="gender" name="gender1" value={unit} onChange={handleUnitChange} row>
								<FormControlLabel value="C" control={<Radio />} label="Celcius" />
								<FormControlLabel value="F" control={<Radio />} label="Farenheit" />
							</RadioGroup>
						</FormControl>
						<br />
						<Button id="prevBtn" color='primary' variant='contained' disabled={currentIndex === 0}>
							<ArrowBackOutlined />
						</Button>

						<Button id="nextBtn" color='primary' variant='contained' style={{ float: 'right' }} disabled={end}>
							<ArrowForwardOutlined />
						</Button>
						<Swiper
							navigation={{
								prevEl: "#prevBtn",
								nextEl: '#nextBtn'
							}}
							spaceBetween={10}
							slidesPerView={3}
							onSlideChange={() => console.log('slide change')}
							onSwiper={(swiper) => console.log(swiper)}
							onActiveIndexChange={index => setCurrentIndex(index.activeIndex)}
							onReachEnd={() => setEnd(true)}
							onFromEdge={() => setEnd(false)}
						>
							{
								weather.map((w, i) => (
									<SwiperSlide style={{ padding: '5px' }}>
										<WeatherCard
											key={i}
											unit={unit}
											date={new Date(w.dt).toDateString()}
											temperature={convertTemp(w.temps.map(t => t.main.temp).reduce((a, b) => a + b) / w.temps.length).toFixed(2)}
											onSelect={() => setCurrentWeather(w, i)}
											selected={selectedCard === i}
											style={selectedCard === i ? { backgroundColor: 'skyblue', color: 'white' } : { cursor: 'pointer' }} />

									</SwiperSlide>
								))
							}

						</Swiper>
						{currentCard && <WeatherChart currentCard={currentCard} currentDate={currDate} />}
					</>}
			</Container>
		</>
	)
}
