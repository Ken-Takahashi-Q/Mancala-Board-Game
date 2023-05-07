import { useState, useEffect } from 'react'
import './App.scss'
import { BackwardOutlined, ForwardOutlined } from "@ant-design/icons"

export default function App() {
  const startPieces = 3;
  const rows = 3;
  const [player, setPlayer] = useState({"p1": startPieces, "p2": startPieces, "p3": startPieces});
  const [opponent, setOpponent] = useState({"o1": startPieces, "o2": startPieces, "o3": startPieces});

  const [leftBox, setLeftBox] = useState(0);
  const [rightBox, setRightBox] = useState(0);
  const playingSeq = ["p1", "p2", "p3", "rightBox", "o1", "o2", "o3", "leftBox"];
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(false);
  const [endTurn, setEndTurn] = useState(false);

  const [gameHistory, setGameHistory] = useState([{
    player: player,
    opponent: opponent,
    leftBox: leftBox,
    rightBox: rightBox,
    isPlayerTurn: isPlayerTurn,
    winner: winner,
    endTurn: endTurn
  }]);
  const [numTurn, setNumTurn] = useState(0);
  const delayTime = 500;

  const handleBoxClick = (boxName) => {
    setEndTurn(false);
    setNumTurn(numTurn + 1);
    const findPosition = (boxName) => playingSeq.indexOf(boxName);
    const position = findPosition(boxName);
  
    const selectedBox = boxName.includes("p") ? player[boxName] : opponent[boxName];
    const setSide = boxName.includes("p") ? setPlayer : setOpponent;
  
    setSide((prev) => ({ ...prev, [boxName]: 0 }));
  
    let i = 1;
    const interval = setInterval(() => {
      if (i > selectedBox) {
        clearInterval(interval);
        return;
      }
  
      const seq = playingSeq[(position + i) % 8];
      if (seq.includes("p")) {
        setPlayer((prev) => ({
          ...prev,
          [seq]: prev[seq] + 1,
        }));
      } else if (seq.includes("left")) {
        setLeftBox((prev) => prev + 1);
      } else if (seq.includes("right")) {
        setRightBox((prev) => prev + 1);
      } else {
        setOpponent((prev) => ({
          ...prev,
          [seq]: prev[seq] + 1,
        }));
      }
  
      i++;
    }, delayTime);

    const addTurnDelay = setInterval(() => {
      if (!(playingSeq[(position + selectedBox) % 8]).includes("Box")) {
        setIsPlayerTurn(!isPlayerTurn);
      }
      clearInterval(addTurnDelay);
      setEndTurn(true);
    }, delayTime * (selectedBox + 1));

    setGameHistory(prevState => {
      const newHistory = [...prevState];
      newHistory[numTurn] = {
        player: player,
        opponent: opponent,
        leftBox: leftBox,
        rightBox: rightBox,
        isPlayerTurn: isPlayerTurn,
        winner: winner,
        endTurn: endTurn
      };
      return newHistory;
    });
  };

  useEffect(() => {
    if (endTurn) {
      if (Object.values(player).every((value) => value === 0)) {
        setWinner("You");
      } else if (Object.values(opponent).every((value) => value === 0)) {
        setWinner("Opponent");
      }
    }
  }, [endTurn])

  const handleReload = () => {
    setPlayer({"p1": startPieces, "p2": startPieces, "p3": startPieces});
    setOpponent({"o1": startPieces, "o2": startPieces, "o3": startPieces});
    setLeftBox(0);
    setRightBox(0);
    setIsPlayerTurn(true);
    setWinner("");
    setEndTurn(false);
    setNumTurn(0);
  }

  const handleUndo = () => {
    setNumTurn(numTurn-1)
    let { player, opponent, leftBox, rightBox, isPlayerTurn, winner, endTurn } = gameHistory[numTurn-1]
    setPlayer({"p1": player["p1"], "p2": player["p2"], "p3": player["p3"]});
    setOpponent({"o1": opponent["o1"], "o2": opponent["o2"], "o3": opponent["o3"]});
    setLeftBox(leftBox);
    setRightBox(rightBox);
    setIsPlayerTurn(isPlayerTurn);
    setWinner(winner);
    setEndTurn(endTurn);
  }

  // const handleRedo = () => {
  //   let { player, opponent, leftBox, rightBox, isPlayerTurn, winner, endTurn } = gameHistory[numTurn]
  //   setPlayer({"p1": player["p1"], "p2": player["p2"], "p3": player["p3"]});
  //   setOpponent({"o1": opponent["o1"], "o2": opponent["o2"], "o3": opponent["o3"]});
  //   setLeftBox(leftBox);
  //   setRightBox(rightBox);
  //   setIsPlayerTurn(isPlayerTurn);
  //   setWinner(winner);
  //   setEndTurn(endTurn);
  // }

  return (
    <div className="boardgame">
      <div className="side-left">
        <div className={`each-box piece-${leftBox}`}>
          {Array.from({ length: leftBox }, (_, index) => (
            <div className="mancala" key={index}></div>
          ))}
        </div>
      </div>

      <div className="game-area">
        <div className={`side-opponent ${winner ? "disable" : isPlayerTurn ? "disable" : ""}`}>
          <div className={`side-opponent-box box-3`} onClick={() => handleBoxClick("o3")}>
            <div className={`each-box piece-${opponent["o3"]}`}>
              {Array.from({ length: opponent["o3"] }, (_, index) => (
                <div className="mancala" key={index}></div>
              ))}
            </div>
          </div>
          <div className="side-opponent-box box-2" onClick={() => handleBoxClick("o2")}>
            <div className={`each-box piece-${opponent["o2"]}`}>
              {Array.from({ length: opponent["o2"] }, (_, index) => (
                <div className="mancala" key={index}></div>
              ))}
            </div>
          </div>
          <div className="side-opponent-box box-1" onClick={() => handleBoxClick("o1")}>
            <div className={`each-box piece-${opponent["o1"]}`}>
              {Array.from({ length: opponent["o1"] }, (_, index) => (
                <div className="mancala" key={index}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="turn-info" key={isPlayerTurn}>
          <div className="turn-label" key={isPlayerTurn}>
            {winner ? (
              <h1>{winner} won!</h1>
            ) : (
              <h2>{isPlayerTurn ? "Your" : "Opponent's"} turn</h2>
            )}
          </div>

          <div className="game-control">
            <button className={`icon-button ${numTurn < 1 ? "disable" : ""}`} onClick={handleUndo}><BackwardOutlined/></button>
            <button className="restart-button" onClick={handleReload}>Restart</button>
            <button className="icon-button disable" onClick={handleUndo}><ForwardOutlined /></button>
          </div>
        </div>

        <div className={`side-player ${winner ? "disable" : isPlayerTurn ? "" : "disable"}`}>
          <div className="side-player-box box-1" onClick={() => handleBoxClick("p1")}>
            <div className={`each-box piece-${player["p1"]}`}>
              {Array.from({ length: player["p1"] }, (_, index) => (
                <div className="mancala" key={index}></div>
              ))}
            </div>
          </div>

          <div className="side-player-box box-2" onClick={() => handleBoxClick("p2")}>
            <div className={`each-box piece-${player["p2"]}`}>
              {Array.from({ length: player["p2"] }, (_, index) => (
                <div className="mancala" key={index}></div>
              ))}
            </div>
          </div>
          
          <div className="side-player-box box-3" onClick={() => handleBoxClick("p3")}>
            <div className={`each-box piece-${player["p3"]}`}>
              {Array.from({ length: player["p3"] }, (_, index) => (
                <div className="mancala" key={index}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="side-right">
        <div className={`each-box piece-${rightBox}`}>
          {Array.from({ length: rightBox }, (_, index) => (
            <div className="mancala" key={index}></div>
          ))}
        </div>
      </div>

    </div>
  )
}