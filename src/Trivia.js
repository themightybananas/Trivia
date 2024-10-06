// src/Trivia.js
import React, { useState } from 'react';
import { questions } from './questions';
import { Box, Button, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';

const Trivia = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const handleNextQuestion = () => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = selectedAnswer;
      return newAnswers;
    });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleAnswerSelect = (value) => {
    setSelectedAnswer(value);
  };

  return (
    <Box p={5}>
      <Text fontSize="lg" mb={4}>{questions[currentQuestion].question}</Text>
      <RadioGroup onChange={handleAnswerSelect} value={selectedAnswer}>
        <Stack spacing={3}>
          {questions[currentQuestion].options.map((option, index) => (
            <Radio key={index} value={index}>
              {option}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <Box mt={5} display="flex" justifyContent="space-between">
        <Button onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
          Previous
        </Button>
        <Button onClick={handleNextQuestion} disabled={currentQuestion === questions.length - 1 || selectedAnswer === null}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Trivia;
