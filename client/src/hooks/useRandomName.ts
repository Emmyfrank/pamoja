const adjectives = [
  "Happy",
  "Bright",
  "Gentle",
  "Kind",
  "Wise",
  "Brave",
  "Calm",
  "Clever",
  "Eager",
  "Fair",
  "Proud",
  "Quick",
  "Sweet",
  "Warm",
  "Young",
  "Peaceful",
  "Joyful",
  "Caring",
  "Honest",
  "Lively",
];

const nouns = [
  "Lion",
  "Eagle",
  "Dolphin",
  "Panda",
  "Tiger",
  "Zebra",
  "Giraffe",
  "Elephant",
  "Penguin",
  "Koala",
  "Butterfly",
  "Gazelle",
  "Deer",
  "Fox",
  "Wolf",
  "Bear",
  "Owl",
  "Swan",
  "Dove",
  "Rabbit",
];

const STORAGE_KEY = "pamoja_anonymous_username";

export const useRandomName = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  const newUsername = `${randomAdjective}${randomNoun}${randomNumber}`;

  localStorage.setItem(STORAGE_KEY, newUsername);
  return newUsername;
};
