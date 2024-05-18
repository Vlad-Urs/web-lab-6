import React, {useState} from 'react'
import './App.css'
import { Toggle } from './components/Toggle';
import useLocalStorage from 'use-local-storage';
import bron from './assets/the_bronze.png'


export const App = () => {
  const [isDark,setIsDark] = useLocalStorage("isDark",false);

  return (
    <div className="App" data-theme = {isDark ? "dark" : "light"}>
      
      <header className="app-header">
      <h1 className="logo">HOOPALYTIX</h1>
        <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
      </header>

      <h1 className="title">Hello world!</h1>
      <div className="box">
        <h2>This is a box</h2>
      </div>
    </div>
  );
};