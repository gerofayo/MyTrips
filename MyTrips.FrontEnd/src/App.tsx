import { AppRouter } from "./routes/AppRouter";
import Navbar from "./components/Navbar";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <ErrorBoundary>
        <main className="main-content">
          <AppRouter />
        </main>
      </ErrorBoundary>
    </div>
  );
}
export default App;