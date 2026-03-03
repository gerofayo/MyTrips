import { AppRouter } from "./routes/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <div className="app-layout">
      <ErrorBoundary>
        <main className="main-content">
          <AppRouter />
        </main>
      </ErrorBoundary>
    </div>
  );
}
export default App;