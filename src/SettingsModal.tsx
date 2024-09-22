import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

interface SettingsModalProps {
  setting: 'work' | 'rest' | 'exercises' | 'rounds' | 'roundReset' | undefined;
  onClose: () => void;
  onSave: (value: number) => void;
  initialValue: number; 
}

const SettingsModal: React.FC<SettingsModalProps> = ({ setting, onClose, onSave, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    if (isNaN(value) || value < 0) {
      alert("Please enter a valid value.");
    } else {
      onSave(value);
      onClose();
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) {
      return;
    }
    setValue(parseInt(e.target.value) * 60 + (value % 60));
  }

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeconds = parseInt(e.target.value);
    if (newSeconds >= 0 && newSeconds < 60) {
      setValue(Math.floor(value / 60) * 60 + newSeconds);
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value);
    if (newAmount >= 0) {
      setValue(newAmount);
    }
  };

  return (
    <ModalCustom isOpen={!!setting} onRequestClose={onClose} contentLabel="Edit Setting" ariaHideApp={false}>
      <ModalContent>
        <ModalHeader>
          <h2>{setting === 'exercises' || setting === 'rounds' ? 'Enter Amount' : 'Enter Time'}</h2>
          <CloseButton onClick={onClose}>✖️</CloseButton>
        </ModalHeader>
        <Container>
          {/* For work, rest, or round reset, show minutes and seconds inputs */}
          {setting === 'work' || setting === 'rest' || setting === 'roundReset' ? (
            <>
              <div>
                <Label>Minutes</Label>
                <Input
                  type="number"
                  min="0"
                  value={Math.floor(value / 60)}
                  onChange={handleMinutesChange}
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
              <div>
                <Label>Seconds</Label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={value % 60}
                  onChange={handleSecondsChange}
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
            </>
          ) : (
            // For exercises or rounds, just a simple input
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                min="0"
                value={value}
                onChange={handleAmountChange}
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
          )}
        </Container>
        <SaveButton onClick={handleSave}>OK</SaveButton>
      </ModalContent>
    </ModalCustom>
  );
};

export default SettingsModal;

const ModalCustom = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  height: auto;
  max-height: 400px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  background: white;
`;


const ModalContent = styled.div`
  padding: 20px;
  background: white;
  border-radius: 10px;
  margin: auto;
  text-align: center;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const Label = styled.div`
  font-size: 14px;
  margin-top: 10px;
`;

const Input = styled.input`
  font-size: 24px;
  padding: 10px;
  margin: 10px 0;
  width: 80px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
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
