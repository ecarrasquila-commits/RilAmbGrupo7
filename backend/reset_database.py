from sqlalchemy import create_engine, text
from database.db import engine

def reset_database():
    """Limpia las tablas y elimina la columna cedula"""
    
    with engine.connect() as conn:
        # Borrar todos los datos de las tablas que existen
        try:
            conn.execute(text("DELETE FROM password_resets"))
            conn.commit()
        except:
            conn.rollback()
        
        try:
            conn.execute(text("DELETE FROM user_devices"))
            conn.commit()
        except:
            conn.rollback()
        
        try:
            conn.execute(text("DELETE FROM sensor_readings"))
            conn.commit()
        except:
            conn.rollback()
        
        try:
            conn.execute(text("DELETE FROM alerts"))
            conn.commit()
        except:
            conn.rollback()
        
        conn.execute(text("DELETE FROM usuarios"))
        conn.commit()
        
        # Eliminar la columna cedula si existe
        conn.execute(text("""
            ALTER TABLE usuarios 
            DROP COLUMN IF EXISTS cedula
        """))
        conn.commit()
        
        print("Base de datos limpiada y columna cedula eliminada")

if __name__ == "__main__":
    reset_database()
