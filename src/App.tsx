import * as React from "react";
import { initDB } from "react-indexed-db";
import { Route, Switch, useLocation } from "react-router-dom";

import "./App.css";
import { DBConfig } from "./DBConfig";
import Cart from "./components/Cart";
import BookTable from "./components/BookTable";
import json from "./books8f8fe52.json";

initDB(DBConfig);

export interface Book {
  bookID: number;
  title: string;
  authors: string;
  average_rating: number;
  isbn: string;
  language_code: string;
  ratings_count: number;
  price: number;
}

const App = () => {
  const location = useLocation();
  const [books, updateBooks] = React.useState<Array<Book>>([]);

  React.useEffect(() => {
    //@ts-ignore
    updateBooks(json);

    // fetch(
    //   "https://s3-ap-southeast-1.amazonaws.com/he-public-data/books8f8fe52.json"
    // )
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res && Array.isArray(res)) {
    //       updateBooks(
    //         res
    //       );
    //     }
    //   });
  }, []);

  if (books.length === 0) return <div className="p-8">Loading...</div>;

  return (
    <div className="App">
      <main className={`${location.pathname === "/" ? "lg:pr-64" : ""}`}>
        <Switch>
          <Route path="/" exact component={() => <BookTable data={books} />} />
          <Route component={() => <div>404 not found</div>} />
        </Switch>
      </main>
      <Cart />
    </div>
  );
};

export default App;
