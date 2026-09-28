import { useState } from "react";
import { languages } from "./data/languages";
import clsx from "clsx";
import { getFarewellText } from "./data/util";
import { getRandomWord } from "./data/util";
import Confetti from 'react-confetti'

export default function App() {
  //State

  const [currentWord, setCurrentWord] = useState(() => getRandomWord());

  const [guessedLetter, setGuessedLetter] = useState([]);

  //Static
  const letterArray = [...currentWord];

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const alphabetArray = [...alphabet];

  //Derived
  let wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter),
  ).length;

  const isGameWon = letterArray.every((letter) =>
    guessedLetter.includes(letter),
  );
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const resetGame = () => {
    setCurrentWord(getRandomWord());
    setGuessedLetter([]);
  };

  // Elements
  const languageElement = languages.map((lan, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const className = clsx("relative rounded px-2 py-1", {
      "before:content-['💀'] before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-[0.85rem] before:bg-black/70":
        isLanguageLost,
    });

    return (
      <span
        key={lan.name}
        style={{
          backgroundColor: lan.backgroundColor,
          color: lan.color,
        }}
        className={className}
      >
        {lan.name}
      </span>
    );
  });
  const letterElement = letterArray.map((letter, index) => {
    const setCondition = guessedLetter.includes(letter);
    const className = clsx(
      "flex h-10 w-10 items-center justify-center text-white border-b-3",
      {
        "border-white": !setCondition,
        "border-green-300": setCondition,
      },
    );
    return (
      <span
        key={index}
        style={{ backgroundColor: "#323232" }}
        className={className}
      >
        {guessedLetter.includes(letter) ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const keyboardElement = alphabetArray.map((letter) => {
    const isGuessed = guessedLetter.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx(
      "w-10 h-8 font-bold border border-white rounded-lg",
      {
        "bg-green-500": isCorrect,
        "bg-red-500": isWrong,
        "bg-orange-500": !isGuessed,
        "cursor-not-allowed opacity-50": isGameOver,
      },
    );
    return (
      <button
        disabled={isGameOver}
        aria-disabled={guessedLetter.includes(letter)}
        aria-label={`Letter ${letter}`}
        key={letter}
        onClick={() => addLetter(letter)}
        className={className}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const recentGuessedLetter = guessedLetter[guessedLetter.length - 1];
  const isWrongRecent =
    guessedLetter.length > 0 && !currentWord.includes(recentGuessedLetter);

  function addLetter(guessedLetter) {
    setGuessedLetter((prevLetter) =>
      prevLetter.includes(guessedLetter)
        ? prevLetter
        : [...prevLetter, guessedLetter],
    );
  }

  const gameStatus = clsx(
    "mt-8 w-70 h-16 flex justify-center items-center self-center",
    {
      "bg-[#10A95B]": isGameWon,
      "bg-[#BA2A2A]": isGameLost,
      "bg-yellow-300": isWrongRecent && !isGameOver,
    },
  );

  function renderGameStatus() {
    if (!isGameOver) {
      return null;
    }
    if (isGameWon) {
      return (
        <>
          <p>You Win!</p>
          <p>Congratulation!</p>
        </>
      );
    } else {
      return (
        <>
          <p>You Lose!</p>
          <>The word was {currentWord.toUpperCase()}</>
        </>
      );
    }
  }

  return (
    <>
      {isGameWon && <Confetti 
        recycle={false}
        numberOfPieces={1000}/>}
      <div className="flex justify-center items-center bg-gray-300 h-screen">
        <div className="w-200 h-150 border rounded-2xl bg-gray-700 pt-14 flex flex-col text-center">
          <header className="flex flex-col text-center text-white ">
            <h3 className="text-2xl font-bold">Assembly: Endgame</h3>
            <p className="mt-2">
              Guess the word in under 8 attempts to keep the programming world
              safe from Assembly!
            </p>
          </header>

          <div className={gameStatus}>
            <div className="font-bold">
              {isGameOver
                ? renderGameStatus()
                : isWrongRecent
                  ? getFarewellText(languages[wrongGuessCount - 1]?.name)
                  : null}
            </div>
          </div>

          <div className="self-center w-150 h-20 mt-4 flex flex-wrap content-center justify-center gap-2 p-3">
            {languageElement}
          </div>

          <div className=" w-150 h-20 self-center flex flex-wrap justify-center content-center gap-1 ">
            {letterElement}
          </div>

          <div className=" self-center w-100 h-40 mt-2 flex flex-wrap content-center justify-center gap-2 p-3">
            {keyboardElement}
          </div>

          <div className="mt-2 self-center">
            {isGameOver && (
              <button
                onClick={resetGame}
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white"
              >
                New Game
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
