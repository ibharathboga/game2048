import {
  Info as AboutIcon,
  LogOut as SignOutIcon,
  UserRound as ProfileIcon,
  FileClock as HistoryIcon,
  Crown as LeaderBoardIcon,
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

function Header() {

  const { isAuthenticated, handleSignOut } = useAuth();

  return (
    <header>
      <button>
        <h1>
          <Link to="/">2048</Link>
        </h1>
      </button>
      <nav>
        {
          isAuthenticated
            ?
            <>
              <button>
                <Link to="/leaderboard">
                  <LeaderBoardIcon size={30} />
                </Link>
              </button>
              <button>
                <Link to="/history">
                  <HistoryIcon size={30} />
                </Link>
              </button>
              <button>
                <Link to="/profile">
                  <ProfileIcon size={30} />
                </Link>
              </button>
              <button onClick={handleSignOut}>
                <SignOutIcon size={30} />
              </button>
            </>
            : null
        }
        <button>
          <Link to="/about">
            <AboutIcon size={30} />
          </Link>
        </button>
      </nav>
    </header>
  )
}

export default Header