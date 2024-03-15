export const randomKeyword: string[] = [
  '셔츠원피스',
  '뉴에라',
  '키플링가방',
  '헌트이너웨어',
  '기프티콘',
  '닥스손수건',
  '레노마 키즈',
  '아디다스운동화',
  '쉬즈미스',
  '다이나핏',
];
export const randomIndex = Math.floor(Math.random() * randomKeyword.length);
export const initKeyword = randomKeyword[randomIndex];
