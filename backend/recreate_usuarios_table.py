from sqlalchemy import text
from database.db import engine

def recreate_usuarios_table():
    """Recrea la tabla usuarios con cedula como PK"""
    
    with engine.connect() as conn:
        # Eliminar la tabla usuarios si existe
        conn.execute(text("DROP TABLE IF EXISTS usuarios CASCADE"))
        conn.commit()
        
        # Crear la tabla usuarios con cedula como PK
        conn.execute(text("""
            CREATE TABLE usuarios (
                cedula VARCHAR(20) PRIMARY KEY NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                telefono VARCHAR(20),
                correo VARCHAR UNIQUE NOT NULL,
                password_hash VARCHAR NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                rol VARCHAR NOT NULL DEFAULT 'user'
            )
        """))
        conn.commit()
        
        print("Tabla usuarios recreada con cedula como PK")

if __name__ == "__main__":
    recreate_usuarios_table()
