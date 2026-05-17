export type ImageCard = {
  face: string;
  label: string;
};

// Pexels images used as card faces — grouped by theme
export const IMAGE_POOL: readonly ImageCard[] = [
  {
    face: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Cat",
  },
  {
    face: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Dog",
  },
  {
    face: "https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Horse",
  },
  {
    face: "https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Elephant",
  },
  {
    face: "https://images.pexels.com/photos/46251/brown-bear-bear-wildlife-wilderness-46251.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Bear",
  },
  {
    face: "https://images.pexels.com/photos/39866/entrepreneur-startup-start-up-man-39866.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Lion",
  },
  {
    face: "https://images.pexels.com/photos/56733/pexels-photo-56733.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Panda",
  },
  {
    face: "https://images.pexels.com/photos/60013/desert-drought-dehydrated-clay-60013.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Desert",
  },
  {
    face: "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=200",
    label: "Mountain",
  },
  {
    face: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Ocean",
  },
  {
    face: "https://images.pexels.com/photos/355296/pexels-photo-355296.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Forest",
  },
  {
    face: "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=200",
    label: "Tiger",
  },
  {
    face: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Turtle",
  },
  {
    face: "https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Penguin",
  },
  {
    face: "https://images.pexels.com/photos/133459/pexels-photo-133459.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Parrot",
  },
  {
    face: "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Whale",
  },
  {
    face: "https://images.pexels.com/photos/158198/pexels-photo-158198.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Giraffe",
  },
  {
    face: "https://images.pexels.com/photos/750539/pexels-photo-750539.jpeg?auto=compress&cs=tinysrgb&w=200",
    label: "Zebra",
  },
];
