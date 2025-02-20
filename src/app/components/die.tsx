const Die = ({ side }: { side: number }) => {

  // Generate the correct number of pips
  const pips = Array(side).fill(0).map((_, index) => (
    <div key={index} className="pip"></div>
  ));

  return (
    <div className={`dice dice-${side}`}>
      {pips}
    </div>
  );
};

export default Die;