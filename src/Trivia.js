import React, { useState } from "react";
import { questions } from "./questions";
import {
  Box,
  Button,
  Checkbox,
  Text,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { Global } from "@emotion/react";

const Trivia = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill([])
  );
  const [showScore, setShowScore] = useState(false);
  const toast = useToast(); // Initialize toast

  const handleAnswerSelect = (index) => {
    setSelectedAnswers((prev) => {
      // Ensure prev[currentQuestion] is always an array (fallback to an empty array if undefined)
      const currentAnswers = [...(prev[currentQuestion] || [])];
      const answerLetter = String.fromCharCode(97 + index); // Convert index to letter (a, b, c, d)
  
      // Check for multiple selections
      if (currentAnswers.includes(answerLetter)) {
        return [
          ...prev.slice(0, currentQuestion),
          currentAnswers.filter((ans) => ans !== answerLetter), // Remove selected answer
          ...prev.slice(currentQuestion + 1),
        ];
      } else {
        // If already selected one answer, show toast
        if (currentAnswers.length >= 1) {
          toast({
            description: "hey man one answer at a time, this is really silly of you",
            status: "warning",
            duration: 8000,
            isClosable: true,
            position: "top-right", 
          });
        }
        return [
          ...prev.slice(0, currentQuestion),
          [...currentAnswers, answerLetter], // Add selected answer
          ...prev.slice(currentQuestion + 1),
        ];
      }
    });
  };
  

  const calculateScore = () => {
    let score = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer.includes(questions[index].correctAnswer)) {
        score++;
      }
    });
    return score;
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showScore) {
    const score = calculateScore();
    return (
      <>
        <Global
          styles={{
            body: {
              backgroundColor: "black",
              color: "white",
              margin: 0,
            },
          }}
        />
        <Box p={5} textAlign="center" marginTop="50px">
          <Heading fontSize={{ base: "2xl", md: "3xl" }} mb={4}>
            Your Score: {score} / {questions.length}
          </Heading>
          <Button
            mt={5}
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswers(Array(questions.length).fill([])); // Reset answers
              setShowScore(false);
            }}
            colorScheme="blue"
          >
            Restart Quiz
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Global
        styles={{
          body: {
            backgroundColor: "black",
            color: "white",
            margin: 0,
          },
        }}
      />
      <Box p={5} maxWidth="600px" mx="auto" marginTop="50px">
        <Text fontSize={{ base: "lg", md: "xl" }} mb={4}>
          {questions[currentQuestion].question}
        </Text>
        <VStack spacing={4} align="start">
          {questions[currentQuestion].options.map((option, index) => (
            <Checkbox
              key={index}
              isChecked={(selectedAnswers[currentQuestion] || []).includes(
                String.fromCharCode(97 + index)
              )}
              onChange={() => handleAnswerSelect(index)}
              size="lg"
              colorScheme="blue"
              mr={5}
            >
              {option}
            </Checkbox>
          ))}
        </VStack>
        <Box
          mt={5}
          display="flex"
          justifyContent="space-between"
          flexDirection={{ base: "column", md: "row" }}
          gap={4}
        >
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            colorScheme="gray"
          >
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={(selectedAnswers[currentQuestion] || []).length === 0}
            colorScheme="blue"
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Trivia;
