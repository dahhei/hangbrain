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

  // Remove the BrainDrawing component and use an image instead

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
              <img src="/brain.png" alt="Brain" className="mx-auto" style={{ width: 400, height: 300 }} />
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
