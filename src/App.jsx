import React, {useState} from 'react'
import './App.css'
import { Toggle } from './components/Toggle';
import useLocalStorage from 'use-local-storage';
import bron from './assets/the_bronze.png'
import Card from './components/MainCards';
import Table from './components/Table';


export const App = () => {
  const [isDark,setIsDark] = useLocalStorage("isDark",false);
  const [ppg, setPPG] = useLocalStorage('ppg', 16.2);
  const [rpg, setRPG] = useLocalStorage('rpg', 11.8);
  const [apg, setAPG] = useLocalStorage('apg', 8.5);
  
  return (
    <div className="App" data-theme = {isDark ? "dark" : "light"}>
      
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
      <Table title="table"/>

      
    </div>
  );
};
