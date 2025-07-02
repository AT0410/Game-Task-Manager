import React, { useState } from "react";
import NavbarComp from "../components/Navbar";

function Home({ items, heading, onSelectItem }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <NavbarComp/>
  );
}

export default Home;
