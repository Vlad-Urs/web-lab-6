// src/components/BasicTable.jsx
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Table.css'; // Import the CSS file


function createData(date, points, rebounds, assists, blocks) {
  return { date, points, rebounds, assists, blocks };
}

const rows = [
  createData('2024-05-01', 30, 12, 5, 2),
  createData('2024-05-02', 22, 10, 7, 1),
  createData('2024-05-03', 18, 8, 10, 3),
  createData('2024-05-04', 27, 14, 6, 2),
  createData('2024-05-05', 33, 11, 9, 4),
];

export default function BasicTable() {
  return (
    <TableContainer style={{ width: 980}} component={Paper} className="custom-table-container">
      <Table style={{ width: 980, margin: 'auto'}}  aria-label="simple table" className="custom-table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Date of Match</TableCell>
            <TableCell align="center">Points</TableCell>
            <TableCell align="center">Rebounds</TableCell>
            <TableCell align="center">Assists</TableCell>
            <TableCell align="center">Blocks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow>
               <TableCell align="center">{row.date}</TableCell>
              <TableCell align="center">{row.points}</TableCell>
              <TableCell align="center">{row.rebounds}</TableCell>
              <TableCell align="center">{row.assists}</TableCell>
              <TableCell align="center">{row.blocks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
