import '../styles/Dashboard.css';


function ResidentsPage() {
    return (
        <div className="main-content">
            <header>
                <h1>Gestión de Residentes</h1>
                <button className="btn-add">+ Nuevo Residente</button>
            </header>
            
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Unidad</th>
                        <th>Nombre</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>A-101</td>
                        <td>Juan Pérez</td>
                        <td><span className="badge-paid">Al día</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
export default ResidentsPage;