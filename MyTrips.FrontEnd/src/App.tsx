import { AppRouter } from "./routes/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="app-layout">
      <ThemeToggle />
      <ErrorBoundary>
        <main className="main-content">
          <AppRouter />
        </main>
      </ErrorBoundary>
    </div>
  );
}
export default App;
