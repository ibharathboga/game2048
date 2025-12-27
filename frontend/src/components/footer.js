import { useAuth } from "../providers/AuthProvider";

function Footer() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <footer>
      <p>signed in as, {user.username}</p>
    </footer>
  );
}

export default Footer;
