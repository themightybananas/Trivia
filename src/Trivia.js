import React, { useState, useEffect, useRef } from "react";
import { questions } from "./questions";
import soundtrack from './soundtrack.mp3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAgreed, setIsAgreed] = useState(false);
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

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleAgree = () => {
    setIsAgreed(true);
    onClose();
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswers((prev) => {
      const currentAnswers = [...(prev[currentQuestion] || [])];
      const answerLetter = String.fromCharCode(97 + index); 

      if (currentAnswers.includes(answerLetter)) {
        return [
          ...prev.slice(0, currentQuestion),
          currentAnswers.filter((ans) => ans !== answerLetter),
          ...prev.slice(currentQuestion + 1),
        ];
      } else {
        if (currentAnswers.length >= 1) {
          toast({
            description: "You greedy one arent you!",
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="black" color="white">
          <ModalHeader>Terms and Agreement</ModalHeader>
          <ModalBody>
            <Text fontSize="lg" mb={4}>
              Please read and agree to the terms and conditions before starting the quiz.
            </Text>
            <Text fontSize="md" mb={2}>
              <strong>Terms and Agreement for Participation in Evil.inc Trivia</strong>
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>Effective Date:</strong> [this day]
            </Text>
            <Text fontSize="sm" mb={4}>
              Welcome to <strong>Evil.inc Trivia</strong> the (“Website”), made by so called "we" or as known as "themigthybananas" repository, where knowledge meets nonsense, and penis inspection ensues! By participating in our trivia quizzes, you agree to the following terms and conditions. Please read them carefully cause i say so.
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>1. Agreement to Participate Seriously</strong>
            </Text>
            <Text fontSize="sm" mb={2}>
              By accessing and using Evil.inc Trivia, you agree to:
              <ul>
                <li>Answer all questions with genuine effort and honesty, no matter how absurd they may seem.</li>
                <li>Avoid cheating, Googling, or telepathically contacting a trivia expert during the quiz (we know how tempting it is).</li>
              </ul>
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>2. Purpose of the Website</strong>
            </Text>
            <Text fontSize="sm" mb={4}>
              Evil.inc Trivia exists for something and such a things!.
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>3. Eligibility</strong>
            </Text>
            <Text fontSize="sm" mb={2}>
              Participants must:
              <ul>
                <li>Be of sufficient age to understand the humor in a question like, “What’s the airspeed velocity of an unladen swallow?”</li>
                <li>Have a sense of humor. since its the bare minimum</li>
                <li>Have the required corresponding limbs and organs (such as fingers, eyes and etc) to answer using their device</li>
              </ul>
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>4. Conduct of the Participant</strong>
            </Text>
            <Text fontSize="sm" mb={2}>
              When using Evil.inc, you agree to:
              <ul>
                <li>Take our quizzes in good faith.</li>
                <li>Not hold Evil.inc accountable for existential crises triggered by questions like, “What came first: the chicken or Joe Biden?”</li>
                <li>Respect our quirky trivia and not attempt to rewrite reality using intergalactic super powers.</li>
              </ul>
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>5. Accuracy of Responses</strong>
            </Text>
            <Text fontSize="sm" mb={4}>
              Evil.inc makes no guarantees about the accuracy or relevance of our trivia questions—or your answers. If a question about “how many jellybeans fit in the Eiffel Tower” causes confusion, that’s entirely the point.
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>6. Data Collection and Privacy</strong>
            </Text>
            <Text fontSize="sm" mb={4}>
              Evil.inc will and gladly collect your leaked data BUT, we promise not to sell your favorite trivia answer to the highest bidder as a gesture of respecting your privacy.
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>7. No Lawsuits, Please</strong>
            </Text>
            <Text fontSize="sm" mb={2}>
              By using this website, you agree not to sue Evil.inc for:
              <ul>
                <li>Being too silly.</li>
                <li>being too cool</li>
                <li>the really specific address that are totally a "joke"</li>
              </ul>
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>8. Termination of Fun</strong>
            </Text>
            <Text fontSize="sm" mb={2}>
              Evil.inc reserves the right to terminate your access to the website if you:
              <ul>
                <li>Take our questions too seriously (ironic, we know).</li>
                <li>Engage in behavior that disrupts the trivia experience for others, such as throwing a molotov at random pedestrian at 9 AM on a sunny Tuesday.</li>
              </ul>
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>9. Updates to These Terms</strong>
            </Text>
            <Text fontSize="sm" mb={4}>
              Evil.inc may update these terms from time to time. maybe tomorrow or even yesterday!
            </Text>
            <Text fontSize="sm" mb={2}>
              <strong>10. Acceptance of Terms</strong>
            </Text>
            <Text fontSize="sm" mb={4}>
              By participating in Evil.inc Trivia, you agree to these terms and conditions. If you do not agree, it means youre not awesome sauce.
            </Text>
            <Checkbox
              mt={4}
              isChecked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              size="lg"
            >
              I agree to the terms and conditions
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAgree} isDisabled={!isAgreed}>
              Agree
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box p={5} maxWidth="500px" mx="auto" marginTop="50px">
      <Button onClick={handlePlayPause} colorScheme="red" mb={4}>
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
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
                    colorScheme={currentQuestion === index ? "teal" : "gray"}
                    variant={currentQuestion === index ? "solid" : "outline"}
                    size="sm"
                    color="gray.400"
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
