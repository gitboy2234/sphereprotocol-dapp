import "./App.css";
import Navbar from "./components/navbar/navbar";
import { useRoutes } from "react-router-dom";
import Maintenance from "./pages/maintenance";
import Scanner from "../src/pages/scanner/scanner";
// import NavbarSolo from "./components/navbar/navbarsolo";

function App() {
    let element = useRoutes([
        {
            path: "/",
            element: <Navbar />,
        },
        {
            path: "/dashboard",
            element: <Navbar />,
        },
        {
            path: "/dexlimit",
            element: <Maintenance />,
        },
        {
            path: "/swap",
            element: <Maintenance />,
        },
        {
            path: "/rugcheker",
            element: <Scanner />,
        },
        {
            path: "/locker",
            element: <Maintenance />,
        },
        {
            path: "/scan",
            element: <Maintenance />,
        },
        {
            path: "/wallet",
            element: <Maintenance />,
        },
    ]);
    return <div className="App bg-black ">{element}</div>;
}

export default App;
