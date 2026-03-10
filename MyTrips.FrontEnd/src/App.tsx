import { AppRouter } from "./routes/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import TopBar from "./components/TopBar";

function App() {
  return (
    <div className="app-layout">
      <TopBar />
      <ErrorBoundary>
        <main className="main-content">
          <AppRouter />
        </main>
      </ErrorBoundary>
    </div>
  );
}
export default App;
