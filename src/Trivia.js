import React, { useState, useEffect } from "react";
import { questions } from "./questions";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Text,
  VStack,
  Heading,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { Global } from "@emotion/react";

const Trivia = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill([])
  );
  const [showScore, setShowScore] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const toast = useToast(); // Initialize toast

  // Load state from localStorage on initial render
  useEffect(() => {
    const storedCurrentQuestion = localStorage.getItem("currentQuestion");
    const storedAnswers = localStorage.getItem("selectedAnswers");

    if (storedCurrentQuestion !== null) {
      setCurrentQuestion(parseInt(storedCurrentQuestion, 10));
    }

    if (storedAnswers) {
      setSelectedAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  // Save current question and selected answers to localStorage
  useEffect(() => {
    localStorage.setItem("currentQuestion", currentQuestion);
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
  }, [currentQuestion, selectedAnswers]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswers((prev) => {
      const currentAnswers = [...(prev[currentQuestion] || [])];
      const answerLetter = String.fromCharCode(97 + index); // Convert index to letter (a, b, c, d)

      if (currentAnswers.includes(answerLetter)) {
        return [
          ...prev.slice(0, currentQuestion),
          currentAnswers.filter((ans) => ans !== answerLetter), // Remove selected answer
          ...prev.slice(currentQuestion + 1),
        ];
      } else {
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

  const handleQuestionSelect = (index) => {
    setCurrentQuestion(index);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(questions.length).fill([])); // Reset answers
    setShowScore(false);
    localStorage.clear(); // Clear localStorage when restarting
  };

  const toggleShowAllQuestions = () => {
    setShowAllQuestions(!showAllQuestions);
  };

  // Pagination Logic
  const itemsPerPage = 7;
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / itemsPerPage);

  const getPaginationItems = () => {
    let start = Math.max(0, currentQuestion - Math.floor(itemsPerPage / 2));
    let end = Math.min(start + itemsPerPage, totalPages);

    if (end - start < itemsPerPage) {
      start = Math.max(0, end - itemsPerPage);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
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
          <Button mt={5} onClick={restartQuiz} colorScheme="blue">
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
            variant="solid"
          >
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={(selectedAnswers[currentQuestion] || []).length === 0}
            colorScheme="blue"
            variant="solid"
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
          </Button>
        </Box>


        {/* Show All Questions Button */}
        <Box mt={4} textAlign="center">
          <Button
            onClick={toggleShowAllQuestions}
            colorScheme="blue"
            size="sm"
            variant="outline"
            _hover={{
              bg: "blue.600",
              color: "white",
            }}
          >
            {showAllQuestions ? "bit dissapointing isnt it" : "Explore into the unknown!"}
          </Button>
        </Box>

        {showAllQuestions && (
  <Box mt={4} maxWidth="500px" mx="auto">
    <HStack spacing={2} wrap="wrap">
      {questions.map((question, index) => (
        <Button
          key={index}
          onClick={() => handleQuestionSelect(index)}
          isDisabled={(selectedAnswers[index] || []).length === 0} // Disable if question is not answered
          colorScheme={currentQuestion === index ? "blue" : "gray"}
          variant={currentQuestion === index ? "solid" : "outline"}
          size="sm"
          flex="1 0 100px" // Flex grow and basis to control the size of buttons
          _hover={{
            bg: currentQuestion === index ? "blue.600" : "gray.600",
          }}
        >
          Question {index + 1}
        </Button>
      ))}
    </HStack>
  </Box>
)}

      </Box>
    </>
  );
};

export default Trivia;
