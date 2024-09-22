import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

interface WorkoutHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkoutHistoryModal: React.FC<WorkoutHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [history, setHistory] = useState<any[]>([]);
  useEffect(() => {
    if (isOpen) {
      const storedHistory = localStorage.getItem('workoutHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        setHistory([]);
      }
    }
  }, [isOpen]);

  const displayTotalTime = ({ workTime, restTime, exercises, rounds }: {
    workTime: number,
    restTime: number,
    exercises: number,
    rounds: number
  }) => {
    const totalTime = (workTime + restTime) * exercises * rounds;
    return `${Math.floor(totalTime / 60)}m ${totalTime % 60}s`;
  }

  return (
    <Modal
      isOpen={!!isOpen}
      onRequestClose={onClose}
      contentLabel="History"
      ariaHideApp={false}
    >
      <ModalContent>
        <ModalHeader>
          <h2>Workout History</h2>
          <CloseButton onClick={onClose}>✖️</CloseButton>
        </ModalHeader>

        {history.length > 0 ? (
          <HistoryList>
            {history.map((session, index) => (
              <HistoryItem key={index}>
                <TopRow>
                  <DateWrapper>
                    <DateText>{new Date(session.completedAt).toLocaleString()}</DateText>
                  </DateWrapper>
                  <TotalTime>{displayTotalTime(session)}</TotalTime>
                </TopRow>
                <DetailsRow>
                  <DetailsItem>
                    <ItemLabel>Work</ItemLabel>
                    <ItemValue>
                      {session.workTime} <small>s</small>
                    </ItemValue>
                  </DetailsItem>
                  <DetailsItem>
                    <ItemLabel>Rest</ItemLabel>
                    <ItemValue>
                      {session.restTime} <small>s</small>
                    </ItemValue>
                  </DetailsItem>
                  <DetailsItem>
                    <ItemLabel>Exercises</ItemLabel>
                    <ItemValue>{session.exercises}</ItemValue>
                  </DetailsItem>
                  <DetailsItem>
                    <ItemLabel>Rounds</ItemLabel>
                    <ItemValue>{session.rounds}</ItemValue>
                  </DetailsItem>
                </DetailsRow>
              </HistoryItem>
            ))}
          </HistoryList>
        ) : (
          <p>No workout history available</p>
        )}

        <SaveButton onClick={onClose}>Close</SaveButton>

        <ClearButton onClick={() => {
          localStorage.removeItem('workoutHistory');
          setHistory([]);
        }}>
          Clear History
        </ClearButton>
      </ModalContent>
    </Modal>
  );
};

export default WorkoutHistoryModal;

// Styled components
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f06;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
`;

const HistoryList = styled.div`
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-content: center;
  justify-content: center;
  margin: 40px;
  padding: 10px;
`;

const HistoryItem = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #333;
`;

const DateText = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
`;

const TotalTime = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #d34659;
`;

const LoadButton = styled.button`
  width: 100%;
  padding: 10px 0;
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  cursor: pointer;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const DetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DetailsItem = styled.div`
  text-align: center;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  color: #888;
`;

const ItemValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #d34659;
`;

const ClearButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f06;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
`;