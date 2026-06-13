import os
from sqlalchemy import create_engine, text
from database.db import Base, engine

def add_cedula_column():
    """Agrega la columna cedula a la tabla usuarios si no existe"""
    
    with engine.connect() as conn:
        # Verificar si la columna ya existe
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios' AND column_name = 'cedula'
        """))
        
        if result.fetchone():
            print("La columna cedula ya existe en la tabla usuarios")
            return
        
        # Agregar la columna
        conn.execute(text("""
            ALTER TABLE usuarios 
            ADD COLUMN cedula VARCHAR(20)
        """))
        conn.commit()
        print("Columna cedula agregada exitosamente a la tabla usuarios")

if __name__ == "__main__":
    add_cedula_column()
