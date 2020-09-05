import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerLabel: "Session",
      timeInSeconds: 1500,
      running: false,
      intervalID: "",
    };
    this.clock = this.clock.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleBreakLength = this.handleBreakLength.bind(this);
    this.handleSessionLength = this.handleSessionLength.bind(this);
    this.handleLength = this.handleLength.bind(this);
    this.handleTimerType = this.handleTimerType.bind(this);
    this.audioWarning = this.audioWarning.bind(this);
  }

  clock() {
    let minutes = Math.floor(this.state.timeInSeconds / 60);
    let seconds = this.state.timeInSeconds - minutes * 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }

  handleReset() {
    if (this.state.running) {
      clearInterval(this.state.intervalID);
    }
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerLabel: "Session",
      timeInSeconds: 1500,
      running: false,
      intervalID: "",
    });
    this.audioWarn.pause();
    this.audioWarn.currentTime = 0;
  }

  handleStartStop() {
    this.setState({
      intervalID: !this.state.running
        ? (this.setState({ running: true }),
          setInterval(() => {
            this.setState({
              timeInSeconds: this.state.timeInSeconds - 1,
            });
            this.handleTimerType();
          }, 1000))
        : (this.setState({ running: false }),
          clearInterval(this.state.intervalID)),
    });
  }

  handleSessionLength(e) {
    this.handleLength(
      "sessionLength",
      e.currentTarget.value,
      this.state.sessionLength,
      "Session"
    );
  }

  handleBreakLength(e) {
    this.handleLength(
      "breakLength",
      e.currentTarget.value,
      this.state.breakLength,
      "Break"
    );
  }

  handleLength(lengthType, sign, lengthValue, timerType) {
    let time = this.state.timeInSeconds;
    if (this.state.running === true) return;
    if (this.state.timerLabel === timerType) {
      if (sign == "-" && lengthValue != 1) {
        this.setState({
          [lengthType]: lengthValue - 1,
          timeInSeconds: time - 60,
        });
      } else if (sign == "+" && lengthValue != 60) {
        this.setState({
          [lengthType]: lengthValue + 1,
          timeInSeconds: time + 60,
        });
      }
    } else {
      if (sign == "-" && lengthValue != 1) {
        this.setState({ [lengthType]: lengthValue - 1 });
      } else if (sign == "+" && lengthValue != 60) {
        this.setState({ [lengthType]: lengthValue + 1 });
      }
    }
  }

  handleTimerType() {
    let timer = this.state.timeInSeconds;
    this.audioWarning(timer);
    if (timer < 0) {
      this.state.timerLabel === "Session"
        ? this.setState({
            timerLabel: "Break",
            timeInSeconds: this.state.breakLength * 60,
          })
        : this.setState({
            timerLabel: "Session",
            timeInSeconds: this.state.breakLength * 60,
          });
    }
  }

  audioWarning(timer) {
    if (timer === 0) {
      this.audioWarn.play();
    }
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Clock</h1>
        <div className="general-container">
          <div>
            <Lengths
              length={this.state.breakLength}
              labelID="break-label"
              label="Break Length"
              decremID="break-decrement"
              incremID="break-increment"
              displayLen="break-length"
              handleLen={this.handleBreakLength}
            />
            <Lengths
              length={this.state.sessionLength}
              labelID="session-label"
              label="Session Length"
              decremID="session-decrement"
              incremID="session-increment"
              displayLen="session-length"
              handleLen={this.handleSessionLength}
            />
          </div>
          <div className="timer-container">
            <div id="timer-label">{this.state.timerLabel}</div>
            <div id="time-left">{this.clock()}</div>
            <button
              className="control-elem"
              id="start_stop"
              onClick={this.handleStartStop}
            >
              <i class="far fa-play-circle"></i>
              <i class="fa fa-pause" aria-hidden="true"></i>
            </button>
            <button
              id="reset"
              className="control-elem"
              onClick={this.handleReset}
            >
              <i class="fas fa-redo"></i>
            </button>
          </div>
        </div>
        <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ref={(audio) => {
            this.audioWarn = audio;
          }}
        />
        <footer>
          by{" "}
          <a
            href="https://codepen.io/sid2021"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            sid2021{" "}
          </a>
        </footer>
      </div>
    );
  }
}

class Lengths extends React.Component {
  render() {
    return (
      <div className="length-container">
        <div id={this.props.labelID}>{this.props.label}</div>
        <button
          className="control-elem"
          id={this.props.decremID}
          value="-"
          onClick={this.props.handleLen}
        >
          <i class="fas fa-angle-double-down" />
        </button>
        <div className="control-elem displ" id={this.props.displayLen}>
          {this.props.length}
        </div>
        <button
          className="control-elem"
          id={this.props.incremID}
          value="+"
          onClick={this.props.handleLen}
        >
          <i class="fas fa-angle-double-up" />
        </button>
      </div>
    );
  }
}

export default App;
