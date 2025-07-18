"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const BRAIN_REGIONS = [
  // Cerebral cortex regions
  "frontal",
  "parietal",
  "temporal",
  "occipital",
  "insula",
  "cingulate",
  "precentral",
  "postcentral",
  "superior",
  "middle",
  "inferior",
  "angular",
  "supramarginal",
  "fusiform",
  "parahippocampal",

  // Subcortical structures
  "hippocampus",
  "amygdala",
  "thalamus",
  "hypothalamus",
  "subthalamus",
  "caudate",
  "putamen",
  "pallidum",
  "striatum",
  "claustrum",
  "nucleus",
  "accumbens",
  "substantia",
  "nigra",

  // Brainstem
  "midbrain",
  "pons",
  "medulla",
  "oblongata",
  "tegmentum",
  "tectum",
  "colliculus",
  "periaqueductal",
  "reticular",
  "raphe",

  // Cerebellum
  "cerebellum",
  "vermis",
  "hemisphere",
  "flocculus",
  "nodulus",
  "dentate",
  "interposed",
  "fastigial",

  // Limbic system
  "fornix",
  "mammillary",
  "septal",
  "olfactory",
  "piriform",
  "entorhinal",
  "perirhinal",
  "retrosplenial",

  // White matter tracts
  "corpus",
  "callosum",
  "commissure",
  "capsule",
  "corona",
  "radiata",
  "fasciculus",
  "cingulum",
  "uncinate",
  "arcuate",
  "longitudinal",

  // Ventricular system
  "ventricle",
  "lateral",
  "third",
  "fourth",
  "aqueduct",
  "choroid",

  // Cranial nerve nuclei
  "oculomotor",
  "trochlear",
  "trigeminal",
  "abducens",
  "facial",
  "vestibulocochlear",
  "glossopharyngeal",
  "vagus",
  "accessory",
  "hypoglossal",
  "olfactory",
  "optic",

  // Diencephalon
  "epithalamus",
  "pineal",
  "habenula",
  "geniculate",
  "pulvinar",

  // Additional regions
  "brodmann",
  "area",
  "gyrus",
  "sulcus",
  "fissure",
  "lobe",
  "cortex",
  "matter",
  "gray",
  "white",
  "meninges",
  "dura",
  "arachnoid",
  "subarachnoid",
  "cerebrospinal",
  "blood",
  "barrier",

  // Functional areas
  "motor",
  "sensory",
  "visual",
  "auditory",
  "language",
  "broca",
  "wernicke",
  "association",
  "primary",
  "secondary",
  "tertiary",

  // Cellular components
  "neuron",
  "axon",
  "dendrite",
  "synapse",
  "myelin",
  "glial",
  "astrocyte",
  "oligodendrocyte",
  "microglia",
  "ependymal",
]

const MAX_WRONG_GUESSES = 5

export default function Component() {
  const [currentWord, setCurrentWord] = useState("")
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [guess, setGuess] = useState("")

  const initializeGame = () => {
    const randomWord = BRAIN_REGIONS[Math.floor(Math.random() * BRAIN_REGIONS.length)]
    setCurrentWord(randomWord)
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameStatus("playing")
    setGuess("")
  }

  useEffect(() => {
    initializeGame()
  }, [])

  const handleGuess = () => {
    if (!guess || guess.length !== 1 || guessedLetters.includes(guess.toLowerCase())) {
      return
    }

    const letter = guess.toLowerCase()
    const newGuessedLetters = [...guessedLetters, letter]
    setGuessedLetters(newGuessedLetters)

    if (!currentWord.includes(letter)) {
      setWrongGuesses((prev) => prev + 1)
    }

    setGuess("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGuess()
    }
  }

  useEffect(() => {
    if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameStatus("lost")
    } else if (currentWord && currentWord.split("").every((letter) => guessedLetters.includes(letter))) {
      setGameStatus("won")
    }
  }, [wrongGuesses, guessedLetters, currentWord])

  const displayWord = currentWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ")

  const BrainDrawing = () => {
    return (
      <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
        {/* Brain outline and structure - always visible */}
        <g fill="none" stroke="#d1d5db" strokeWidth="1.5">
          {/* Main cerebrum outline */}
          <path d="M80 120 C75 90, 85 60, 110 45 C130 35, 155 30, 180 32 C210 35, 240 40, 270 50 C300 65, 320 85, 335 110 C345 130, 350 150, 345 170 C340 190, 330 205, 315 215 C300 225, 280 230, 260 235 L240 240 C220 242, 200 240, 180 235 C160 230, 140 220, 125 205 C110 190, 100 170, 95 150 C90 135, 85 125, 80 120 Z" />

          {/* Cerebellum outline */}
          <path d="M280 210 C290 205, 310 208, 325 215 C340 225, 345 240, 340 250 C335 260, 325 265, 310 267 C295 268, 280 265, 270 258 C265 250, 268 240, 275 230 C278 220, 280 215, 280 210 Z" />

          {/* Brainstem */}
          <path d="M240 240 C245 245, 248 255, 250 265 C252 275, 250 285, 245 290 C240 292, 235 290, 232 285 C230 275, 232 265, 235 255 C237 245, 240 240, 240 240 Z" />

          {/* Major sulci (brain folds) */}
          <path d="M140 80 C160 85, 180 95, 200 110 C220 125, 240 140, 260 155" strokeDasharray="2,2" opacity="0.6" />
          <path
            d="M110 130 C140 125, 170 128, 200 135 C230 142, 260 150, 290 160"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          <path d="M180 60 C185 80, 190 100, 195 120 C200 140, 205 160, 210 180" strokeDasharray="2,2" opacity="0.6" />

          {/* Corpus callosum */}
          <ellipse cx="200" cy="140" rx="40" ry="8" strokeDasharray="3,3" opacity="0.4" />
        </g>

        {/* Brain regions that get colored with wrong guesses */}

        {/* Frontal lobe */}
        {wrongGuesses >= 1 && (
          <path
            d="M80 120 C75 90, 85 60, 110 45 C130 35, 155 30, 180 32 C185 50, 190 70, 195 90 C200 110, 195 130, 185 145 C170 150, 155 148, 140 145 C125 140, 110 135, 100 128 C90 125, 85 122, 80 120 Z"
            fill="#ff6b6b"
            stroke="#e03131"
            strokeWidth="1"
            opacity="0.75"
          />
        )}

        {/* Parietal lobe */}
        {wrongGuesses >= 2 && (
          <path
            d="M180 32 C210 35, 240 40, 270 50 C300 65, 320 85, 335 110 C340 130, 335 145, 325 155 C310 165, 290 160, 270 155 C250 150, 230 145, 210 140 C200 135, 195 125, 195 115 C195 100, 190 85, 185 70 C182 50, 180 40, 180 32 Z"
            fill="#4ecdc4"
            stroke="#26a69a"
            strokeWidth="1"
            opacity="0.75"
          />
        )}

        {/* Temporal lobe */}
        {wrongGuesses >= 3 && (
          <path
            d="M140 145 C155 148, 170 150, 185 145 C200 140, 215 145, 230 150 C245 155, 260 160, 275 165 C285 175, 290 190, 285 205 C280 220, 270 230, 255 235 C240 238, 225 235, 210 230 C195 225, 180 218, 165 210 C150 200, 140 185, 135 170 C132 160, 135 152, 140 145 Z"
            fill="#45b7d1"
            stroke="#2196f3"
            strokeWidth="1"
            opacity="0.75"
          />
        )}

        {/* Occipital lobe */}
        {wrongGuesses >= 4 && (
          <path
            d="M325 155 C335 165, 345 180, 345 195 C340 210, 330 220, 315 225 C300 228, 285 225, 275 218 C270 210, 275 200, 280 190 C285 180, 290 170, 300 162 C310 158, 318 156, 325 155 Z"
            fill="#96ceb4"
            stroke="#4caf50"
            strokeWidth="1"
            opacity="0.75"
          />
        )}

        {/* Cerebellum */}
        {wrongGuesses >= 5 && (
          <path
            d="M280 210 C290 205, 310 208, 325 215 C340 225, 345 240, 340 250 C335 260, 325 265, 310 267 C295 268, 280 265, 270 258 C265 250, 268 240, 275 230 C278 220, 280 215, 280 210 Z"
            fill="#dda0dd"
            stroke="#9c27b0"
            strokeWidth="1"
            opacity="0.75"
          />
        )}

        {/* Additional anatomical details */}
        <g fill="none" stroke="#9ca3af" strokeWidth="0.8" opacity="0.5">
          {/* Gyri (brain ridges) */}
          <path d="M120 70 C140 75, 160 80, 180 85" />
          <path d="M125 95 C145 100, 165 105, 185 110" />
          <path d="M130 115 C150 120, 170 125, 190 130" />
          <path d="M200 70 C220 75, 240 80, 260 85" />
          <path d="M205 95 C225 100, 245 105, 265 110" />
          <path d="M210 115 C230 120, 250 125, 270 130" />

          {/* Cerebellum folds */}
          <path d="M285 225 C295 228, 305 230, 315 232" />
          <path d="M290 235 C300 238, 310 240, 320 242" />
          <path d="M295 245 C305 248, 315 250, 325 252" />
        </g>

        {/* Brain labels (small and subtle) */}
        <g fill="#6b7280" fontSize="10" fontFamily="Arial, sans-serif">
          <text x="200" y="20" textAnchor="middle" className="font-semibold">
            Lateral View
          </text>
        </g>
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-purple-700">🧠 HangBrain</CardTitle>
            <p className="text-gray-600">Guess the brain region before all areas are colored!</p>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Brain Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <BrainDrawing />
              <div className="text-center mt-4">
                <Badge variant={wrongGuesses >= MAX_WRONG_GUESSES ? "destructive" : "secondary"}>
                  Wrong guesses: {wrongGuesses}/{MAX_WRONG_GUESSES}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold tracking-wider mb-4 p-4 bg-gray-100 rounded-lg">
                  {displayWord}
                </div>
                <p className="text-sm text-gray-600">Brain Region ({currentWord.length} letters)</p>
              </div>

              {gameStatus === "playing" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value.slice(0, 1))}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter a letter"
                      className="text-center text-lg"
                      maxLength={1}
                    />
                    <Button onClick={handleGuess} disabled={!guess || guessedLetters.includes(guess.toLowerCase())}>
                      Guess
                    </Button>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Guessed letters:</p>
                    <div className="flex flex-wrap gap-1">
                      {guessedLetters.map((letter) => (
                        <Badge key={letter} variant={currentWord.includes(letter) ? "default" : "destructive"}>
                          {letter.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {gameStatus === "won" && (
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-green-600">🎉 Congratulations!</div>
                  <p>
                    You correctly guessed: <strong>{currentWord}</strong>
                  </p>
                  <Button onClick={initializeGame} className="w-full">
                    Play Again
                  </Button>
                </div>
              )}

              {gameStatus === "lost" && (
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-red-600">💀 Game Over!</div>
                  <p>
                    The brain region was: <strong>{currentWord}</strong>
                  </p>
                  <Button onClick={initializeGame} className="w-full">
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2">How to Play:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Guess letters to reveal the hidden brain region</li>
              <li>• Each wrong guess colors a different brain region</li>
              <li>• Win by guessing the word before all regions are colored</li>
              <li>• You have {MAX_WRONG_GUESSES} wrong guesses before you lose</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
