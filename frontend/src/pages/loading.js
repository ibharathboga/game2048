import { Loader2 as LoadingIcon } from "lucide-react";
import "../styles/loading.css";

function LoadingPage() {
  return (
    <div className="loading-page">
      <LoadingIcon className="loading" />
    </div>
  );
}

export default LoadingPage;
