import notfound from "../assets/404.svg";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Oops!, Page not found</h1>
            <img src={notfound} alt="404 not found" className="home-image" />
            <div className="button-group">
                <button onClick={() => navigate("/")}>Home page</button>
            </div>  
        </div>
    );
};

export default NotFound;
