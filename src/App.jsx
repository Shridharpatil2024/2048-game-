import Board from './Board';


function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-amber-100 gap-6">
      <h1 className="text-5xl font-bold mb-4">2048</h1>
      <Board />
    </div>
  );
}

export default App;
