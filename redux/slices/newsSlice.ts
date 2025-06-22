import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Article {
  title: string;
  author: string;
  publishedAt: string;
  url: string;
  urlToImage: string;
  content: string;
  description: string;
}

interface NewsState {
  articles: Article[];
}

const initialState: NewsState = {
  articles: [],
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
  },
});

export const { setArticles } = newsSlice.actions;
export default newsSlice.reducer;
