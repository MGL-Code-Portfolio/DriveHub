import { useState, useEffect } from 'react';
import SideBar from '../components/layout/SideBar.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import '../css/Garage.css';
import ConfirmDeleteVehicle from "../components/modals/ConfirmDeleteVehicle.jsx";
import AddVehicle from "../components/modals/AddVehicle.jsx";
import EditVehicle from "../components/modals/EditVehicle.jsx";
import api from '../api/axios';

function Garage() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [myVehicles, setMyVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVehicles = async () => {
        try {
            const res = await api.get('/vehicles/');
            setMyVehicles(res.data);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const vehicleStats = {
        totalVehicles: myVehicles.length,
        totalTypes: new Set(myVehicles.map(v => v.vehicle_type)).size,
    };

    const handleEdit = (e, vehicle) => {
        e.stopPropagation();
        setSelectedVehicle(vehicle);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (e, vehicle) => {
        e.stopPropagation();
        setSelectedVehicle(vehicle);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        setIsDeleteOpen(false);
        setSelectedVehicle(null);
        fetchVehicles();
    };

    return (
        <>
            <SideBar />
            <main className="main-content garage-page">

                <PageHeader
                    title="My Garage"
                    description={`Manage my collection (${vehicleStats.totalVehicles} vehicles)`}
                >
                    <div className="garage-stats-container d-flex justify-content-around align-items-center text-center rounded-3 p-2 mx-auto">
                        <div>
                            <h4 className="fw-bold mb-0 fs-5">{vehicleStats.totalVehicles}</h4>
                            <span className="text-white opacity-50 small">Vehicles</span>
                        </div>
                        <div className="garage-stat-divider"></div>
                        <div>
                            <h4 className="fw-bold mb-0 fs-5">{vehicleStats.totalTypes}</h4>
                            <span className="text-white opacity-50 small">Types</span>
                        </div>
                    </div>
                </PageHeader>

                <section className="garage-section">
                    <h2 className="fw-bold mb-4 text-dark fs-4">My Vehicles</h2>
                    {loading ? (
                        <p className="text-muted">Loading vehicles...</p>
                    ) : (
                        <div className="row">
                            {myVehicles.map((vehicle) => (
                                <div key={vehicle.id} className="col-lg-3 col-md-6 mb-4">
                                    <div className="card shadow-sm h-100 overflow-hidden">
                                        <img
                                            src={vehicle.car_picture || `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop`}
                                            className="card-img-top card-img-custom"
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-3">
                                            <h5 className="fw-bold text-dark mb-1 fs-5">{vehicle.brand} {vehicle.model}</h5>
                                            <p className="text-muted mb-3 small">{vehicle.year}</p>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-danger flex-grow-1 fw-semibold rounded-3 small"
                                                    onClick={(e) => handleDeleteClick(e, vehicle)}
                                                >
                                                    Remove Vehicle
                                                </button>
                                                <button
                                                    className="btn btn-light border rounded-3 d-flex align-items-center justify-content-center btn-edit-vehicle"
                                                    onClick={(e) => handleEdit(e, vehicle)}
                                                >
                                                    <i className="bi bi-gear-fill text-secondary"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="col-lg-3 col-md-6 mb-4" onClick={() => setIsAddOpen(true)}>
                                <div className="card h-100 d-flex align-items-center justify-content-center text-muted add-car-placeholder rounded-4">
                                    <div className="text-center">
                                        <div className="add-car-icon-wrap bg-white rounded-circle shadow-sm border d-flex align-items-center justify-content-center mx-auto mb-2">
                                            <i className="bi bi-plus-lg" style={{ fontSize: '1.2rem' }}></i>
                                        </div>
                                        <span className="fw-semibold text-dark small">Add New Vehicle</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <AddVehicle isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onVehicleAdded={fetchVehicles} />

            <EditVehicle
                isOpen={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedVehicle(null); }}
                vehicleData={selectedVehicle}
                onVehicleUpdated={fetchVehicles}
            />

            <ConfirmDeleteVehicle
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedVehicle(null); }}
                onConfirm={handleConfirmDelete}
                vehicleName={selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : ''}
                vehicleId={selectedVehicle?.id}
            />
        </>
    );
}

export default Garage;
