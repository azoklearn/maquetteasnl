import type { Metadata } from "next";
import { JeuClient } from "./JeuClient";

export const metadata: Metadata = {
  title: "Jeu – Quiz ASNL",
  description: "Testez vos connaissances sur l’AS Nancy Lorraine avec un quiz interactif.",
};

const QUESTIONS = [
  {
    question: "En quelle année a été fondé l’AS Nancy-Lorraine ?",
    options: ["1901", "1967", "1920", "1985"],
    correctIndex: 1,
  },
  {
    question: "Quel joueur emblématique français a débuté à Nancy ?",
    options: ["Zinedine Zidane", "Michel Platini", "Thierry Henry", "Karim Benzema"],
    correctIndex: 1,
  },
  {
    question: "Quel trophée majeur Nancy a-t-il remporté en 1978 ?",
    options: ["Ligue 1", "Coupe de France", "Coupe de la Ligue", "Trophée des Champions"],
    correctIndex: 1,
  },
  {
    question: "Comment s’appelle le stade de Nancy ?",
    options: [
      "Parc des Princes",
      "Stade Geoffroy-Guichard",
      "Stade Marcel-Picot",
      "Stade Vélodrome",
    ],
    correctIndex: 2,
  },
  {
    question: "Quelles sont les couleurs principales du club ?",
    options: ["Bleu et blanc", "Rouge et blanc", "Jaune et noir", "Vert et blanc"],
    correctIndex: 1,
  },
];

export default function JeuPage() {
  return <JeuClient questions={QUESTIONS} />;
}


