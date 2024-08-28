import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { removeUser } from "./features/userSlice";

function Navbar() {
  // const { user } = useSelector((state) => state.user);
  let user
  // const dispatch = useDispatch()
  let dispatch;
  return (
    <header>
      <nav className="flex justify-between bg-slate-200 py-2 px-2 shadow-lg">
        <h1 className="text-lg text-slate-900 bg-slate-300 px-2 rounded-md">
          User Auth
        </h1>
        <div className="space-x-3">
          {!user ? (
            <>
              <button className="bg-slate-900 px-2 py-1 rounded-md text-white">
                <Link to={"/register"}>Register</Link>
              </button>
              <button className="bg-slate-900 px-2 py-1 rounded-md text-white">
                <Link to={"/login"}>Login</Link>
              </button>
            </>
          ) : (
            <button className="bg-slate-900 px-2 py-1 rounded-md text-white">
              <Link to={"/login"} onClick={() => dispatch()}>
                Log out
              </Link>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
