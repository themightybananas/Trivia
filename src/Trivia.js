import React, { useState, useEffect, useRef } from "react";
import { questions } from "./questions";
import soundtrack from './soundtrack.mp3';
import {
  Box,
  Button,
  Checkbox,
  Text,
  VStack,
  Heading,
  useToast,
  HStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { gsap } from "gsap";

const Trivia = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill([])
  );
  const [showScore, setShowScore] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // State for soundtrack
  const toast = useToast();

  // Refs for GSAP animations and soundtrack
  const questionRef = useRef(null);
  const optionsRef = useRef(null);
  const audioRef = useRef(null);

  // Animate question and options on question change
  const animateQuestion = () => {
    gsap.fromTo(
      optionsRef.current.children,
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 1.5,
        ease: "power3.out",
      }
    );
  };

  useEffect(() => {
    animateQuestion();
  }, [currentQuestion]);

  // Initialize soundtrack
  useEffect(() => {
    const audioElement = new Audio(soundtrack);
    audioElement.loop = true; // Enable looping
    audioRef.current = audioElement;

    return () => {
      if (audioElement) {
        audioElement.pause(); // Stop audio playback
        audioElement.src = ""; // Clear audio source
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

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
          currentAnswers.filter((ans) => ans !== answerLetter),
          ...prev.slice(currentQuestion + 1),
        ];
      } else {
        if (currentAnswers.length >= 1) {
          toast({
            description: "Hey, one answer at a time!",
            status: "warning",
            duration: 8000,
            isClosable: true,
            position: "top-right",
          });
        }
        return [
          ...prev.slice(0, currentQuestion),
          [...currentAnswers, answerLetter],
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

  if (showScore) {
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
          <Heading ref={questionRef} fontSize={{ base: "2xl", md: "3xl" }} mb={4}>
            Your Score: {calculateScore()} / {questions.length}
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
        <Button onClick={handlePlayPause} colorScheme="teal" mb={4}>
          {isPlaying ? "Pause Soundtrack" : "Play Soundtrack"}
        </Button>
        <Text ref={questionRef} fontSize={{ base: "lg", md: "xl" }} mb={4}>
          {questions[currentQuestion].question}
        </Text>
        <VStack ref={optionsRef} spacing={4} align="start">
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
              width="100%"
            >
              {option}
            </Checkbox>
          ))}
        </VStack>
        <VStack spacing={4} mt={4} width="100%">
          <HStack spacing={4} width="100%" justifyContent="space-between">
            <Button onClick={handlePreviousQuestion} isDisabled={currentQuestion === 0} flex={1}>
              Previous
            </Button>
            <Button onClick={handleNextQuestion} flex={1}>
              {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
            </Button>
          </HStack>
          <Button onClick={toggleShowAllQuestions} colorScheme="teal" width="100%">
            {showAllQuestions ? "Hide All Questions" : "Show All Questions"}
          </Button>
        </VStack>
        {showAllQuestions && (
          <Box mt={4} maxWidth="500px" mx="auto">
            <Wrap spacing={2} justify="center">
              {questions.map((question, index) => (
                <WrapItem key={index}>
                  <Button
                    onClick={() => handleQuestionSelect(index)}
                    colorScheme={currentQuestion === index ? "blue" : "gray"}
                    variant={currentQuestion === index ? "solid" : "outline"}
                    size="sm"
                    width="100px"
                    _hover={{
                      bg: currentQuestion === index ? "blue.600" : "gray.600",
                    }}
                  >
                    Question {index + 1}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Trivia;
