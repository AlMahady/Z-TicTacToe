import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import All from "./Components/All";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<All />} />
      </Routes>
    </Router>
  );
};

export default App;
