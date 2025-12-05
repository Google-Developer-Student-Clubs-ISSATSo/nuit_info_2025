"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Trophy, Loader2, RefreshCw, X, Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import productsData from "@/data/open-source-products.json";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function SetupPage() {
  const params = useParams();
  const addXp = useAppStore((state) => state.addXp);
  
  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const productId = params.id as string;
  const product = productsData.find((p) => p.id === productId);

  // Fetch quiz from Gemini
  const fetchQuiz = useCallback(async () => {
    if (!product) return;
    
    setIsLoading(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setXpAwarded(false);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productName: product.name,
          productDescription: product.description 
        }),
      });

      if (!response.ok) throw new Error("Failed to generate quiz");

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [product]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  if (!product) {
    return <div className="container mx-auto p-12 text-center">Product not found</div>;
  }

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    if (selectedAnswer === questions[currentQuestion].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      // Award XP based on score
      if (!xpAwarded) {
        const earnedXp = Math.round((score / questions.length) * 200);
        addXp(earnedXp);
        setXpAwarded(true);
      }
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/alternatives">
            <ArrowLeft className="mr-2 w-4 h-4" /> Retour aux Alternatives
          </Link>
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          Quiz: <span className="text-primary">{product.name}</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Testez vos connaissances sur {product.name} et gagnez des XP !
        </p>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Progression</h3>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div 
                  key={q.id} 
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    i === currentQuestion ? "bg-primary/10 border border-primary/30" :
                    i < currentQuestion ? "bg-green-500/10" : "bg-secondary/50"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < currentQuestion ? "bg-green-500 text-white" :
                    i === currentQuestion ? "bg-primary text-white" : "bg-secondary"
                  }`}>
                    {i < currentQuestion ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="text-sm truncate">Question {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="font-semibold flex items-center gap-2 text-primary mb-2">
              <Trophy className="w-5 h-5" />
              Récompense
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Score actuel: <span className="font-bold text-foreground">{score}/{questions.length}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              XP potentiel: <span className="font-bold text-foreground">jusqu&apos;à 200 XP</span>
            </p>
          </div>
        </div>

        {/* Main Quiz Area */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border rounded-xl p-12 flex flex-col items-center justify-center h-[500px]"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <h2 className="text-xl font-semibold">Génération du quiz avec l&apos;IA...</h2>
              <p className="text-muted-foreground mt-2">Préparation des questions sur {product.name}</p>
            </motion.div>
          ) : isCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border rounded-xl p-12 flex flex-col items-center justify-center h-[500px] text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Quiz Terminé ! 🎉</h2>
              <p className="text-xl text-muted-foreground mb-4">
                Votre score: <span className="font-bold text-foreground">{score}/{questions.length}</span>
              </p>
              <p className="text-lg text-primary font-semibold mb-6">
                +{Math.round((score / questions.length) * 200)} XP gagnés !
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={fetchQuiz} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Nouveau Quiz
                </Button>
                <Button asChild>
                  <Link href="/alternatives">Retour aux Alternatives</Link>
                </Button>
              </div>
            </motion.div>
          ) : currentQ ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-xl overflow-hidden"
            >
              {/* Progress bar */}
              <div className="h-2 bg-secondary">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="p-8">
                {/* Question header */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestion + 1} sur {questions.length}
                  </span>
                  <span className="text-sm text-primary">Généré par IA ✨</span>
                </div>

                {/* Question */}
                <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  <AnimatePresence mode="wait">
                    {currentQ.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === currentQ.correctIndex;
                      const showResult = isAnswered;

                      let bgColor = "bg-secondary/50 hover:bg-secondary";
                      let borderColor = "border-transparent";
                      
                      if (isSelected && !showResult) {
                        bgColor = "bg-primary/10";
                        borderColor = "border-primary";
                      } else if (showResult) {
                        if (isCorrect) {
                          bgColor = "bg-green-500/10";
                          borderColor = "border-green-500";
                        } else if (isSelected && !isCorrect) {
                          bgColor = "bg-red-500/10";
                          borderColor = "border-red-500";
                        }
                      }

                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSelectAnswer(index)}
                          disabled={isAnswered}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${bgColor} ${borderColor} ${
                            isAnswered ? "cursor-default" : "cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              showResult && isCorrect ? "bg-green-500 text-white" :
                              showResult && isSelected && !isCorrect ? "bg-red-500 text-white" :
                              isSelected ? "bg-primary text-white" : "bg-secondary"
                            }`}>
                              {showResult && isCorrect ? <Check className="w-4 h-4" /> :
                               showResult && isSelected && !isCorrect ? <X className="w-4 h-4" /> :
                               String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1">{option}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Explanation */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`p-4 rounded-xl mb-6 ${
                      selectedAnswer === currentQ.correctIndex 
                        ? "bg-green-500/10 border border-green-500/30" 
                        : "bg-amber-500/10 border border-amber-500/30"
                    }`}
                  >
                    <p className="font-medium mb-1">
                      {selectedAnswer === currentQ.correctIndex ? "✅ Correct !" : "❌ Incorrect"}
                    </p>
                    <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-4">
                  {!isAnswered ? (
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      size="lg"
                    >
                      Valider
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion} size="lg">
                      {currentQuestion < questions.length - 1 ? "Question Suivante" : "Voir les Résultats"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
