from sqlalchemy import create_engine

def create_test_engine(tmp_path):
    # 使用 SQLite in-memory 或临时文件模拟 MySQL
    db_file = tmp_path / "test.db"
    engine = create_engine(f"sqlite:///{db_file}", future=True)
    return engine
