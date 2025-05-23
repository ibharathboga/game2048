import '../styles/about.css'
function AboutPage() {
  return (
    <div className="about-page">
      <h1>2048</h1>
      <p><strong>The 2048 game</strong> is a simple yet addictive puzzle game that challenges players to slide numbered tiles...</p>
      <ul>
        <li>The game board consists of a 4×4 grid.</li>
        <li>Players swipe left, right, up, or down to move all tiles.</li>
        <li>Tiles of the same value merge when they collide.</li>
        <li>The objective is to create a tile with the number 2048.</li>
      </ul>
      <p><strong>It’s a game that tests strategy, patience, and luck.</strong></p>
      <p><strong>Fun fact:</strong> It was created in 2014 by Gabriele Cirulli. Have you tried it? </p>
    </div>
  )
}

export default AboutPage