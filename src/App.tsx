import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import SettingsModal from './SettingsModal';
import WorkoutHistoryModal from './WorkoutHistoryModal';

const App: React.FC = () => {
  const [workTime, setWorkTime] = useState(10);
  const [restTime, setRestTime] = useState(5);
  const [exercises, setExercises] = useState(20);
  const [rounds, setRounds] = useState(1);
  const [roundResetTime, setRoundResetTime] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<
    'work' | 'rest' | 'exercises' | 'rounds' | 'roundReset'
  >();

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<
    'work' | 'rest' | 'roundReset'
  >('work');
  const [currentExercise, setCurrentExercise] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const tickSound = new Audio('/exercises-timer/beep.mp3');
  const countdownSound = new Audio('/exercises-timer/321.m4a');

  const totalTime = useMemo(() => {
    if (currentPhase === 'work') return workTime;
    if (currentPhase === 'rest') return restTime;
    return roundResetTime;
  }, [currentPhase, workTime, restTime, roundResetTime]);

  const handleOpenModal = (
    setting: 'work' | 'rest' | 'exercises' | 'rounds' | 'roundReset'
  ) => {
    setCurrentSetting(setting);
    setShowModal(true);
  };

  const displayTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const initialValue = useMemo(() => {
    switch (currentSetting) {
      case 'work':
        return workTime;
      case 'rest':
        return restTime;
      case 'exercises':
        return exercises;
      case 'rounds':
        return rounds;
      case 'roundReset':
        return roundResetTime;
      default:
        return 0;
    }
  }, [currentSetting, workTime, restTime, exercises, rounds, roundResetTime]);

  useEffect(() => {
    let interval = null;

    if (isRunning && !isPaused && timer > 0) {
      interval = setInterval(() => {
        if (timer === 4) countdownSound.play();
        if (timer === 1) tickSound.play();
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isRunning && !isPaused) {
      if (currentPhase === 'work') {
        if (currentExercise < exercises) {
          setCurrentPhase('rest');
          setTimer(restTime);
        } else {
          setCurrentPhase('roundReset');
          setTimer(roundResetTime);
        }
      } else if (currentPhase === 'rest') {
        setCurrentPhase('work');
        setCurrentExercise((prev) => prev + 1);
        setTimer(workTime);
      } else if (currentPhase === 'roundReset') {
        if (currentRound < rounds) {
          setCurrentPhase('work');
          setCurrentExercise(1);
          setCurrentRound((prev) => prev + 1);
          setTimer(workTime);
        } else {
          setIsRunning(false);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isRunning,
    timer,
    currentPhase,
    currentRound,
    workTime,
    restTime,
    rounds,
    isPaused,
    roundResetTime,
    tickSound,
    currentExercise,
    exercises,
  ]);

  const saveSessionToHistory = () => {
    const sessionData = {
      workTime,
      restTime,
      exercises,
      rounds,
      roundResetTime,
      completedAt: new Date().toISOString(),
    };
    const storedHistory = localStorage.getItem('workoutHistory');
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.push(sessionData);
    localStorage.setItem('workoutHistory', JSON.stringify(history));
  };
  
  useEffect(() => {
    if (isRunning && timer === 0 && currentPhase === 'roundReset' && currentRound === rounds) {
      saveSessionToHistory(); // Save the session to history
      setIsRunning(false);
    }
  }, [isRunning, timer, currentPhase, currentRound, rounds]);

  const handleStart = () => {
    setIsRunning(true);
    setCurrentPhase('work');
    setCurrentRound(1);
    setTimer(workTime);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhase('work');
    setCurrentExercise(1);
    setCurrentRound(1);
    setTimer(workTime);
  };

  const progress = (timer / totalTime) * 100;
  const strokeDashoffset = 283 - (progress / 100) * 283;

  return (
    <Container>
      <TimerSection>
        <PhaseDisplay>
          {currentPhase === 'work'
            ? 'Work'
            : currentPhase === 'rest'
            ? 'Rest'
            : 'Round Reset'}
        </PhaseDisplay>
        <RoundDisplay>
          Round: {currentRound}/{rounds}, Exercise: {currentExercise}/
          {exercises}
        </RoundDisplay>
        <CircularTimer>
          <svg width="200" height="200" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f2f2f2ee"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={
                currentPhase === 'work'
                  ? '#85dfa7'
                  : currentPhase === 'rest'
                  ? '#d34659'
                  : '#ebcf76'
              }
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <TimeDisplay>{displayTime(timer)}</TimeDisplay>
        </CircularTimer>
        {/* Display "Pause" and "Reset" buttons when the timer is running */}
        {isRunning ? (
          <ButtonGroup>
            <PauseButton onClick={handlePause}>
              {isPaused ? 'Resume' : 'Pause'}
            </PauseButton>
            <ResetButton onClick={handleReset}>Reset</ResetButton>
          </ButtonGroup>
        ) : (
          <PlayButton onClick={handleStart}>Start</PlayButton>
        )}
      </TimerSection>
      {!isRunning && (
        <SettingsSection>
          <SettingItem
            onClick={() => handleOpenModal('work')}
            bgColor="#EAFBF1"
          >
            <SettingText>Work</SettingText>
            <SettingValue color="#85dfa7">{displayTime(workTime)}</SettingValue>
          </SettingItem>
          <SettingItem
            onClick={() => handleOpenModal('rest')}
            bgColor="#FCEAEA"
          >
            <SettingText>Rest</SettingText>
            <SettingValue color="#d34659">{displayTime(restTime)}</SettingValue>
          </SettingItem>
          <SettingItem
            onClick={() => handleOpenModal('exercises')}
            bgColor="#F0F0F0"
          >
            <SettingText>Exercises</SettingText>
            <SettingValue color="#b1b1b1">{exercises}</SettingValue>
          </SettingItem>
          <SettingItem
            onClick={() => handleOpenModal('rounds')}
            bgColor="#E8E9FC"
          >
            <SettingText>Rounds</SettingText>
            <SettingValue color="#6b7ce5">{rounds}x</SettingValue>
          </SettingItem>
          <SettingItem
            onClick={() => handleOpenModal('roundReset')}
            bgColor="#FFF7E5"
          >
            <SettingText>Round Reset</SettingText>
            <SettingValue color="#ebcf76">
              {displayTime(roundResetTime)}
            </SettingValue>
          </SettingItem>
          <SettingItem
            onClick={() => setShowHistoryModal(true)}
            bgColor="#F0F0F0"
          >
            <SettingText>History</SettingText>
          </SettingItem>
        </SettingsSection>
      )}

      {showModal && (
        <SettingsModal
          setting={currentSetting}
          initialValue={initialValue}
          onClose={() => setShowModal(false)}
          onSave={(value) => {
            switch (currentSetting) {
              case 'work':
                setWorkTime(value);
                break;
              case 'rest':
                setRestTime(value);
                break;
              case 'exercises':
                setExercises(value);
                break;
              case 'rounds':
                setRounds(value);
                break;
              case 'roundReset':
                setRoundResetTime(value);
                break;
            }
            setShowModal(false);
          }}
        />
      )}

      {showHistoryModal && (
        <WorkoutHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </Container>
  );
};

export default App;

const Container = styled.div<{ bgColor?: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, #0061ff, #60efff);
`;

const CircularTimer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(-90deg);
  }
`;

const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-bottom: 20px;
`;

const PhaseDisplay = styled.div`
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
`;

const RoundDisplay = styled.div`
  font-size: 20px;
  color: white;
  margin-top: 10px;
`;

const TimeDisplay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  color: #fff;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
`;

const PlayButton = styled.button`
  margin-top: 40px;
  width: 100px;
  height: 100px;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  color: #f06;
  background: white;
  border: 1px solid white;
  border-radius: 50%;
  cursor: pointer;
`;

const PauseButton = styled.button`
  width: 70px;
  height: 70px;
  font-size: 18px;
  background-color: #f06;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid white;
  border-radius: 50%;
  cursor: pointer;
`;

const ResetButton = styled.button`
  width: 70px;
  height: 70px;
  font-size: 18px;
  background-color: #bbb;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid white;
  border-radius: 50%;
  cursor: pointer;
`;

const SettingsSection = styled.div`
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 10px;
  padding-top: 40px;
  padding-bottom: 20px;
`;

const SettingItem = styled.div<{ bgColor: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 10px;
  height: 100px;
  background: ${(props) => props.bgColor};
`;

const SettingText = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: left;
`;

const SettingValue = styled.div<{ color?: string }>`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.color || '#333'};
  text-align: right;
  padding-right: 10px;
`;
