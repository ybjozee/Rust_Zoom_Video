use sqlx::{Error, SqlitePool};
use crate::model::Room;

#[derive(Clone)]
pub struct AppState {
    pub db: Database,
}

#[derive(Clone)]
pub struct Database {
    db: SqlitePool,
}

impl Database {
    pub fn new(db_pool: SqlitePool) -> Self {
        Self { db: db_pool }
    }

    pub async fn create_room(
        &self,
        name: String,
        passcode: Option<String>,
        identity: String,
    ) -> Result<Room, Error> {
        sqlx::query_as!(
            Room,
            "INSERT INTO room (name, passcode, identity) VALUES ($1, $2, $3) returning *",
            name,
            passcode,
            identity
        )
        .fetch_one(&self.db)
        .await
    }

    pub async fn get_all_rooms(&self) -> Result<Vec<Room>, Error> {
        sqlx::query_as!(Room, "SELECT * FROM room")
            .fetch_all(&self.db)
            .await
    }

    pub async fn get_room(&self, identity: &str) -> Result<Room, Error> {
        sqlx::query_as!(Room, "SELECT * FROM room where identity = $1", identity)
            .fetch_one(&self.db)
            .await
    }
}

