import '../styles/Login.css';

function LoginPage() {
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>CondoApp</h2>
                <p>Bienvenido Administrador</p>
                <input type="email" placeholder="Correo electrónico" />
                <input type="password" placeholder="Contraseña" />
                <button className="btn-login">Entrar</button>
            </div>
        </div>
    );
}
export default LoginPage;