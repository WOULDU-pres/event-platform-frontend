import React from 'react';
import { Radio } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { AnswerOption as AnswerOptionType } from '../../types';
import styles from './AnswerOption.module.css';

export interface AnswerOptionProps {
  option: AnswerOptionType;
  isSelected: boolean;
  isDisabled?: boolean;
  showCorrectAnswer?: boolean;
  onSelect: (optionId: string) => void;
}

/**
 * AnswerOption component
 * Renders a single answer option for a quiz question
 */
const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  isSelected,
  isDisabled = false,
  showCorrectAnswer = false,
  onSelect
}) => {
  const handleSelect = () => {
    if (!isDisabled) {
      onSelect(option.id);
    }
  };
  
  // Determine if the answer is correct or incorrect when showing results
  const isCorrect = showCorrectAnswer && option.isCorrect;
  const isIncorrect = showCorrectAnswer && isSelected && !option.isCorrect;
  
  // Set appropriate class names based on state
  const optionClassName = `${styles.answerOption} ${
    isSelected ? styles.selected : ''
  } ${isCorrect ? styles.correct : ''} ${
    isIncorrect ? styles.incorrect : ''
  }`;
  
  return (
    <div className={optionClassName} onClick={handleSelect}>
      <Radio 
        checked={isSelected}
        disabled={isDisabled}
        className={styles.radio}
      >
        <span className={styles.optionText}>{option.text}</span>
      </Radio>
      
      {showCorrectAnswer && (
        <div className={styles.resultIcon}>
          {isCorrect && <CheckCircleFilled className={styles.correctIcon} />}
          {isIncorrect && <CloseCircleFilled className={styles.incorrectIcon} />}
        </div>
      )}
    </div>
  );
};

export default AnswerOption; 