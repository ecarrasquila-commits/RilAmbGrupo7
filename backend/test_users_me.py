from sqlalchemy import text
from database.db import engine

def test_users_response():
    """Prueba la respuesta que debería devolver /users/me"""
    
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT cedula, nombre, apellido, telefono, correo, rol, is_active, created_at 
            FROM usuarios 
            WHERE correo = 'admin@rilamb.xyz'
        """))
        user = result.fetchone()
        
        if user:
            print("Usuario encontrado:")
            print(f"  - Cédula: {user[0]}")
            print(f"  - Nombre: {user[1]}")
            print(f"  - Apellido: {user[2]}")
            print(f"  - Teléfono: {user[3]}")
            print(f"  - Correo: {user[4]}")
            print(f"  - Rol: {user[5]}")
            print(f"  - Activo: {user[6]}")
            print(f"  - Creado: {user[7]}")
        else:
            print("Usuario no encontrado")

if __name__ == "__main__":
    test_users_response()
