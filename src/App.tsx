import AppRoutes from "./routes";

const App = () => {
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  return <AppRoutes />;
};

export default App;
