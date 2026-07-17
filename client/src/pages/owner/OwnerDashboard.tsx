const OwnerDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Owner</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏨</span>
              <div>
                <h2 className="card-title text-lg">Total Properti</h2>
                <p className="text-3xl font-bold text-primary">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👥</span>
              <div>
                <h2 className="card-title text-lg">Total Admin</h2>
                <p className="text-3xl font-bold text-secondary">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div>
                <h2 className="card-title text-lg">Pendapatan</h2>
                <p className="text-3xl font-bold text-success">Rp 0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
