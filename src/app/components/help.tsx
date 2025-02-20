const HelpSection = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <section>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">How to Play Farkle</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Basic Rules</h2>
          <p className="text-sm text-gray-600">
            Roll six dice and accumulate points to reach 10,000. Each player must set aside at least one scoring die per roll.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Scoring</h2>
            <div className="text-xs space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Single 1</span>
                <span>100</span>
              </div>
              <div className="flex justify-between">
                <span>Single 5</span>
                <span>50</span>
              </div>
              <div className="flex justify-between">
                <span>Three 1s</span>
                <span>1,000</span>
              </div>
              <div className="flex justify-between">
                <span>Three of a kind</span>
                <span>×100</span>
              </div>
              <div className="flex justify-between">
                <span>Straight (1-5)</span>
                <span>500</span>
              </div>
              <div className="flex justify-between">
                <span>Straight (2-6)</span>
                <span>750</span>
              </div>
              <div className="flex justify-between">
                <span>Full Straight</span>
                <span>1,500</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Key Concepts</h2>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700">Hot Dice</h3>
                <p className="text-xs text-gray-600">All dice score = roll again with points.</p>
              </div>
              
              <div className="p-2 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700">Farkle</h3>
                <p className="text-xs text-gray-600">No scoring dice = lose turn points.</p>
              </div>
              
              <div className="p-2 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700">Winning</h3>
                <p className="text-xs text-gray-600">First to 10,000 triggers final round.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpSection;
