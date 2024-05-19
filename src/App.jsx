import React, { useEffect, useState } from 'react';
import './App.css';
import { Toggle } from './components/Toggle';
import useLocalStorage from 'use-local-storage';
import bron from './assets/the_bronze.png';
import Card from './components/MainCards';
import AddMatchForm from './components/AddMatchForm';
import db from './utils/db'; // Import the database instance

export const App = () => {
  const [isDark, setIsDark] = useLocalStorage("isDark", false);
  const [ppg, setPPG] = useLocalStorage('ppg', 16.2);
  const [rpg, setRPG] = useLocalStorage('rpg', 11.8);
  const [apg, setAPG] = useLocalStorage('apg', 8.5);

  useEffect(() => {
    updateAverages();
  }, []);

  async function updateAverages() {
    try {
      const matches = await db.matches.toArray();

      const totalMatches = matches.length;
      if (totalMatches === 0) {
        setPPG(0);
        setRPG(0);
        setAPG(0);
        return;
      }

      const totalPoints = matches.reduce((sum, match) => sum + match.points, 0);
      const totalRebounds = matches.reduce((sum, match) => sum + match.rebounds, 0);
      const totalAssists = matches.reduce((sum, match) => sum + match.assists, 0);

      setPPG((totalPoints / totalMatches).toFixed(1));
      setRPG((totalRebounds / totalMatches).toFixed(1));
      setAPG((totalAssists / totalMatches).toFixed(1));
    } catch (error) {
      console.error('Error updating averages:', error);
    }
  }

  return (
    <div className="App" data-theme={isDark ? "dark" : "light"}>
      <header className="app-header">
        <h1 className="logo">HOOPALYTIX</h1>
        <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
      </header>

      <div className='cards-container'>
        <Card
          title="PPG"
          value={ppg}
          growth="Since last month"
          growthPercentage="18.2%"
        />
        <Card
          title="APG"
          value={apg}
          growth="Since last month"
          growthPercentage="28.4%"
        />
        <Card
          title="RPG"
          value={rpg}
          growth="Since last month"
          growthPercentage="18.2%"
        />
      </div>

      <AddMatchForm updateAverages={updateAverages} />
    </div>
  );
};
