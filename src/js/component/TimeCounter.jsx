import React from "react";

// per-number active segment data for 7-segment digits
const ACTIVE_SEGMENTS = [
	/* T     TL    TR    M     BL    BR    B     */
	[true, true, true, false, true, true, true],
	[false, false, true, false, false, true, false],
	[true, false, true, true, true, false, true],
	[true, false, true, true, false, true, true],
	[false, true, true, true, false, true, false],
	[true, true, false, true, false, true, true],
	[true, true, false, true, true, true, true],
	[true, false, true, false, false, true, false],
	[true, true, true, true, true, true, true],
	[true, true, true, true, false, true, true]
]

const
	PRESET_VALUES = [
		{
			millis: 3600000,
			max: 356400000,
			size: 99,
			rest: 100
		},
		{
			millis: 60000,
			max: 3540000,
			size: 59,
			rest: 60
		},
		{
			millis: 1000,
			max: 59000,
			size: 59,
			rest: 60
		}];

const TIME_MAX = 399999000;

const
	BUTTON_ENUM = { PAUSE: 0, START_FWD: 1, START_BWD: 2, STOP: 3, RESET: 4 },
	STATE_ENUM = { RUNNING: 0, PAUSED: 1, STOPPED: 2, RESET: 3 }

const Separator = ({ active = true, type }) => {
	const classNameColon = active ? "sz-separator sz-skew" : "sz-separator sz-skew invisible";
	return type === "decimal" ? (
		<div className="sz-separator sz-skew">
			<svg viewBox="0 0 30 100" width="100%" height="100%" fill="#FF0000FF">
				<rect x="10" y="85" width="10" height="10" />
			</svg>
		</div>
	) : (
		<div className={classNameColon}>
			<svg viewBox="0 0 30 100" width="100%" height="100%" fill="#FF0000FF">
				<rect x="10" y="30" width="10" height="10" />
				<rect x="10" y="60" width="10" height="10" />
			</svg>
		</div>
	);
}

const Digit = ({ value }) => {

	const colors = [];
	for (let i = 0; i < 7; i++) {
		colors.push(`#FF0000${ACTIVE_SEGMENTS[value][i] ? "FF" : "10"}`);
	}

	return (
		<div className="sz-digit">
			<svg viewBox="0 0 70 100" width="100%" height="100%">
				<polygon points="15,15 10,10 15,5 55,5 60,10 55,15" fill={colors[0]} />
				<polygon points="5,20 10,15 15,20 15,45 10,49 5,45" fill={colors[1]} />
				<polygon points="55,20 60,15 65,20 65,45 60,49 55,45" fill={colors[2]} />
				<polygon points="20,45 15,50 20,55 50,55 55,50 50,45" fill={colors[3]} />
				<polygon points="5,55 10,51 15,55 15,80 10,85 5,80" fill={colors[4]} />
				<polygon points="55,55 60,51 65,55 65,80 60,85 55,80" fill={colors[5]} />
				<polygon points="15,95 10,90 15,85 55,85 60,90 55,95" fill={colors[6]} />
			</svg>
		</div>
	);
}

const DigitPair = ({ value, name }) => {

	return (
		<>
			<div className="m-0 p-0">
				<div className="d-flex sz-skew m-0 p-0">
					<Digit key={`${name}-0`} value={Math.floor(value * .1)} />
					<Digit key={`${name}-1`} value={value % 10} />
				</div>
				<p className="sz-pairinfo m-0 p-0">{name}</p>
			</div>
		</>
	);
}

const Timer = ({ value, running }) => {

	const
		d = Math.floor(value * .1) % 100,
		s = Math.floor(value * .001) % 60,
		m = Math.floor(value / 60000) % 60,
		h = Math.floor(value / 3600000) % 100,
		colonActive = !running || s % 2 == 0;

	return (
		<>
			<DigitPair value={h} name="hours" />
			<Separator active={colonActive} />
			<DigitPair value={m} name="minutes" />
			<Separator active={colonActive} />
			<DigitPair value={s} name="seconds" />
			<Separator type="decimal" />
			<DigitPair value={d} name="centis" />
		</>
	);
}

const Button = ({ label, pressed, callback, btnid }) => {

	const classNames = `m-0 p-0 text-center fw-bold sz-button ${pressed ? "sz-button-pressed" : ""}`;

	return (
		<div className={classNames}>
			<button onClick={() => callback(btnid)}></button>
			<p>{label}</p>
		</div>
	)
}

const TimeCounter = () => {

	const
		[zero, setZero] = React.useState(0),
		[state, setState] = React.useState(STATE_ENUM.STOPPED),
		[forward, setForward] = React.useState(false),
		[setupValue, setSetupValue] = React.useState(null),
		[preset, setPreset] = React.useState(0),
		[time, setTime] = React.useState(zero);

	// TIME UPDATE
	React.useEffect(() => {
		if (state == STATE_ENUM.RUNNING) {
			let result = time;
			if (forward) {
				result = Math.min(Date.now() - zero, TIME_MAX);
				if (result == TIME_MAX) setState(STATE_ENUM.STOPPED);
			}
			else {
				result = Math.max(preset - (Date.now() - zero), 0);
				if (result == 0) setState(STATE_ENUM.STOPPED);
			}
			setTimeout(() => { setTime(result); }, 16); // 60 fps
		}
	}, [time, state]);

	// INITIAL VALUE SETUP
	React.useEffect(() => {
		if (setupValue) {

			if (state > STATE_ENUM.RUNNING) setTime(0);

			const
				{ millis, max, size, rest } = PRESET_VALUES[setupValue[0]],
				sum = setupValue[1],
				units = Math.floor(preset / millis) % rest;

			let value;

			if (units == size && sum) value = -max;
			else if (units == 0 && !sum) value = max;
			else value = millis * (sum ? 1 : -1);

			setPreset(preset + value);
			setSetupValue(null);
		}
	}, [setupValue]);

	const setupButton = ["H+", "H-", "M+", "M-", "S+", "S-"];
	const actionButton = [
		{
			label: "pause",
			pressed: false,
			btnid: BUTTON_ENUM.PAUSE
		},
		{
			label: "start up",
			pressed: state < STATE_ENUM.STOPPED,
			btnid: BUTTON_ENUM.START_FWD
		},
		{
			label: "start down",
			pressed: state < STATE_ENUM.STOPPED,
			btnid: BUTTON_ENUM.START_BWD
		},
		{
			label: "stop",
			pressed: state > STATE_ENUM.STOPPED,
			btnid: BUTTON_ENUM.STOP
		},
		{
			label: "reset",
			pressed: false,
			btnid: BUTTON_ENUM.RESET
		}
	];

	const onSetupButtonClicked = (btnid) => {
		setSetupValue([Math.floor(btnid / 2), btnid % 2 == 0]);
	}

	const onActionButtonClicked = (btnid) => {

		if (btnid == BUTTON_ENUM.PAUSE) {
			if (state == STATE_ENUM.RUNNING) setState(STATE_ENUM.PAUSED);
			else if (state == STATE_ENUM.PAUSED) {
				setState(STATE_ENUM.RUNNING);
				setZero(Date.now() - time);
			}
		}
		else {
			if (btnid == BUTTON_ENUM.START_FWD) {
				setState(STATE_ENUM.RUNNING);
				setForward(true);
				setZero(Date.now());
				setTime(0);
			}
			else if (btnid == BUTTON_ENUM.START_BWD) {
				setState(STATE_ENUM.RUNNING);
				setForward(false);
				setZero(Date.now());
				if (preset == 0) {
					setPreset(300000); // 5 min
					setTime(300000);
				}
				else setTime(preset);
			}
			else if (btnid == BUTTON_ENUM.STOP) setState(STATE_ENUM.STOPPED);
			else if (btnid == BUTTON_ENUM.RESET) {
				if (state == STATE_ENUM.PAUSED) setState(STATE_ENUM.STOPPED);
				else if (state == STATE_ENUM.STOPPED) setState(STATE_ENUM.RESET);
				else if (state == STATE_ENUM.RESET) setPreset(0);
				setZero(Date.now());
				setTime((state == STATE_ENUM.RUNNING && !forward) ? (preset > 0 ? preset : 300000) : 0);
			}
		}
	}

	return (
		<div className="sz-device">
			<div className="d-flex justify-content-center sz-counter text-end user-select-none">
				<Timer value={time + preset} running={state == STATE_ENUM.RUNNING} />
			</div>
			<div className="d-flex justify-content-between sz-setuppanel">
				{
					setupButton.map((e, idx) =>
						<Button key={`${e}-${idx}`} label={e} callback={onSetupButtonClicked} btnid={idx} />
					)
				}
			</div>
			<div className="d-flex justify-content-evenly sz-buttonpanel">
				{
					actionButton.map((e, idx) =>
						<Button key={`${e.label}-${idx}`} label={e.label} pressed={e.pressed} callback={onActionButtonClicked} btnid={e.btnid} />
					)
				}
			</div>
		</div>
	);
}

export default TimeCounter;