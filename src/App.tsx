import { ThemeProvider } from "./components/theme-provider";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { KanbanBoard } from "./components/kanban-board";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Todo List Application
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Organize your tasks with our intuitive Kanban board
              </p>
            </div>
            <KanbanBoard />
          </div>
          <ToastContainer />
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
