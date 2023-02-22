interface GutenDexBook {
  id: number;
  title: string;
  subjects: string[];
  authors: Person[];
  copyright: boolean;
}

interface GutenDexData {
  count: number;
  results: GutenDexBook[];
}

interface Person {
  birth_year: number;
  death_year: number;
  name: string;
}

interface SearchPrompt {
  type: "author" | "title";
  value: string;
}
