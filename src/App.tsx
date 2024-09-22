import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import SettingsModal from './SettingsModal';

const App: React.FC = () => {
  const [workTime, setWorkTime] = useState(10);
  const [restTime, setRestTime] = useState(5);
  const [exercises, setExercises] = useState(20);
  const [rounds, setRounds] = useState(1);
  const [roundResetTime, setRoundResetTime] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<'work' | 'rest' | 'exercises' | 'rounds' | 'roundReset'>();

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'work' | 'rest' | 'roundReset'>('work');
  const [currentRound, setCurrentRound] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const tickSound = new Audio('/beep.mp3'); // Path to your tick sound

  const totalTime = useMemo(() => {
    if (currentPhase === 'work') return workTime;
    if (currentPhase === 'rest') return restTime;
    return roundResetTime;
  }, [currentPhase, workTime, restTime, roundResetTime]);

  const handleOpenModal = (setting: 'work' | 'rest' | 'exercises' | 'rounds' | 'roundReset') => {
    setCurrentSetting(setting);
    setShowModal(true);
  };

  const displayTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

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

  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isRunning && !isPaused && timer > 0) {
      interval = setInterval(() => {
        // Play sound on every tick
        tickSound.play().catch((error) => {
          console.error("Error playing sound: ", error);
        });
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isRunning && !isPaused) {
      // Handle the end of the current phase
      if (currentPhase === 'work') {
        // Move to the rest phase after work
        setCurrentPhase('rest');
        setTimer(restTime);
      } else if (currentPhase === 'rest') {
        // If rounds are remaining, go to the round reset phase
        if (currentRound < rounds) {
          setCurrentPhase('roundReset');
          setTimer(roundResetTime);
        } else {
          // All rounds completed, stop the timer
          setIsRunning(false);
        }
      } else if (currentPhase === 'roundReset') {
        // After round reset, return to work and increment the round count
        setCurrentPhase('work');
        setCurrentRound((prevRound) => prevRound + 1);
        setTimer(workTime);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timer, currentPhase, currentRound, workTime, restTime, rounds, isPaused, roundResetTime, tickSound]);

  const handleStart = () => {
    setIsRunning(true);
    setCurrentPhase('work');
    setCurrentRound(1);
    setTimer(workTime);
  }

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhase('work');
    setCurrentRound(1);
    setTimer(workTime);
  };

    // Progress calculation
    const progress = (timer / totalTime) * 100;
    const strokeDashoffset = 283 - (progress / 100) * 283; // 283 is the circumference of the circle
  

  return (
    <Container>
      <TimerSection>
        <PhaseDisplay>{currentPhase === 'work' ? 'Work' : currentPhase === 'rest' ? 'Rest' : 'Round Reset'}</PhaseDisplay>
        <RoundDisplay>Round: {currentRound}/{rounds}</RoundDisplay>
        <CircularTimer>
          <svg width="200" height="200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" 
            fill="none" 
            stroke="#f2f2f2ee" 
            strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={currentPhase === 'work' ? '#85dfa7' : currentPhase === 'rest' ? '#d34659' : '#ebcf76'}
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
            <PauseButton onClick={handlePause}>{isPaused ? 'Resume' : 'Pause'}</PauseButton>
            <ResetButton onClick={handleReset}>Reset</ResetButton>
          </ButtonGroup>
        ) : (
          <PlayButton onClick={handleStart}>Start</PlayButton>
        )}
      </TimerSection>
      <SettingsSection>
        <SettingItem onClick={() => handleOpenModal('work')} bgColor="#EAFBF1">
          <SettingText>Work</SettingText>
          <SettingValue color="#85dfa7">{displayTime(workTime)}</SettingValue>
        </SettingItem>
        <SettingItem onClick={() => handleOpenModal('rest')} bgColor="#FCEAEA">
          <SettingText>Rest</SettingText>
          <SettingValue color="#d34659">{displayTime(restTime)}</SettingValue>
        </SettingItem>
        <SettingItem onClick={() => handleOpenModal('exercises')} bgColor="#F0F0F0">
          <SettingText>Exercises</SettingText>
          <SettingValue color="#b1b1b1">{exercises}</SettingValue>
        </SettingItem>
        <SettingItem onClick={() => handleOpenModal('rounds')} bgColor="#E8E9FC">
          <SettingText>Rounds</SettingText>
          <SettingValue color="#6b7ce5">{rounds}x</SettingValue>
        </SettingItem>
        <SettingItem onClick={() => handleOpenModal('roundReset')} bgColor="#FFF7E5">
          <SettingText>Round Reset</SettingText>
          <SettingValue color="#ebcf76">{displayTime(roundResetTime)}</SettingValue>
        </SettingItem>
      </SettingsSection>

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
    transform: rotate(-90deg); // Rotate circle for top-start
  }
`;


const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
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