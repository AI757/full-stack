import React from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import GamePage from "./GamePage";

function DedicatedGameRoute() {
  const { slug } = useParams();

  return (
    <GamePage
      slug={slug}
      homeHref="/"
      gamesHref="/#games"
      contactEmail="your-email@example.com"
      showStudioHeader={true}
    />
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Keep your existing routes here. */}
        <Route path="/games/:slug" element={<DedicatedGameRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
