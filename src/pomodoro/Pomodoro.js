import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import InitialState from "./InitialState.js";
import ActiveState from "./ActiveState.js";
import { minutesToDuration, secondsToDuration } from "../utils/duration";
import playAudio from "./PlayAudio.js";

function Pomodoro() {
  //Initialize timer data and state
  const initialTimerData = {
    isTimerRunning: false,
    inSession: false,
    isBreak: false,
    playing: false,
    focusDuration: 25,
    breakDuration: 5,
    timeRemaining: 1500, //(25 min * 60 sec as default)
    elapsedValue: 0,
  };

  const [timerData, setTimerData] = useState({ ...initialTimerData });

  //Format durations for display
  const formattedDurations = {
    focusMinutes: minutesToDuration(timerData.focusDuration),
    focusSeconds: secondsToDuration(timerData.focusDuration * 60),
    breakMinutes: minutesToDuration(timerData.breakDuration),
    breakSeconds: secondsToDuration(timerData.breakDuration * 60),
    timer: secondsToDuration(timerData.timeRemaining),
  };

  //Timer regulation
  if (timerData.inSession) {
    //Focus or break ends
    if (!timerData.isBreak && timerData.timeRemaining <= 0) {
      setTimerData({
        ...timerData,
        playing: true,
        isBreak: true,
        timeRemaining: timerData.breakDuration * 60,
      });
    } else if (timerData.isBreak && timerData.timeRemaining <= 0) {
      setTimerData({
        ...timerData,
        playing: true,
        isBreak: false,
        timeRemaining: timerData.focusDuration * 60,
      });
    }

    //Play notification ding when alarm finishes, reset ding status
    if (timerData.playing) {
      playAudio();

      setTimerData({
        ...timerData,
        playing: false,
      }); 
    }
  }

  //Set useInterval to reduce time remaining by 1 second
  useInterval(
    () => {
      setTimerData({
        ...timerData,
        timeRemaining: timerData.timeRemaining - 1,
        totalRemaining: timerData.totalRemaining - 1,
      });
    },
    timerData.isTimerRunning ? 1000 : null
  );

  return (
    <div className="pomodoro">
      <InitialState
        initialTimerData={initialTimerData}
        timerData={timerData}
        setTimerData={setTimerData}
        formattedDurations={formattedDurations}
      />
      <ActiveState
        timerData={timerData}
        setTimerData={setTimerData}
        formattedDurations={formattedDurations}
      />
      <audio id="notification" src=".\audio\ding.mp3"></audio>
    </div>
  );
}

export default Pomodoro;
