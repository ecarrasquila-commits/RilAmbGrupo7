from sqlalchemy import text
from database.db import engine

def check_users():
    """Verifica si hay usuarios en la base de datos"""
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT cedula, nombre, apellido, correo, rol FROM usuarios"))
        users = result.fetchall()
        
        if users:
            print(f"Usuarios encontrados: {len(users)}")
            for user in users:
                print(f"  - Cédula: {user[0]}, Nombre: {user[1]} {user[2]}, Correo: {user[3]}, Rol: {user[4]}")
        else:
            print("No hay usuarios en la base de datos")

if __name__ == "__main__":
    check_users()
