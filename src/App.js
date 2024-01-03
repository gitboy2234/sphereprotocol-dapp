import "./App.css";
import Navbar from "./components/navbar/navbar";
import { useRoutes } from "react-router-dom";
import Maintenance from "./pages/maintenance";
// import NavbarSolo from "./components/navbar/navbarsolo";

function App() {
    let element = useRoutes([
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
            element: <Maintenance />,
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
    return <div className="App ">{element}</div>;
}

export default App;
