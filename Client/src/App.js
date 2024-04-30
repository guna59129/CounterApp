import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case "SETCOUNT":
      return { count: action.count };
    case "SETMYCOUNT":
      return { count: action.count, myCount: action.myCount };
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "MYINCREMENT":
      return { count: state.count, myCount: state.myCount + 1 };
    case "MYDECREMENT":
      return { count: state.count, myCount: state.myCount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <h1>My Counter Value:{state.myCount}</h1>
      <Link to="/counter">Counter</Link>
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/counter");
      dispatch({ type: "SETCOUNT", count: response.data.count });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/api/counter/increment");
      dispatch({ type: "INCREMENT" });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/api/counter/decrement");
      dispatch({ type: "DECREMENT" });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchMyCounter = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/mycounter");
      dispatch({
        type: "SETMYCOUNT",
        count: response.data.count,
        myCount: response.data.myCount,
      });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMyCounter();
  }, [fetchMyCounter]);

  const incrementMyCounter = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/api/mycounter/myincrement");
      dispatch({ type: "MYINCREMENT" });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementMyCounter = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/api/mycounter/mydecrement");
      dispatch({ type: "MYDECREMENT" });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>MyCounter</h2>
      <p>Count: {state.count}</p>
      <p>MyCount: {state.myCount}</p>
      <button onClick={incrementMyCounter}>MyIncrement</button>
      <button onClick={decrementMyCounter}>MyDecrement</button>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    myCount: 0,
  });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">MyCounter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
