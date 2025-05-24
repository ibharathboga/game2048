import axios from "axios"
import { useEffect, useState } from "react"

import '../styles/leaderboard.css'

function LeaderboardPage() {

  const [leaderboard, setLeaderboard] = useState([])

  const leaderboardPageEffect = async () => {
    console.log('leaderboardPageEffect:invoked')
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/scores/`,
        { withCredentials: true },
      )
      setLeaderboard(prev => response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => { leaderboardPageEffect(); }, [])

  return (
    <div className="leaderboard-page">
      <h2 className="leaderboard-title">Game Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Highest Tile Score</th>
            <th>Duration(s)</th>
            <th>Moves</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{entry.email}</td>
              <td>{entry.highestTileScore}</td>
              <td>{entry.duration}</td>
              <td>{entry.moves}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage