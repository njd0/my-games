import { Sudoku } from './components/Sudoku';

function App() {
  return (
    <div className="flex flex-col justify-stretch overflow-x-hidden">
      <header className='flex justify-between'>
        <div className='font-bold'>My Games</div>
        <div>Sudoku</div>
      </header>
      <div>
        <Sudoku />
      </div>
    </div>
  );
}

export default App;
