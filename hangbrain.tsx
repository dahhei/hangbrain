"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

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
  // Functional areas removed to avoid non-region terms

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

const MAX_WRONG_GUESSES = 6

export default function Component() {
  const [currentWord, setCurrentWord] = useState("")
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [regionInfo, setRegionInfo] = useState<
    | { title: string; description: string; url: string }
    | null
  >(null)
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))

  const initializeGame = () => {
    const randomWord = BRAIN_REGIONS[Math.floor(Math.random() * BRAIN_REGIONS.length)]
    setCurrentWord(randomWord)
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameStatus("playing")
  }

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    const storedWins = parseInt(localStorage.getItem("hangbrainWins") || "0", 10)
    const storedLosses = parseInt(localStorage.getItem("hangbrainLosses") || "0", 10)
    setWins(storedWins)
    setLosses(storedLosses)
  }, [])

  const handleGuess = useCallback(
    (rawLetter: string) => {
      const letter = rawLetter.toLowerCase()
      if (!letter || letter.length !== 1 || !/^[a-z]$/.test(letter)) {
        return
      }

      if (guessedLetters.includes(letter)) {
        toast({ title: "You already tried that letter" })
        return
      }

      const newGuessedLetters = [...guessedLetters, letter]
      setGuessedLetters(newGuessedLetters)

      if (!currentWord.includes(letter)) {
        setWrongGuesses((prev: number) => prev + 1)
      }
    },
    [guessedLetters, currentWord]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== "playing") return
      const key = e.key
      if (/^[a-zA-Z]$/.test(key)) {
        handleGuess(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleGuess, gameStatus])

  useEffect(() => {
    if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameStatus("lost")
    } else if (currentWord && currentWord.split("").every((letter) => guessedLetters.includes(letter))) {
      setGameStatus("won")
    }
  }, [wrongGuesses, guessedLetters, currentWord])

  useEffect(() => {
    if (gameStatus === "won") {
      setWins((prev) => {
        const updated = prev + 1
        localStorage.setItem("hangbrainWins", updated.toString())
        return updated
      })
    } else if (gameStatus === "lost") {
      setLosses((prev) => {
        const updated = prev + 1
        localStorage.setItem("hangbrainLosses", updated.toString())
        return updated
      })
    }
  }, [gameStatus])

  useEffect(() => {
    const fetchRegionInfo = async () => {
      if (gameStatus !== "won" && gameStatus !== "lost") {
        setRegionInfo(null)
        return
      }

      try {
        const searchResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
            currentWord,
          )}&limit=5&namespace=0&format=json&origin=*`,
        )
        const searchData = await searchResponse.json()
        if (!searchData || !searchData[1] || searchData[1].length === 0) {
          setRegionInfo(null)
          return
        }

        const titles: string[] = searchData[1]
        const descriptions: string[] = searchData[2]
        const urls: string[] = searchData[3]
        const keywords = [
          "brain",
          "neuro",
          "cortex",
          "lobe",
          "nucleus",
          "gyrus",
          "nerve",
          "cerebellum",
          "thalamus",
          "midbrain",
          "hypothalamus",
          "cerebral",
          "spinal",
        ]
        let info: { title: string; description: string; url: string } | null = null

        for (let i = 0; i < titles.length; i++) {
          const text = `${titles[i]} ${descriptions[i]}`.toLowerCase()
          if (!keywords.some((kw) => text.includes(kw))) continue
          try {
            const summaryResponse = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[i])}`,
            )
            if (!summaryResponse.ok) continue
            const summaryData = await summaryResponse.json()
            const summaryText = `${summaryData.title || titles[i]} ${summaryData.extract || ""}`.toLowerCase()
            if (keywords.some((kw) => summaryText.includes(kw))) {
              info = {
                title: summaryData.title || titles[i],
                description: summaryData.extract || descriptions[i] || "",
                url: summaryData.content_urls?.desktop?.page || urls[i] || "",
              }
              break
            }
          } catch {
            // ignore and try next result
          }
        }

        if (!info) {
          const fallbackTitle = titles[0]
          try {
            const summaryResponse = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(fallbackTitle)}`,
            )
            const summaryData = await summaryResponse.json()
            info = {
              title: summaryData.title || fallbackTitle,
              description: summaryData.extract || descriptions[0] || "",
              url: summaryData.content_urls?.desktop?.page || urls[0] || "",
            }
          } catch {
            info = {
              title: fallbackTitle,
              description: descriptions[0] || "",
              url: urls[0] || "",
            }
          }
        }

        setRegionInfo(info)
      } catch {
        setRegionInfo(null)
      }
    }

    fetchRegionInfo()
  }, [gameStatus, currentWord])

  const displayWord = currentWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ")

  // Remove the BrainDrawing component and use an image instead

  const getBrainOverlayStyle = () => {
    const overlayColors = [
      'rgba(255, 107, 107, 0)', // 0 wrong guesses - no overlay
      'rgba(255, 107, 107, 0.3)', // 1 wrong guess - frontal lobe (red)
      'rgba(78, 205, 196, 0.3)', // 2 wrong guesses - parietal lobe (teal)
      'rgba(69, 183, 209, 0.3)', // 3 wrong guesses - temporal lobe (blue)
      'rgba(150, 206, 180, 0.3)', // 4 wrong guesses - occipital lobe (green)
      'rgba(221, 160, 221, 0.3)', // 5 wrong guesses - cerebellum (purple)
    ]
    
    return {
      position: 'relative' as const,
      display: 'inline-block' as const,
    }
  }

  const getOverlayStyle = () => {
    const overlayColors = [
      'rgba(255, 107, 107, 0)', // 0 wrong guesses - no overlay
      'rgba(255, 107, 107, 0.3)', // 1 wrong guess - frontal lobe (red)
      'rgba(78, 205, 196, 0.3)', // 2 wrong guesses - parietal lobe (teal)
      'rgba(69, 183, 209, 0.3)', // 3 wrong guesses - temporal lobe (blue)
      'rgba(150, 206, 180, 0.3)', // 4 wrong guesses - occipital lobe (green)
      'rgba(221, 160, 221, 0.3)', // 5 wrong guesses - cerebellum (purple)
    ]
    
    return {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: overlayColors[Math.min(wrongGuesses, overlayColors.length - 1)],
      pointerEvents: 'none' as const,
      transition: 'background-color 0.3s ease',
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="max-w-screen-xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-purple-700 dark:text-purple-300">🧠 HangBrain</CardTitle>
            <p className="text-gray-600 dark:text-gray-300">Guess the brain region before all areas are colored!</p>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <div className="flex justify-center gap-4">
              <Badge variant="secondary">Wins: {wins}</Badge>
              <Badge variant="secondary">Losses: {losses}</Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Stats are stored in your browser. Switching browsers or clearing your cache will reset them.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Brain Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ position: 'relative', width: 400, height: 300 }}>
                <img src="/brain.png" alt="Brain" style={{ width: 400, height: 300, display: 'block' }} />
                <svg
                  width={400}
                  height={300}
                  style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                >
                  {wrongGuesses >= 1 && (
                    <rect x="0" y="0" width="400" height="50" fill="rgba(255,0,0,0.35)" />
                  )}
                  {wrongGuesses >= 2 && (
                    <rect x="0" y="50" width="400" height="50" fill="rgba(255,0,0,0.35)" />
                  )}
                  {wrongGuesses >= 3 && (
                    <rect x="0" y="100" width="400" height="50" fill="rgba(255,0,0,0.35)" />
                  )}
                  {wrongGuesses >= 4 && (
                    <rect x="0" y="150" width="400" height="50" fill="rgba(255,0,0,0.35)" />
                  )}
                  {wrongGuesses >= 5 && (
                    <rect x="0" y="200" width="400" height="50" fill="rgba(255,0,0,0.35)" />
                  )}
                  {wrongGuesses >= 6 && (
                    <rect x="0" y="250" width="400" height="50" fill="rgba(255,0,0,0.35)" />
                  )}
                </svg>
              </div>
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
                <div className="text-3xl font-mono font-bold tracking-wider mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-nowrap">
                  {displayWord}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Brain Region ({currentWord.length} letters)</p>
              </div>

              {gameStatus === "playing" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Letters:</p>
                    <div className="flex flex-wrap gap-1">
                      {alphabet.map((letter) => {
                        const guessed = guessedLetters.includes(letter)
                        const correct = guessed && currentWord.includes(letter)
                        return (
                          <Badge
                            key={letter}
                            onClick={() => handleGuess(letter)}
                            className={cn(
                              guessed
                                ? correct
                                  ? "bg-green-500 text-white cursor-not-allowed"
                                  : "bg-red-500 text-white cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 cursor-pointer"
                            )}
                          >
                            {letter.toUpperCase()}
                          </Badge>
                        )
                      })}
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
                  {regionInfo && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <p>
                        <strong>About {regionInfo.title}:</strong> {regionInfo.description}
                      </p>
                      {regionInfo.url && (
                        <a
                          href={regionInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-600"
                        >
                          Learn more on Wikipedia
                        </a>
                      )}
                    </div>
                  )}
                  <a
                    href={`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(
                      currentWord + " brain",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 block"
                  >
                    Not the correct page about the brain region? Click here to find the correct description
                  </a>
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
                  {regionInfo && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <p>
                        <strong>About {regionInfo.title}:</strong> {regionInfo.description}
                      </p>
                      {regionInfo.url && (
                        <a
                          href={regionInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-600"
                        >
                          Learn more on Wikipedia
                        </a>
                      )}
                    </div>
                  )}
                  <a
                    href={`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(
                      currentWord + " brain",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 block"
                  >
                    Not the correct page about the brain region? Click here to find the correct description
                  </a>
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
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Type or click letters to reveal the hidden brain region</li>
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
