import axios from "axios"
import { useEffect, useState } from "react"
import '../styles/history.css'

function HistoryPage() {

  const [history, setHistory] = useState([])

  const historyPageEffect = async () => {
    console.log('historyPageEffect:invoked')
    try {
      const response = await axios.get(
        'http://localhost:8000/scores/user',
        { withCredentials: true },
      )
      setHistory(prev => response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => { historyPageEffect(); }, [])

  return (
    <div className="history-page">
      <div className="history-container">
        <h2 className="history-title">Game History</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Duration(s)</th>
              <th>Highest Tile</th>
              <th>Moves</th>
              <th>Played At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={entry._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{entry.duration}</td>
                <td>{entry.highestTileScore}</td>
                <td>{entry.moves}</td>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HistoryPage