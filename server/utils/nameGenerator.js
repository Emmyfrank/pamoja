const adjectives = [
  "Anonymous",
  "Curious",
  "Friendly",
  "Gentle",
  "Happy",
  "Jolly",
  "Kind",
  "Lively",
  "Merry",
  "Nice",
  "Peaceful",
  "Quiet",
  "Ready",
  "Sweet",
  "Tender",
  "Wise",
];

const animals = [
  "Antelope",
  "Buffalo",
  "Cheetah",
  "Dolphin",
  "Elephant",
  "Fox",
  "Giraffe",
  "Hippo",
  "Impala",
  "Jaguar",
  "Kangaroo",
  "Lion",
  "Monkey",
  "Narwhal",
  "Octopus",
  "Panda",
  "Quokka",
  "Rabbit",
  "Seal",
  "Tiger",
  "Unicorn",
  "Vulture",
  "Whale",
  "Xerus",
  "Yak",
  "Zebra",
];

export const generateRandomName = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective}-${animal}`;
};
