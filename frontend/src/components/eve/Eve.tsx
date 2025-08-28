import { TbActivityHeartbeat } from 'react-icons/tb';

interface EveProps {
  size?: 'default' | 'large';
}

const Eve = ({ size = 'default' }: EveProps) => {
  const isLarge = size === 'large';
  
  return (
    <>
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
        <div className={`${
          isLarge 
            ? 'w-[10rem] md:w-[32rem] h-12 md:h-15' 
            : 'w-[20rem] md:w-[30rem] h-10 md:h-12'
        } bg-[#eae9e2] rounded-full flex items-center justify-center border`}>
          <button
            className={`${
              isLarge 
                ? 'w-10 h-10 md:w-12 md:h-12' 
                : 'w-8 h-8 md:w-10 md:h-10'
            } flex items-center justify-center hover:scale-110 duration-200`}
            style={{ 
              background: 'none',
              border: 'none',
              padding: 0,
              outline: 'none'
            }}
          >
            <TbActivityHeartbeat className={`${
              isLarge 
                ? 'h-20 w-20' 
                : 'h-16 w-16'
            } text-[#0b132b]`} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Eve;